import { NFT_ABI } from '@/app/abis/nft';
import { sha256 } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { readContract } from '@wagmi/core';
import { ChangeEvent, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Address } from 'viem';
import { useWriteContract } from 'wagmi';
import z from 'zod';

import { wagmiAdapter } from '../providers/wallet-connect';

const formSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  calligraphyStyle: z.coerce.number().nonnegative(),
  presentationStyle: z.coerce.number().nonnegative(),
  composition: z.coerce.number().nonnegative(),
  decoration: z.coerce.number().nonnegative(),
  dominantColor: z.string().nonempty(),
});

export interface GenerateAttributesReponse {
  calligraphyStyle: number;
  composition: number;
  decoration: number;
  description: string;
  dominantColor: string;
  name: string;
  presentationStyle: number;
}

export const useCreateNFT = (address: Address | undefined) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      dominantColor: '#00d492',
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const [isGenerating, setIsGenerating] = useState({
    status: false,
    type: '' as 'details' | 'attributes' | 'details-attributes' | undefined,
  });

  const handleGenerate = useCallback(
    async (
      imageFile: File | null,
      type:
        | 'details'
        | 'attributes'
        | 'details-attributes' = 'details-attributes',
    ) => {
      if (!imageFile) {
        toast.error('Please upload an image file to generate attributes');
        return;
      }

      setIsGenerating({
        status: true,
        type,
      });
      // Generate cache key based on file and type
      const arrayBuffer = await imageFile.arrayBuffer();
      const hash = await sha256(arrayBuffer);
      const cacheKey = `generate-${type}-${hash}`;

      // Try get from cache
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        // Set form values sesuai tipe
        if (type === 'details') {
          form.reset({
            ...form.getValues(),
            name: data.name,
            description: data.description,
          });
        } else if (type === 'attributes') {
          form.reset({
            ...form.getValues(),
            calligraphyStyle: data.calligraphyStyle,
            presentationStyle: data.presentationStyle,
            composition: data.composition,
            decoration: data.decoration,
            dominantColor: data.dominantColor ?? '',
          });
        } else if (type === 'details-attributes') {
          form.reset({
            name: data.name,
            description: data.description,
            calligraphyStyle: data.calligraphyStyle,
            presentationStyle: data.presentationStyle,
            composition: data.composition,
            decoration: data.decoration,
            dominantColor: data.dominantColor ?? '',
          });
        }
        toast.success('Loaded from cache');
        setIsGenerating({ status: false, type: undefined });
        return;
      }
      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`/api/generate?type=${type}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to generate');
        }

        const data = await response.json();

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify(data));

        // Set form values sesuai tipe
        if (type === 'details') {
          form.reset({
            ...form.getValues(),
            name: data.name,
            description: data.description,
          });
        } else if (type === 'attributes') {
          form.reset({
            ...form.getValues(),
            calligraphyStyle: data.calligraphyStyle,
            presentationStyle: data.presentationStyle,
            composition: data.composition,
            decoration: data.decoration,
            dominantColor: data.dominantColor ?? '',
          });
        } else if (type === 'details-attributes') {
          form.reset({
            name: data.name,
            description: data.description,
            calligraphyStyle: data.calligraphyStyle,
            presentationStyle: data.presentationStyle,
            composition: data.composition,
            decoration: data.decoration,
            dominantColor: data.dominantColor ?? '',
          });
        }

        toast.success('Generated successfully');
      } catch (error) {
        console.error('Error generating:', error);
        toast.error('Failed to generate');
      } finally {
        setIsGenerating({
          status: false,
          type: undefined,
        });
      }
    },
    [form],
  );

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

        const isTokenURIUsed = await readContract(wagmiAdapter.wagmiConfig, {
          address: process.env.NEXT_PUBLIC_NFT_ADDRESS! as Address,
          abi: NFT_ABI,
          functionName: 'isTokenURIUsed',
          args: [pinataUploadResponseData.data.cid],
        });

        if (isTokenURIUsed) {
          toast.error(
            'This token URI is already used. Please use a different image file.',
          );
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
            BigInt(values.calligraphyStyle),
            BigInt(values.presentationStyle),
            BigInt(values.composition),
            BigInt(values.decoration),
            values.dominantColor,
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
    isGenerating,
    handleFileChange,
    onSubmit,
    form,
    handleGenerate,
  };
};
