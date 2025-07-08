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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react';
import {
  Check,
  ChevronsUpDown,
  Component,
  Image as ImageIcon,
  Loader2,
  Palette,
  Sparkles,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import { Address } from 'viem';

import { Badge } from '../ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useCreateNFT } from './use-create-nft';

export const calligraphyStyles = [
  {
    id: 1,
    label: 'Naskh',
    description: 'A cursive style known for its legibility and elegance.',
  },
  {
    id: 2,
    label: 'Thuluth',
    description:
      'A decorative style characterized by elongated letters and intricate designs.',
  },
  {
    id: 3,
    label: 'Diwani',
    description:
      'A cursive style with a flowing, artistic appearance, often used in royal documents.',
  },
  {
    id: 4,
    label: 'Kufi',
    description:
      'An angular, geometric style known for its bold and structured letters.',
  },
  {
    id: 5,
    label: "Ruq'ah",
    description:
      'A simple, modern style that is easy to read and commonly used in everyday writing.',
  },
  {
    id: 0,
    label: 'Other',
  },
];

export const presentationStyles = [
  {
    id: 1,
    label: 'Traditional',
    description: 'Classic presentation with a focus on calligraphy.',
  },
  {
    id: 2,
    label: 'Decorative',
    description: 'Emphasizes artistic elements and embellishments.',
  },
  {
    id: 3,
    label: 'Contemporary',
    description: 'Modern presentation with a minimalist approach.',
  },
  {
    id: 0,
    label: 'Other',
  },
];

export const compositions = [
  {
    id: 1,
    label: 'Sprial',
    description: 'A spiral composition that draws the eye inward.',
  },
  {
    id: 2,
    label: 'Vertical',
    description: 'A vertical composition that emphasizes height and flow.',
  },
  {
    id: 3,
    label: 'Horizontal',
    description: 'A horizontal composition that creates a sense of balance.',
  },
  {
    id: 0,
    label: 'Other',
  },
];

export const decorations = [
  {
    id: 1,
    label: 'Floral',
    description: 'Incorporates floral motifs and patterns.',
  },
  {
    id: 2,
    label: 'Geometric',
    description: 'Features geometric shapes and designs.',
  },
  {
    id: 3,
    label: 'Abstract',
    description: 'Uses abstract forms and colors for a modern look.',
  },
  {
    id: 4,
    label: 'Minimalist',
    description: 'A clean, simple design with minimal embellishments.',
  },
  {
    id: 0,
    label: 'Other',
  },
];

const Create = () => {
  const { address } = useAppKitAccount();
  const {
    imageFile,
    form,
    isLoading,
    handleFileChange,
    onSubmit,
    handleGenerate,
    isGenerating,
    checkLoading,
  } = useCreateNFT(address as Address | undefined);
  return (
    <div className="">
      <div className="px-4 pt-8 pb-16">
        <div className="container mx-auto">
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* File Upload */}
              <Card className="order-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Upload Artwork
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex h-full flex-col items-stretch justify-between">
                  <div className="rounded-lg border-2 border-dashed border-border p-4 text-center transition-colors hover:border-primary">
                    {!checkLoading && (
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        name="file-upload"
                      />
                    )}
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
                      {checkLoading ? (
                        <>
                          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                          <p className="text-center text-muted-foreground">
                            Checking image...
                          </p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                          <p className="text-center text-muted-foreground">
                            Your artwork will appear here
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* NFT Details */}
              <Card className="order-3 md:col-span-2 lg:order-2 lg:col-span-1">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Details
                  </CardTitle>
                  <Button
                    size={'sm'}
                    variant="outline"
                    type="button"
                    onClick={() => handleGenerate(imageFile, 'details')}
                  >
                    {isGenerating.status && isGenerating.type === 'details' ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="text-primary" />
                        Generate
                      </>
                    )}
                  </Button>
                </CardHeader>
                <div className="flex h-full flex-col justify-between space-y-6">
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
                              className="h-28 resize-none"
                              placeholder="Describe your NFT"
                              {...field}
                            />
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
                      <span className="text-xs text-muted-foreground">
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
                </div>
              </Card>

              {/* Attributes */}
              <Card className="order-2 lg:order-3">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Component className="h-5 w-5" />
                    Attributes
                  </CardTitle>
                  <Button
                    size={'sm'}
                    variant="outline"
                    type="button"
                    onClick={() => handleGenerate(imageFile, 'attributes')}
                  >
                    {isGenerating.status &&
                    isGenerating.type === 'attributes' ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="text-primary" />
                        Extract
                      </>
                    )}
                  </Button>
                </CardHeader>
                <div className="flex h-full flex-col justify-between space-y-6">
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="calligraphyStyle"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>Calligraphy Style</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={
                                    formState.errors.calligraphyStyle
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                  role="combobox"
                                  className={cn(
                                    'justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? calligraphyStyles.find(
                                        (cs) => cs.id === field.value,
                                      )?.label
                                    : 'Select'}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search"
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>Not found</CommandEmpty>
                                  <CommandGroup>
                                    {calligraphyStyles.map((cs) => (
                                      <CommandItem
                                        key={cs.id}
                                        value={cs.id.toString()}
                                        onSelect={() => {
                                          form.setValue(
                                            'calligraphyStyle',
                                            cs.id,
                                          );
                                        }}
                                      >
                                        {cs.label}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            cs.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="presentationStyle"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>Presentation Style</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={
                                    formState.errors.calligraphyStyle
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                  role="combobox"
                                  className={cn(
                                    'justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? presentationStyles.find(
                                        (ps) => ps.id === field.value,
                                      )?.label
                                    : 'Select'}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search"
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>Not found</CommandEmpty>
                                  <CommandGroup>
                                    {presentationStyles.map((ps) => (
                                      <CommandItem
                                        key={ps.id}
                                        value={ps.id.toString()}
                                        onSelect={() => {
                                          form.setValue(
                                            'presentationStyle',
                                            ps.id,
                                          );
                                        }}
                                      >
                                        {ps.label}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            ps.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="composition"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>Composition</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={
                                    formState.errors.calligraphyStyle
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                  role="combobox"
                                  className={cn(
                                    'justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? compositions.find(
                                        (cp) => cp.id === field.value,
                                      )?.label
                                    : 'Select'}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search"
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>Not found</CommandEmpty>
                                  <CommandGroup>
                                    {compositions.map((cp) => (
                                      <CommandItem
                                        key={cp.id}
                                        value={cp.id.toString()}
                                        onSelect={() => {
                                          form.setValue('composition', cp.id);
                                        }}
                                      >
                                        {cp.label}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            cp.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="decoration"
                      render={({ field, formState }) => (
                        <FormItem>
                          <FormLabel>Decoration</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={
                                    formState.errors.calligraphyStyle
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                  role="combobox"
                                  className={cn(
                                    'justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? decorations.find(
                                        (dc) => dc.id === field.value,
                                      )?.label
                                    : 'Select'}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search"
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>Not found</CommandEmpty>
                                  <CommandGroup>
                                    {decorations.map((dc) => (
                                      <CommandItem
                                        key={dc.id}
                                        value={dc.id.toString()}
                                        onSelect={() => {
                                          form.setValue('decoration', dc.id);
                                        }}
                                      >
                                        {dc.label}
                                        <Check
                                          className={cn(
                                            'ml-auto',
                                            dc.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dominantColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dominant Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-3">
                              <label
                                htmlFor="dominantColor"
                                className="flex flex-1 items-center gap-2"
                              >
                                <input
                                  id="dominantColor"
                                  type="color"
                                  {...field}
                                  className="sr-only"
                                />
                                <div
                                  className="h-9 flex-1 rounded-md border-2 border-border shadow-inner"
                                  style={{
                                    backgroundColor: field.value,
                                    boxShadow: `inset 0 2px 4px ${field.value}40`,
                                  }}
                                />
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground uppercase">
                                    {field.value}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </div>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Create;
