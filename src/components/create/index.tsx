'use client';

import KaligrafiNFT from '@/app/abis/KaligrafiNFT.json';
import ConfirmDialog from '@/components/shared/confrm-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAppKitAccount } from '@reown/appkit/react';
import { Image as ImageIcon, Palette, Sparkles, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';

import { Badge } from '../ui/badge';

const Create = () => {
  const { address } = useAppKitAccount();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    file: null as File | null,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
      toast.success('File uploaded successfully');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.file
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmMint = async () => {
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
      const file = formData.file;

      const pinataBody = new FormData();
      pinataBody.append('file', file!);
      pinataBody.append('network', 'public');
      pinataBody.append(
        'keyvalues',
        JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
        }),
      );
      const pinataUploadResponse = await fetch(url, {
        method: 'POST',
        body: pinataBody,
      });

      if (!pinataUploadResponse.ok) {
        toast.error('Pinata upload failed');
        return;
      }

      const pinataUploadResponseData = await pinataUploadResponse.json();

      const mintTokenData = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS! as `0x${string}`,
        abi: KaligrafiNFT.abi,
        functionName: 'mintToken',
        args: [pinataUploadResponseData.data.cid],
        account: address as `0x${string}`,
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
        file: null,
      });
    } catch (error) {
      toast.error('Failed to mint NFT', {
        description:
          'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="px-4 pt-8 pb-16">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge className="mb-4 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4" />
              Bismillahirrahmanirrahim
            </Badge>
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Mint Your <span className="text-primary">Qalam</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Transform your exquisite calligraphy into a unique NFT and share
              its beauty with the world.
            </p>
          </div>

          {/* Create Form */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* File Upload */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Upload Artwork
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col items-stretch justify-between">
                <div className="rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-primary">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      {formData.file ? (
                        <div className="w-full">
                          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-sm font-medium text-gray-900">
                            {formData.file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-lg font-medium">
                            Drop your file here, or browse
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG & JPG Max. 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {/* Preview & Preview will showing */}
                {formData.file ? (
                  <div className="mt-4 rounded-lg">
                    <Image
                      src={URL.createObjectURL(formData.file)}
                      alt="NFT Preview"
                      className="h-48 w-full rounded-lg object-cover object-center"
                      width={400}
                      height={200}
                    />
                  </div>
                ) : (
                  <div className="mt-4 flex h-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-center text-muted-foreground">
                      Your artwork will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* NFT Details */}
            <Card className="">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  NFT Details
                </CardTitle>
              </CardHeader>
              <form
                onSubmit={handleSubmit}
                className="flex h-full flex-col justify-between space-y-6"
              >
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter NFT name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your NFT"
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange('description', e.target.value)
                      }
                      className="resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange('category', value)
                      }
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kufi">Kufi</SelectItem>
                        <SelectItem value="naskhi">Naskhi</SelectItem>
                        <SelectItem value="tsuluts">Tsuluts</SelectItem>
                        <SelectItem value="farisi">Farisi</SelectItem>
                        <SelectItem value="riqah">Riq&apos;ah</SelectItem>
                        <SelectItem value="diwani">Diwani</SelectItem>
                        <SelectItem value="diwani-jali">Diwani Jali</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/*
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETH) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange('price', e.target.value)
                      }
                      required
                    />
                  </div> */}
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Minting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Create NFT
                      </>
                    )}
                  </Button>
                  <p className="text-center">
                    <span className="text-sm text-muted-foreground">
                      By clicking &quot;Create NFT&quot;, you agree to our{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Confirm NFT Creation"
        description={`Are you sure you want to mint "${formData.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmMint}
        confirmText="Mint NFT"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Create;
