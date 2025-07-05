import { NFT_ABI } from '@/app/abis/nft';
import { ChangeEvent, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Address } from 'viem';
import { useWriteContract } from 'wagmi';

export const useCreateNFT = (address: Address | undefined) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    imageURL: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !formData.name ||
        !formData.description ||
        !formData.category ||
        !imageFile
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      setShowConfirm(true);
    },
    [formData, imageFile],
  );

  const handleConfirmMint = useCallback(async () => {
    if (!address) {
      toast.warning('Please connect to a wallet');
      return;
    }
    setIsLoading(true);
    setShowConfirm(false);

    try {
      const signedUrlResponse = await fetch('/api/pre-signed-url');
      if (!signedUrlResponse.ok) {
        toast.error('Failed to get pre-signed URL');
        return;
      }

      const { url } = await signedUrlResponse.json();

      const pinataBody = new FormData();

      pinataBody.append('file', imageFile as Blob);
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

      const checkMetadataResponse = await fetch(
        `/api/metadata/${pinataUploadResponseData.data.cid}`,
      );
      if (!checkMetadataResponse.ok) {
        toast.error('Failed to fetch metadata', {
          description: 'Please try again later.',
        });
        return;
      }

      const metadataExists = await checkMetadataResponse.json();
      if (metadataExists.exists) {
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
          formData.name,
          formData.description,
          formData.category,
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

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        imageURL: '',
      });
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
  }, [address, imageFile, formData, writeContractAsync]);

  return {
    imageFile,
    formData,
    isLoading,
    showConfirm,
    setShowConfirm,
    handleFileChange,
    handleInputChange,
    handleSubmit,
    handleConfirmMint,
  };
};
