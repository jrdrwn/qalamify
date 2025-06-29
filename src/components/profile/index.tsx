'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Copy,
  Edit3,
  ExternalLink,
  Grid,
  Heart,
  List,
  Plus,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import CardNFT from '../explore/card-nft';
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

// Mock user data
const userData = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  username: 'ArtCreator',
  displayName: 'Digital Art Master',
  bio: 'Passionate digital artist creating unique NFTs that blend traditional art with cutting-edge technology. Exploring the intersection of creativity and blockchain.',
  avatar: 'photo-1649972904349-6e44c42644a7',
  coverImage: 'photo-1518770660439-4636190af475',
  joined: 'March 2024',
  verified: true,
  website: 'https://artcreator.dev',
  twitter: '@artcreator',
  stats: {
    created: 12,
    owned: 8,
    favorited: 24,
    followers: 1250,
    following: 890,
    totalSales: 45.8,
    floorPrice: 2.1,
  },
};

// Mock NFTs data with enhanced information
const ownedNFTs = [
  {
    id: 1,
    title: 'My Digital Zen #001',
    image: 'photo-1649972904349-6e44c42644a7',
    price: '2.5',
    lastSale: '2.1',
    category: 'Art',
    rarity: 'Rare',
    isOwned: true,
    views: 1247,
    likes: 89,
  },
  {
    id: 2,
    title: 'Cyber Dreams #045',
    image: 'photo-1488590528505-98d2b5aba04b',
    price: '1.8',
    lastSale: '1.5',
    category: 'Digital',
    rarity: 'Epic',
    isOwned: true,
    views: 892,
    likes: 67,
  },
  {
    id: 5,
    title: 'Neon Circuit #234',
    image: 'photo-1486312338219-ce68d2c6f44d',
    price: '4.1',
    lastSale: '3.8',
    category: 'Tech',
    rarity: 'Rare',
    isOwned: true,
    views: 2156,
    likes: 143,
  },
];

const createdNFTs = [
  {
    id: 7,
    title: 'Abstract Vision #001',
    image: 'photo-1518770660439-4636190af475',
    price: '3.2',
    lastSale: '2.9',
    category: 'Abstract',
    rarity: 'Legendary',
    isOwned: true,
    views: 3421,
    likes: 256,
  },
  {
    id: 8,
    title: 'Digital Dreams #002',
    image: 'photo-1461749280684-dccba630e2f6',
    price: '2.8',
    lastSale: '2.4',
    category: 'Digital',
    rarity: 'Epic',
    isOwned: true,
    views: 1876,
    likes: 134,
  },
];

const favoriteNFTs = [
  {
    id: 3,
    title: 'Code Matrix #089',
    image: 'photo-1461749280684-dccba630e2f6',
    price: '0.9',
    lastSale: '0.7',
    category: 'Tech',
    rarity: 'Common',
    isOwned: false,
    views: 645,
    likes: 42,
  },
  {
    id: 6,
    title: 'Pixel Art #567',
    image: 'photo-1581091226825-a6a2a5aee158',
    price: '1.5',
    lastSale: '1.2',
    category: 'Pixel',
    rarity: 'Epic',
    isOwned: false,
    views: 1123,
    likes: 89,
  },
];

const Profile = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isEditing, setIsEditing] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(userData.address);
    toast.success('Address copied to clipboard');
  };

  return (
    <div className="">
      <div className="pb-16">
        {/* Enhanced Cover & Profile Section */}
        <div className="relative">
          {/* Cover Image */}
          <div className="relative h-80 overflow-hidden">
            <Image
              src={`https://images.unsplash.com/${userData.coverImage}?auto=format&fit=crop&w=1200&q=80`}
              alt="Cover"
              className="h-full w-full object-cover"
              width={1200}
              height={500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          {/* Profile Info Overlay */}
          <div className="relative container mx-auto px-4">
            <Card className="relative z-10 -mt-32">
              <CardContent>
                <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                  {/* Avatar & Basic Info */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                        <AvatarImage
                          src={`https://images.unsplash.com/${userData.avatar}?auto=format&fit=crop&w=200&q=80`}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-3xl text-white">
                          {userData.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      {/* {userData.verified && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )} */}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {userData.displayName}
                        </h1>
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          @{userData.username}
                        </Badge>
                      </div>
                      <p className="max-w-2xl leading-relaxed text-gray-600">
                        {userData.bio}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 lg:ml-auto">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit profile</SheetTitle>
                          <SheetDescription>
                            Make changes to your profile here. Click save when
                            you&apos;re done.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid flex-1 auto-rows-min gap-6 px-4">
                          <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-name">Name</Label>
                            <Input
                              id="sheet-demo-name"
                              defaultValue="Pedro Duarte"
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label htmlFor="sheet-demo-username">
                              Username
                            </Label>
                            <Input
                              id="sheet-demo-username"
                              defaultValue="@peduarte"
                            />
                          </div>
                        </div>
                        <SheetFooter>
                          <Button type="submit">Save changes</Button>
                          <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-4 lg:grid-cols-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {userData.stats.created}
                    </div>
                    <div className="text-sm text-gray-600">Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {userData.stats.owned}
                    </div>
                    <div className="text-sm text-gray-600">Owned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {userData.stats.favorited}
                    </div>
                    <div className="text-sm text-gray-600">Favorited</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userData.stats.totalSales}
                    </div>
                    <div className="text-sm text-gray-600">Total Sales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userData.stats.floorPrice}
                    </div>
                    <div className="text-sm text-gray-600">Floor Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Joined</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {userData.joined}
                    </div>
                  </div>
                </div>

                {/* Social Links & Address */}
                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wallet className="h-4 w-4" />
                    <span className="rounded-lg bg-gray-100 px-3 py-1 font-mono">
                      {userData.address.slice(0, 6)}...
                      {userData.address.slice(-4)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={copyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  {userData.website && (
                    <a
                      href={userData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {userData.twitter && (
                    <a
                      href={`https://twitter.com/${userData.twitter.slice(1)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {userData.twitter}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Tabs Section */}
        <div className="container mx-auto mt-8 px-4">
          <Tabs defaultValue="owned" className="space-y-14">
            <Card className="">
              <CardContent className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 sm:w-auto">
                  <TabsTrigger
                    value="owned"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Owned ({ownedNFTs.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="created"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Created ({createdNFTs.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorited"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favorited ({favoriteNFTs.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <TabsContent value="owned">
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ownedNFTs.map((nft) => (
                  <CardNFT
                    key={nft.id}
                    id={nft.id}
                    nama={nft.title}
                    image_url={`https://images.unsplash.com/${nft.image}?auto=format&fit=crop&w=400&q=80`}
                    price={+nft.price}
                    created_at={'2023-10-01T12:00:00Z'}
                    creator_address={userData.address}
                    creator={userData.displayName}
                    jenis={nft.category}
                  />
                ))}
                {ownedNFTs.map((nft) => (
                  <CardNFT
                    key={nft.id}
                    id={nft.id}
                    nama={nft.title}
                    image_url={`https://images.unsplash.com/${nft.image}?auto=format&fit=crop&w=400&q=80`}
                    price={+nft.price}
                    created_at={'2023-10-01T12:00:00Z'}
                    creator_address={userData.address}
                    creator={userData.displayName}
                    jenis={nft.category}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="created">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {createdNFTs.map((nft) => (
                  <CardNFT
                    key={nft.id}
                    id={nft.id}
                    nama={nft.title}
                    image_url={`https://images.unsplash.com/${nft.image}?auto=format&fit=crop&w=400&q=80`}
                    price={+nft.price}
                    created_at={'2023-10-01T12:00:00Z'}
                    creator_address={userData.address}
                    creator={userData.displayName}
                    jenis={nft.category}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorited">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favoriteNFTs.map((nft) => (
                  <CardNFT
                    key={nft.id}
                    id={nft.id}
                    nama={nft.title}
                    image_url={`https://images.unsplash.com/${nft.image}?auto=format&fit=crop&w=400&q=80`}
                    price={+nft.price}
                    created_at={'2023-10-01T12:00:00Z'}
                    creator_address={userData.address}
                    creator={userData.displayName}
                    jenis={nft.category}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
