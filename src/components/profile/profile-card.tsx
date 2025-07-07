'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, ExternalLink, Heart, Plus, Store, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Address, formatEther } from 'viem';
import { z } from 'zod';

import { INFT } from '../explore/card-nft';
import { Skeleton } from '../ui/skeleton';
import CardNFTProfile from './card-nft';
import EditProfileForm, { editProfileFormSchema } from './edit-form';

interface ProfileProps {
  address: Address;
  profile?: z.infer<typeof editProfileFormSchema>;
  userStatisticsData?: readonly [bigint, bigint, bigint];
  tokensOwnedByMeData?: readonly bigint[];
  tokensCreatedByMeData?: readonly bigint[];
  favoritesData?: readonly bigint[];
  fetchItemsBySellerData?: readonly INFT[];
  isEditable?: boolean;
  onEditProfile?: (values: z.infer<typeof editProfileFormSchema>) => void;
  isUpdateProfileLoading?: boolean;
}

const Profile = ({
  address,
  profile,
  userStatisticsData,
  tokensOwnedByMeData,
  tokensCreatedByMeData,
  fetchItemsBySellerData,
  favoritesData,
  isEditable = false,
  onEditProfile,
  isUpdateProfileLoading = false,
}: ProfileProps) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(address || '');
    toast.success('Address copied to clipboard');
  };

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16">
      {/* Profile Section */}
      <div className="relative">
        <div className="relative container mx-auto px-2">
          <Card className="relative z-10">
            <CardContent>
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-border">
                      <AvatarImage src={profile.avatarURL} />
                      <AvatarFallback>
                        {profile.username?.[0] || 'N'}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col gap-3">
                      <Badge>
                        @{profile.username || 'Username is not set'}
                      </Badge>
                      <h1 className="text-3xl font-bold">
                        {profile.fullName || 'Name is not set'}
                      </h1>
                    </div>
                    <p className="max-w-2xl leading-relaxed text-muted-foreground">
                      {profile.bio || 'Bio is not set.'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditable && (
                  <div className="flex gap-3 lg:ml-auto">
                    <EditProfileForm
                      profile={profile}
                      onEditProfileAction={onEditProfile!}
                      isUpdateProfileLoading={isUpdateProfileLoading}
                    />
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-5 lg:grid-cols-7">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {tokensCreatedByMeData?.length || 0}
                  </div>
                  <div className="text-sm text-foreground/50">Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {tokensOwnedByMeData?.length || 0}
                  </div>
                  <div className="text-sm text-foreground/50">Owned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {favoritesData?.length || 0}
                  </div>
                  <div className="text-sm text-foreground/50">Favorited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {fetchItemsBySellerData?.length || 0}
                  </div>
                  <div className="text-sm text-foreground/50">For Sale</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {userStatisticsData && userStatisticsData[0]}
                  </div>
                  <div className="text-sm text-foreground/50">Total Sales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {userStatisticsData && formatEther(userStatisticsData[1])}
                  </div>
                  <div className="text-sm text-foreground/50">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {userStatisticsData && formatEther(userStatisticsData[2])}
                  </div>
                  <div className="text-sm text-foreground/50">
                    Royalty Earned
                  </div>
                </div>
              </div>

              {/* Social Links & Address */}
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4" />
                  <span className="rounded-lg bg-muted px-3 py-1 font-mono">
                    {address}
                  </span>
                  <Button variant="ghost" size="sm" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                {profile.x && (
                  <a
                    href={`https://x.com/${profile.x.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    @{profile.x}
                  </a>
                )}
                {profile.instagram && (
                  <a
                    href={`https://instagram.com/${profile.instagram.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    @{profile.instagram}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto mt-8 px-2">
        <Tabs defaultValue="owned">
          <Card>
            <CardHeader>
              <TabsList className="w-full">
                <TabsTrigger value="owned">
                  <Wallet className="mr-2 h-4 w-4" />
                  Owned
                </TabsTrigger>
                <TabsTrigger value="created">
                  <Plus className="mr-2 h-4 w-4" />
                  Created
                </TabsTrigger>
                <TabsTrigger value="favorited">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorited
                </TabsTrigger>
                <TabsTrigger value="for-sale">
                  <Store className="mr-2 h-4 w-4" />
                  For Sale
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="owned">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tokensOwnedByMeData?.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">
                      No NFTs owned yet.
                    </p>
                  )}
                  {tokensOwnedByMeData?.map((tokenId) => (
                    <CardNFTProfile
                      key={tokenId.toString()}
                      tokenId={tokenId}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="created">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tokensCreatedByMeData?.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">
                      No NFTs created yet.
                    </p>
                  )}
                  {tokensCreatedByMeData?.map((tokenId) => (
                    <CardNFTProfile
                      key={tokenId.toString()}
                      tokenId={tokenId}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="favorited">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoritesData?.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">
                      No NFTs favorited yet.
                    </p>
                  )}
                  {favoritesData?.map((tokenId) => (
                    <CardNFTProfile
                      key={tokenId.toString()}
                      tokenId={tokenId}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="for-sale">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {fetchItemsBySellerData?.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground">
                      No NFTs for sale yet.
                    </p>
                  )}
                  {fetchItemsBySellerData?.map((nft) => (
                    <CardNFTProfile key={nft.tokenId} tokenId={nft.tokenId} />
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
