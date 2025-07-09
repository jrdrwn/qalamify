'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, ImageIcon, Loader2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import ZoomableImage from '../shared/zoomable-image';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

export const editProfileFormSchema = z.object({
  username: z.string().min(1),
  fullName: z.string().min(1),
  bio: z.string().min(1),
  x: z.string(),
  instagram: z.string(),
  avatarURL: z.string(),
});

export default function EditProfileForm({
  onEditProfileAction,
  profile,
  isUpdateProfileLoading,
}: {
  onEditProfileAction: (values: z.infer<typeof editProfileFormSchema>) => void;
  profile?: z.infer<typeof editProfileFormSchema>;
  isUpdateProfileLoading?: boolean;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const form = useForm<z.infer<typeof editProfileFormSchema>>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: profile,
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }
    if (!file) {
      return;
    }
    setImageFile(null);
    setUploadLoading(true);
    const signedUrlResponse = await fetch('/api/pre-signed-url');
    if (!signedUrlResponse.ok) {
      toast.error('Failed to get pre-signed URL');
      return;
    }

    const { url } = await signedUrlResponse.json();

    const pinataBody = new FormData();

    pinataBody.append('file', file!);
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

    form.setValue(
      'avatarURL',
      `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${pinataUploadResponseData.data.cid}`,
    );
    setImageFile(file);
    setUploadLoading(false);
    toast.success('Image uploaded successfully');
  };

  return (
    <Sheet>
      <SheetTrigger asChild type="button">
        <Button variant="outline" size="sm" type="button">
          <Edit3 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onEditProfileAction)}
            className="flex h-full flex-col"
          >
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </SheetDescription>
            </SheetHeader>

            <div className="grid flex-1 auto-rows-min gap-4 px-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="x"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Instagram" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarURL"
                render={() => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {!uploadLoading && (
                        <Input
                          type="file"
                          id="file-upload"
                          accept="image/*"
                          onChange={handleFileChange}
                          name="file-upload"
                        />
                      )}
                    </label>
                    {/* Preview & Preview will showing */}
                    {imageFile || profile?.avatarURL ? (
                      <div className="mt-2 rounded-lg border-2 border-border p-1">
                        <ZoomableImage
                          src={
                            profile?.avatarURL ||
                            URL.createObjectURL(imageFile!)
                          }
                          alt="NFT Preview"
                          className="h-48 w-full cursor-zoom-in rounded-lg object-cover object-center"
                          width={400}
                          height={200}
                        />
                      </div>
                    ) : (
                      <div className="mt-2 flex h-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-4">
                        {uploadLoading ? (
                          <>
                            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                            <p className="text-center text-muted-foreground">
                              Uploading image...
                            </p>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="text-center text-muted-foreground">
                              Your Avatar will appear here
                            </p>
                          </>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter>
              <Button type="submit" disabled={isUpdateProfileLoading}>
                {isUpdateProfileLoading && <Loader2 className="animate-spin" />}
                Save changes
              </Button>
              <SheetClose asChild>
                <Button variant="outline" type="button">
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
