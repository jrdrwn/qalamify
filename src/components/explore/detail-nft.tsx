'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Clock,
  ExternalLink,
  Flag,
  Heart,
  Share2,
  ShoppingCart,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import ConfirmDialog from '../shared/confrm-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Mock NFT data
const nftData = {
  1: {
    id: 1,
    title: 'Digital Zen #001',
    description:
      'A mesmerizing digital artwork that captures the essence of modern zen philosophy through abstract forms and calming colors. This piece represents the harmony between technology and spirituality in our digital age.',
    image: 'photo-1649972904349-6e44c42644a7',
    price: '2.5',
    creator: {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      username: 'ZenArtist',
      avatar: 'photo-1649972904349-6e44c42644a7',
    },
    owner: {
      address: '0x8765432109fedcba8765432109fedcba87654321',
      username: 'ArtCollector',
      avatar: 'photo-1488590528505-98d2b5aba04b',
    },
    category: 'Art',
    rarity: 'Rare',
    royalty: '10%',
    blockchain: 'Ethereum',
    tokenId: '12345',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    createdAt: '2024-03-15',
    favorites: 89,
    isOwnedByUser: false,
    isCreatedByUser: false,
    attributes: [
      { trait_type: 'Background', value: 'Gradient Blue' },
      { trait_type: 'Style', value: 'Abstract' },
      { trait_type: 'Mood', value: 'Zen' },
      { trait_type: 'Rarity', value: 'Rare' },
    ],
  },
};

const NFTDetail = ({ id }: { id: number }) => {
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const nft = nftData[id as keyof typeof nftData];

  if (!nft) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            NFT Not Found
          </h1>
          <p className="mb-8 text-muted-foreground">
            The NFT you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/">Back to Explore</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleBuy = async () => {
    setIsLoading(true);
    setShowBuyDialog(false);

    try {
      // Simulate buying process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success('NFT purchased successfully!', {
        description: 'The NFT has been transferred to your wallet.',
      });
    } catch (error) {
      toast.error('Failed to purchase NFT', {
        description: 'Please try again or check your wallet connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    setShowCancelDialog(false);

    try {
      // Simulate canceling listing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Listing canceled successfully!', {
        description: 'Your NFT is no longer for sale.',
      });
    } catch (error) {
      toast.error('Failed to cancel listing', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(
      isFavorited ? 'Removed from favorites' : 'Added to favorites',
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div>
      <div className="px-4 pt-4 pb-16">
        <div className="mx-auto">
          <div className="grid grid-rows-3 gap-2 lg:grid-cols-2">
            {/* NFT Image */}
            <Card className="col-span-1 row-span-2 p-0">
              <Image
                src={`https://images.unsplash.com/photo-1664022617645-cf71791942e4`}
                alt={nft.title}
                className="aspect-[16/10] rounded-xl object-cover"
                width={1024}
                height={1024}
              />
            </Card>

            {/* NFT Details */}
            {/* Basic Info */}
            <Card className="col-span-1 row-span-2 justify-between">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {nft.category}
                    </Badge>
                    <CardTitle className="mb-2 text-3xl">{nft.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isFavorited ? 'secondary' : 'outline'}
                      size="icon"
                      onClick={handleFavorite}
                    >
                      <Heart
                        className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`}
                      />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  {nft.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Created {nft.createdAt}
                  </div>
                </div>

                <Separator />

                {/* Price and Action */}
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 text-sm text-muted-foreground">
                      Current Price
                    </div>
                    <div className="text-4xl font-bold">{nft.price} ETH</div>
                  </div>

                  <div className="flex gap-3">
                    {nft.isOwnedByUser ? (
                      <Button
                        variant="destructive"
                        size="lg"
                        className="flex-1"
                        onClick={() => setShowCancelDialog(true)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Cancel Listing
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={() => setShowBuyDialog(true)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Buy Now
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="col-span-1 row-span-1">
              <Tabs defaultValue="details">
                <CardHeader>
                  <TabsList>
                    <CardTitle>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="attributes">Attributes</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </CardTitle>
                  </TabsList>
                </CardHeader>
                <TabsContent value="details">
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Contract Address
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {nft.contractAddress.slice(0, 6)}...
                          {nft.contractAddress.slice(-4)}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-mono">{nft.tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blockchain</span>
                      <span>{nft.blockchain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Royalty</span>
                      <span>{nft.royalty}</span>
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="attributes">
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {nft.attributes.map((attr, index) => (
                        <div
                          key={index}
                          className="rounded-lg bg-gray-50 p-1 text-center"
                        >
                          <div className="text-sm font-medium text-muted-foreground">
                            {attr.trait_type}
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {attr.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="history">
                  <CardContent className="space-y-2">
                    <div className="text-muted-foreground">
                      No transaction history available.
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Creator & Owner Info */}
            <Card className="col-span-1 row-span-1 justify-center py-2">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <div className="space-y-4">
                  {/* Creator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://images.unsplash.com/${nft.creator.avatar}?auto=format&fit=crop&w=100&q=80`}
                        />
                        <AvatarFallback>
                          {nft.creator.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Creator
                        </div>
                        <div className="font-semibold">
                          {nft.creator.username}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/profile/${nft.creator.address}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>

                  <Separator />

                  {/* Owner */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={`https://images.unsplash.com/${nft.owner.avatar}?auto=format&fit=crop&w=100&q=80`}
                        />
                        <AvatarFallback>{nft.owner.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Owner
                        </div>
                        <div className="font-semibold">
                          {nft.owner.username}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/profile/${nft.owner.address}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attributes */}
            {/* <Card className="col-span-1 row-span-1">
              <CardHeader>
                <CardTitle>Attributes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {nft.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-gray-50 p-3 text-center"
                    >
                      <div className="text-sm font-medium text-muted-foreground">
                        {attr.trait_type}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {attr.value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showBuyDialog}
        onOpenChange={setShowBuyDialog}
        title="Confirm Purchase"
        description={`Are you sure you want to buy "${nft.title}" for ${nft.price} ETH? This transaction cannot be undone.`}
        onConfirm={handleBuy}
        confirmText="Buy Now"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Listing"
        description={`Are you sure you want to cancel the listing for "${nft.title}"? It will no longer be available for purchase.`}
        onConfirm={handleCancel}
        confirmText="Cancel Listing"
        cancelText="Keep Listed"
        variant="destructive"
      />
    </div>
  );
};

export default NFTDetail;
