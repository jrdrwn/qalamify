'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Address } from 'viem';

import { Badge } from '../ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useCreateNFT } from './use-create-nft';

const Create = () => {
  const { address } = useAppKitAccount();
  const { imageFile, form, isLoading, handleFileChange, onSubmit } =
    useCreateNFT(address as Address | undefined);

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
                      {imageFile ? (
                        <div className="w-full">
                          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-sm font-medium text-foreground">
                            {imageFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-lg font-medium">
                            Drop your image here, or browse
                          </p>
                          <p className="text-sm text-muted-foreground">
                            PNG & JPG Max. 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {/* Preview & Preview will showing */}
                {imageFile ? (
                  <div className="mt-4 rounded-lg border-2 border-border p-1">
                    <Image
                      src={URL.createObjectURL(imageFile)}
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex h-full flex-col justify-between space-y-6"
                >
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter NFT name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              className="h-16 resize-none"
                              placeholder="Describe your NFT"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kufi">Kufi</SelectItem>
                                <SelectItem value="naskhi">Naskhi</SelectItem>
                                <SelectItem value="tsuluts">Tsuluts</SelectItem>
                                <SelectItem value="farisi">Farisi</SelectItem>
                                <SelectItem value="riqah">
                                  Riq&apos;ah
                                </SelectItem>
                                <SelectItem value="diwani">Diwani</SelectItem>
                                <SelectItem value="diwani-jali">
                                  Diwani Jali
                                </SelectItem>
                                <SelectItem value="lainnya">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
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
                        <a
                          href="/terms"
                          className="text-primary hover:underline"
                        >
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
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
