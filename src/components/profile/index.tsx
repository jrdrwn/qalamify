'use client';

import KaligrafiNFT from '@/app/abis/KaligrafiNFT.json';
import MarketplaceNFT from '@/app/abis/Marketplace.json';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatAddress } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react';
import { Copy, Edit3, ExternalLink, Heart, Plus, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import CardNFTCreated from './card-nft-created';
import CardNFTFavorited from './card-nft-favorited';
import CardNFTOwned from './card-nft-owned';
import CardNFTViewed from './card-nft-viewed';

export const OtherProfile = ({ address }: { address: `0x${string}` }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getUserProfile',
    args: [address],
    account: address as `0x${string}`,
  }) as {
    data:
      | {
          username?: string;
          fullName?: string;
          bio?: string;
          x?: string;
          instagram?: string;
          avatarURL?: string;
        }
      | undefined;
  };
  // totalSales, totalRevenue, totalRoyaltyEarned
  const { data: userStatisticsData } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
    abi: MarketplaceNFT.abi,
    functionName: 'getUserStatistics',
    args: [address],
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };

  const { writeContract } = useWriteContract();
  const { data: tokensOwnedByMeData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getTokensOwnedByMe',
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };
  const { data: tokensCreatedByMeData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getTokensCreatedByMe',
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };
  const { data: favoritesData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getFavorites',
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };
  // const {data: tokenURIData} = useReadContract({
  //   address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
  //   abi: KaligrafiNFT.abi,
  //   functionName: 'tokenURI',
  //   args: [1],
  //   account: address as `0x${string}`,
  // })

  // console.log('Profile Data:', tokensOwnedByMeData);
  // console.log('Token URI Data:', tokenURIData);

  const copyAddress = () => {
    navigator.clipboard.writeText(address || '');
    toast.success('Address copied to clipboard');
  };

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <p className="text-gray-600">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16">
      {/* Enhanced Cover & Profile Section */}
      <div className="relative">
        {/* Cover Image */}
        {/* <div className="relative h-80 overflow-hidden">
            <Image
              src={
                profile?.avatarURL ||
                'https://images.unsplash.com/photo-1518770660439-4636190af475'
              }
              alt="Cover"
              className="h-full w-full object-cover"
              width={1200}
              height={500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div> */}

        {/* Profile Info Overlay */}
        <div className="relative container mx-auto px-2">
          <Card className="relative z-10">
            <CardContent>
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-border">
                      <AvatarImage src={profile.avatarURL} />
                      <AvatarFallback>{profile.username?.[0]}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col gap-3">
                      <Badge>@{profile.username}</Badge>
                      <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                    </div>
                    <p className="max-w-2xl leading-relaxed text-muted-foreground">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 lg:ml-auto"></div>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4 lg:grid-cols-6">
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
                    {formatAddress(address ? address : '')}
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

      {/* Enhanced Tabs Section */}
      <div className="container mx-auto mt-8 px-2">
        <Tabs defaultValue="owned">
          <Card className="gap-14">
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
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="owned">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tokensOwnedByMeData?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No NFTs owned yet.
                    </p>
                  )}
                  {tokensOwnedByMeData?.map((tokenId) => (
                    <CardNFTViewed key={tokenId.toString()} tokenId={tokenId} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="created">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tokensCreatedByMeData?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No NFTs created yet.
                    </p>
                  )}
                  {tokensCreatedByMeData?.map((tokenId) => (
                    <CardNFTViewed key={tokenId.toString()} tokenId={tokenId} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="favorited">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoritesData?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No NFTs favorited yet.
                    </p>
                  )}
                  {favoritesData?.map((tokenId) => (
                    <CardNFTViewed key={tokenId.toString()} tokenId={tokenId} />
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

export const MyProfile = () => {
  const { address } = useAppKitAccount();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getUserProfile',
    args: [address],
    account: address as `0x${string}`,
  }) as {
    data:
      | {
          username?: string;
          fullName?: string;
          bio?: string;
          x?: string;
          instagram?: string;
          avatarURL?: string;
        }
      | undefined;
  };
  // totalSales, totalRevenue, totalRoyaltyEarned
  const { data: userStatisticsData } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
    abi: MarketplaceNFT.abi,
    functionName: 'getUserStatistics',
    args: [address],
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };

  const { writeContract } = useWriteContract();
  const { data: tokensOwnedByMeData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getTokensOwnedByMe',
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };
  const { data: tokensCreatedByMeData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getTokensCreatedByMe',
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };
  const { data: favoritesData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getFavorites',
    account: address as `0x${string}`,
  }) as {
    data: bigint[] | undefined;
  };
  // const {data: tokenURIData} = useReadContract({
  //   address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
  //   abi: KaligrafiNFT.abi,
  //   functionName: 'tokenURI',
  //   args: [1],
  //   account: address as `0x${string}`,
  // })

  // console.log('Profile Data:', tokensOwnedByMeData);
  // console.log('Token URI Data:', tokenURIData);

  const copyAddress = () => {
    navigator.clipboard.writeText(address || '');
    toast.success('Address copied to clipboard');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    // Here you would typically send the updated profile data to your backend

    writeContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
      abi: KaligrafiNFT.abi,
      functionName: 'setUserProfile',
      args: [
        formData.get('username'),
        formData.get('fullName'),
        formData.get('bio'),
        formData.get('x'),
        formData.get('instagram'),
        formData.get('avatarURL'),
      ],
      account: address as `0x${string}`,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent>
            <p className="text-gray-600">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-16">
      {/* Enhanced Cover & Profile Section */}
      <div className="relative">
        {/* Cover Image */}
        {/* <div className="relative h-80 overflow-hidden">
            <Image
              src={
                profile?.avatarURL ||
                'https://images.unsplash.com/photo-1518770660439-4636190af475'
              }
              alt="Cover"
              className="h-full w-full object-cover"
              width={1200}
              height={500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div> */}

        {/* Profile Info Overlay */}
        <div className="relative container mx-auto px-2">
          <Card className="relative z-10">
            <CardContent>
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-border">
                      <AvatarImage src={profile.avatarURL} />
                      <AvatarFallback>{profile.username?.[0]}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col gap-3">
                      <Badge>@{profile.username}</Badge>
                      <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                    </div>
                    <p className="max-w-2xl leading-relaxed text-muted-foreground">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 lg:ml-auto">
                  <Sheet>
                    <SheetTrigger asChild type="button">
                      <Button variant="outline" size="sm" type="button">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <form
                        onSubmit={handleUpdateProfile}
                        className="flex h-full flex-col"
                      >
                        <SheetHeader>
                          <SheetTitle>Edit profile</SheetTitle>
                          <SheetDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </SheetDescription>
                        </SheetHeader>

                        <div className="grid flex-1 auto-rows-min gap-2 px-4">
                          <div className="grid gap-3">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              name="username"
                              defaultValue={profile?.username}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              defaultValue={profile?.fullName}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                              id="bio"
                              name="bio"
                              defaultValue={profile?.bio}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="x">X</Label>
                            <Input id="x" name="x" defaultValue={profile?.x} />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                              id="instagram"
                              name="instagram"
                              defaultValue={profile?.instagram}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="avatarURL">Avatar URL</Label>
                            <Input
                              id="avatarURL"
                              name="avatarURL"
                              defaultValue={profile?.avatarURL}
                            />
                          </div>
                        </div>

                        <SheetFooter>
                          <Button type="submit">Save changes</Button>
                          <SheetClose asChild>
                            <Button variant="outline" type="button">
                              Close
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </form>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Enhanced Stats Grid */}
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4 lg:grid-cols-6">
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
                    {formatAddress(address ? address : '')}
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

      {/* Enhanced Tabs Section */}
      <div className="container mx-auto mt-8 px-2">
        <Tabs defaultValue="owned">
          <Card className="gap-14">
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
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="owned">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tokensOwnedByMeData?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No NFTs owned yet.
                    </p>
                  )}
                  {tokensOwnedByMeData?.map((tokenId) => (
                    <CardNFTOwned
                      key={tokenId.toString()}
                      tokenId={tokenId}
                      currentAddress={address as `0x${string}`}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="created">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {tokensCreatedByMeData?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No NFTs created yet.
                    </p>
                  )}
                  {tokensCreatedByMeData?.map((tokenId) => (
                    <CardNFTCreated
                      key={tokenId.toString()}
                      tokenId={tokenId}
                      currentAddress={address as `0x${string}`}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="favorited">
                <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoritesData?.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No NFTs favorited yet.
                    </p>
                  )}
                  {favoritesData?.map((tokenId) => (
                    <CardNFTFavorited
                      key={tokenId.toString()}
                      tokenId={tokenId}
                      currentAddress={address as `0x${string}`}
                    />
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
