import { NFT_ABI } from '@/app/abis/nft';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import z from 'zod';

const formSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  category: z.string().nonempty(),
});

export const useCreateNFT = (address: Address | undefined) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }
    setImageFile(file);
    toast.success('File uploaded successfully');
  };

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (!address) {
        toast.warning('Please connect to a wallet');
        return;
      }
      setIsLoading(true);

      if (!imageFile) {
        toast.error('Please upload an image file');
        setIsLoading(false);
        return;
      }

      try {
        const signedUrlResponse = await fetch('/api/pre-signed-url');
        if (!signedUrlResponse.ok) {
          toast.error('Failed to get pre-signed URL');
          return;
        }

        const { url } = await signedUrlResponse.json();

        const pinataBody = new FormData();

        pinataBody.append('file', imageFile!);
        pinataBody.append('network', 'public');

        const pinataUploadResponse = await fetch(url, {
          method: 'POST',
          body: pinataBody,
        });

        if (!pinataUploadResponse.ok) {
          toast.error('Pinata upload failed');
          return;
        }

        const pinataUploadResponseData = await pinataUploadResponse.json();

        if (pinataUploadResponseData.data.is_duplicate) {
          toast.error('Metadata already exists for this CID', {
            description: 'Please use a different image or CID.',
          });
          return;
        }

        const mintTokenData = await writeContractAsync({
          address: process.env.NEXT_PUBLIC_NFT_ADDRESS! as Address,
          abi: NFT_ABI,
          functionName: 'mintToken',
          args: [
            pinataUploadResponseData.data.cid,
            values.name,
            values.description,
            values.category,
          ],
          account: address as Address,
        });

        if (!mintTokenData) {
          toast.error('Failed to mint NFT');
          return;
        }

        toast.success('NFT minted successfully!', {
          description:
            'Your NFT has been created and is now available in your profile.',
        });

        form.reset();
        setImageFile(null);
      } catch (error) {
        console.error('Minting error:', error);
        toast.error('Failed to mint NFT', {
          description:
            'Please try again or contact support if the problem persists.',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [address, imageFile, writeContractAsync, form],
  );

  return {
    imageFile,
    isLoading,
    handleFileChange,
    onSubmit,
    form,
  };
};
