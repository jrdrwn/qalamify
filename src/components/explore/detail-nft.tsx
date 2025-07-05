'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { NFT_ABI } from '@/app/abis/nft';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatAddress, formatDate } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react';
import { Clock, ExternalLink, Flag, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Address, formatEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

import ConfirmDialog from '../shared/confrm-dialog';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const NFTDetail = ({ id }: { id: bigint }) => {
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tokenId = id;

  const { address: currentAddress } = useAppKitAccount() as {
    address: Address;
  };

  const { data: tokenURIData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
    account: currentAddress,
  });

  const { data: tokenCreatorData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getTokenCreatorById',
    args: [tokenId],
    account: currentAddress,
  });
  const { data: userProfileData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getUserProfile',
    args: [tokenCreatorData as Address],
    account: currentAddress,
  });

  const { data: isFavoriteData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'isFavorite',
    args: [tokenId],
    account: currentAddress,
  });
  const { writeContractAsync } = useWriteContract();
  const [favorite, setFavorite] = useState(false);
  const { data: tokenMetadata } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getTokenMetadata',
    args: [tokenId],
  });

  const { data: marketItemData, refetch: marketItemRefetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    functionName: 'getMarketItemByTokenId',
    args: [tokenId],
    account: currentAddress as Address,
  });

  const { data: ownerOfData, refetch: ownerOfRefetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'ownerOf',
    args: [tokenId],
    account: currentAddress,
  });
  const { data: ownershipHistoryData, refetch: ownershipHistoryRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getOwnershipHistory',
      args: [tokenId],
      account: currentAddress,
    });

  const { data: userProfileOwnerOfData, refetch: userProfileOwnerOfRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getUserProfile',
      args: [ownerOfData as Address],
      account: currentAddress,
    });

  const { data: userProfileSellerData, refetch: userProfileSellerRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getUserProfile',
      args: [marketItemData?.seller as Address],
      account: currentAddress,
    });
  const [currentPrice, setCurrentPrice] = useState<string>('');

  const handleCurrentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPrice(e.target.value);
  };

  const handleCreateMarketItem = useCallback(async () => {
    if (
      !currentPrice ||
      isNaN(Number(currentPrice)) ||
      Number(currentPrice) <= 0
    ) {
      toast.error('Harga tidak valid. Harap masukkan harga yang benar.');
      return;
    }
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
        abi: NFT_ABI,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address, tokenId],
        account: currentAddress,
      });
      const priceInWei = BigInt(Number(currentPrice) * 1e18); // Konversi ke wei
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
        abi: MARKETPLACE_NFT,
        functionName: 'createMarketItem',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
          tokenId,
          priceInWei,
        ],
        account: currentAddress,
      });
      await marketItemRefetch();
      await ownerOfRefetch();
      await ownershipHistoryRefetch();
      await userProfileOwnerOfRefetch();
      await userProfileSellerRefetch();
      toast.success('NFT berhasil dijual!');
    } catch (error) {
      console.error('Error creating market item:', error);
      toast.error('Gagal menjual NFT. Silakan coba lagi.');
    }
  }, [
    currentPrice,
    writeContractAsync,
    tokenId,
    currentAddress,
    marketItemRefetch,
    ownerOfRefetch,
    ownershipHistoryRefetch,
    userProfileOwnerOfRefetch,
    userProfileSellerRefetch,
  ]);

  const handleCancelMarketItem = useCallback(async () => {
    if (!marketItemData) {
      return;
    }
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
        abi: MARKETPLACE_NFT,
        functionName: 'cancelMarketItem',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
          marketItemData.marketItemId,
        ],
        account: currentAddress as Address,
      });
      await marketItemRefetch();
      await ownerOfRefetch();
      await ownershipHistoryRefetch();
      await userProfileOwnerOfRefetch();
      await userProfileSellerRefetch();
      toast.success('NFT berhasil dibatalkan dari pasar!');
    } catch (error) {
      console.error('Error canceling market item:', error);
      toast.error('Gagal membatalkan NFT dari pasar. Silakan coba lagi.');
    }
  }, [
    currentAddress,
    marketItemData,
    marketItemRefetch,
    ownerOfRefetch,
    ownershipHistoryRefetch,
    userProfileOwnerOfRefetch,
    userProfileSellerRefetch,
    writeContractAsync,
  ]);

  const handleCreateMarketSale = useCallback(async () => {
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      return;
    }
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
        abi: MARKETPLACE_NFT,
        functionName: 'createMarketSale',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
          marketItemData?.marketItemId as bigint,
        ],
        account: currentAddress,
        value: marketItemData?.price,
      });
      await marketItemRefetch();
      await ownerOfRefetch();
      await ownershipHistoryRefetch();
      await userProfileOwnerOfRefetch();
      await userProfileSellerRefetch();
      toast.success('Pembelian NFT berhasil!');
    } catch (error) {
      console.error('Error creating market sale:', error);
      toast.error('Gagal membeli NFT. Silakan coba lagi.');
    }
  }, [
    currentAddress,
    marketItemData?.marketItemId,
    marketItemData?.price,
    marketItemRefetch,
    ownerOfRefetch,
    ownershipHistoryRefetch,
    userProfileOwnerOfRefetch,
    userProfileSellerRefetch,
    writeContractAsync,
  ]);

  const handleRelistMarketItem = useCallback(async () => {
    if (
      !currentPrice ||
      isNaN(Number(currentPrice)) ||
      Number(currentPrice) <= 0
    ) {
      toast.error('Harga tidak valid. Harap masukkan harga yang benar.');
      return;
    }
    try {
      // approve nft
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
        abi: NFT_ABI,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address, tokenId],
      });

      const priceInWei = BigInt(Number(currentPrice) * 1e18); // Konversi ke wei
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
        abi: MARKETPLACE_NFT,
        functionName: 'relistMarketItem',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
          marketItemData?.marketItemId as bigint,
          priceInWei,
        ],
      });
      await marketItemRefetch();
      await ownerOfRefetch();
      await ownershipHistoryRefetch();
      await userProfileOwnerOfRefetch();
      await userProfileSellerRefetch();
      toast.success('NFT berhasil direlist!');
    } catch (error) {
      console.error('Error relisting market item:', error);
      toast.error('Gagal mere-list NFT. Silakan coba lagi.');
    }
  }, [
    currentPrice,
    marketItemData?.marketItemId,
    marketItemRefetch,
    ownerOfRefetch,
    ownershipHistoryRefetch,
    tokenId,
    userProfileOwnerOfRefetch,
    userProfileSellerRefetch,
    writeContractAsync,
  ]);

  const handleFavoriteToggle = useCallback(async () => {
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      return;
    }
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
        abi: NFT_ABI,
        functionName: favorite ? 'removeFavorite' : 'addFavorite',
        args: [tokenId],
      });
      setFavorite(!favorite);
      toast.success(
        `NFT telah ${favorite ? 'dihapus dari' : 'ditambahkan ke'} daftar favorit Anda!`,
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(
        `Gagal ${favorite ? 'menghapus' : 'menambahkan'} NFT ke daftar favorit. Silakan coba lagi.`,
      );
    }
  }, [currentAddress, favorite, tokenId, writeContractAsync]);

  useEffect(() => {
    if (isFavoriteData !== undefined) {
      setFavorite(isFavoriteData);
    }
  }, [isFavoriteData]);
  useEffect(() => {
    if (marketItemData?.price) {
      setCurrentPrice(formatEther(marketItemData.price));
    }
  }, [marketItemData]);

  if (!tokenMetadata) {
    return <>Loading</>;
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
    } catch (_error) {
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
    } catch (_error) {
      toast.error('Failed to cancel listing', {
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
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
                src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${tokenURIData}`}
                alt={tokenMetadata.name}
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
                      {tokenMetadata.category}
                    </Badge>
                    <CardTitle className="mb-2 text-3xl">
                      {tokenMetadata.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={favorite ? 'secondary' : 'outline'}
                      size="icon"
                      onClick={handleFavoriteToggle}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`}
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
                  {tokenMetadata.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Minting at{' '}
                    {formatDate(
                      new Date(
                        parseInt(tokenMetadata.mintingAt.toString()) * 1000,
                      ),
                    )}
                  </div>
                </div>

                <Separator />

                {/* Price and Action */}
                <div>
                  {currentAddress === ownerOfData && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="mb-2 text-sm text-muted-foreground">
                          Current Price
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="number"
                            min={1}
                            className="z-1 flex-1 appearance-none"
                            value={currentPrice}
                            onChange={handleCurrentPriceChange}
                          />
                          <span className="text-sm text-muted-foreground">
                            ETH
                          </span>
                        </div>
                      </div>
                      <Button
                        variant={'default'}
                        className="z-1"
                        onClick={
                          marketItemData?.canceled
                            ? handleRelistMarketItem
                            : handleCreateMarketItem
                        }
                      >
                        {marketItemData?.canceled ? 'Relist' : 'Sell'}
                      </Button>
                    </div>
                  )}
                  {ownerOfData === process.env.NEXT_PUBLIC_MARKET_ADDRESS && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="mb-1 text-sm text-muted-foreground">
                          Current Price
                        </div>
                        <div className="text-4xl font-bold">
                          {marketItemData?.price &&
                            formatEther(marketItemData?.price)}{' '}
                          ETH
                        </div>
                      </div>
                      {marketItemData?.seller === currentAddress ? (
                        <Button
                          variant={'default'}
                          className="z-1"
                          onClick={handleCancelMarketItem}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          variant={'default'}
                          className="z-1"
                          onClick={handleCreateMarketSale}
                        >
                          Buy
                        </Button>
                      )}
                    </div>
                  )}
                  {ownerOfData !== process.env.NEXT_PUBLIC_MARKET_ADDRESS &&
                    currentAddress !== ownerOfData && (
                      <div className="flex flex-col gap-4">
                        <div>
                          <div className="mb-1 text-sm text-muted-foreground">
                            Current Price
                          </div>
                          <div className="text-4xl font-bold">
                            Sold / Cancelled / Not for Sale
                          </div>
                        </div>
                      </div>
                    )}
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
                      {/* <TabsTrigger value="attributes">Attributes</TabsTrigger> */}
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
                          {formatAddress(process.env.NEXT_PUBLIC_NFT_ADDRESS)}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-mono">{tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blockchain</span>
                      <span>Ethereum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Royalty</span>
                      <span>2%</span>
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="attributes">
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {/* {nft.attributes.map((attr, index) => (
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
                      ))} */}
                    </div>
                  </CardContent>
                </TabsContent>
                <TabsContent value="history">
                  <CardContent className="space-y-2">
                    <div className="max-h-30 overflow-y-auto text-muted-foreground">
                      {ownershipHistoryData &&
                        !ownershipHistoryData.length &&
                        'No transaction history available.'}
                      {ownershipHistoryData &&
                        ownershipHistoryData.map((owner, index) => (
                          <div key={index} className="mt-2">
                            <div className="flex items-center justify-between">
                              <span>
                                {index === 0
                                  ? 'First Owner'
                                  : `Owner #${index}`}
                              </span>
                              <span className="text-sm">{owner}</span>
                            </div>
                          </div>
                        ))}
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
                          src={
                            userProfileData?.avatarURL ||
                            'https://images.unsplash.com/photo-1734779206772-f21d663e96d5'
                          }
                        />
                        <AvatarFallback>
                          {userProfileData?.username}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Creator
                        </div>
                        <div className="font-semibold">
                          {userProfileData?.username ||
                            formatAddress(tokenCreatorData)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/profile/${tokenCreatorData}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>

                  <Separator />

                  {/* Owner/ Seller*/}
                  {ownerOfData === process.env.NEXT_PUBLIC_MARKET_ADDRESS ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              userProfileSellerData?.avatarURL ||
                              'https://images.unsplash.com/photo-1734779206772-f21d663e96d5'
                            }
                          />
                          <AvatarFallback>
                            {userProfileSellerData?.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Seller
                          </div>
                          <div className="font-semibold">
                            {userProfileSellerData?.username ||
                              formatAddress(marketItemData?.seller)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${marketItemData?.seller}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              userProfileOwnerOfData?.avatarURL ||
                              'https://images.unsplash.com/photo-1734779206772-f21d663e96d5'
                            }
                          />
                          <AvatarFallback>
                            {userProfileOwnerOfData?.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Owner
                          </div>
                          <div className="font-semibold">
                            {userProfileOwnerOfData?.username ||
                              formatAddress(ownerOfData)}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/profile/${ownerOfData}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  )}
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
        description={`Are you sure you want to buy "${tokenMetadata.name}" for ${marketItemData?.price} ETH? This transaction cannot be undone.`}
        onConfirm={handleBuy}
        confirmText="Buy Now"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Listing"
        description={`Are you sure you want to cancel the listing for "${tokenMetadata.name}"? It will no longer be available for purchase.`}
        onConfirm={handleCancel}
        confirmText="Cancel Listing"
        cancelText="Keep Listed"
        variant="destructive"
      />
    </div>
  );
};

export default NFTDetail;
