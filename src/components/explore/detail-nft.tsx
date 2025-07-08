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
import {
  Clock,
  ExternalLink,
  Flag,
  Heart,
  Loader2,
  Share2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Address, formatEther } from 'viem';
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';

import {
  calligraphyStyles,
  compositions,
  decorations,
  presentationStyles,
} from '../create';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Fungsi validasi harga
function isValidPrice(price: string | number) {
  const num = Number(price);
  return price !== '' && !isNaN(num) && num > 0;
}

const NFTDetail = ({ id }: { id: bigint }) => {
  const [loading, setLoading] = useState(false);
  const [inputPrice, setInputPrice] = useState<string>('');

  const tokenId = id;

  const [createMarketSaleLoading, setCreateMarketSaleLoading] = useState(false);
  const [cancelMarketItemLoading, setCancelMarketItemLoading] = useState(false);
  const [createMarketItemOrRelistLoading, setCreateMarketItemOrRelistLoading] =
    useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

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
  // currentPrice dari marketItemData, gunakan useMemo
  const currentPrice = useMemo(() => {
    if (marketItemData?.price) {
      return formatEther(marketItemData.price);
    }
    return '';
  }, [marketItemData]);

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCreated',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === currentAddress) {
        await marketItemRefetch();
        await ownerOfRefetch();
        await userProfileSellerRefetch();
        await userProfileOwnerOfRefetch();
        await ownershipHistoryRefetch();
        toast.success('Market item created successfully!');
        setLoading(false);
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCanceled',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === currentAddress) {
        await marketItemRefetch();
        await ownerOfRefetch();
        await userProfileSellerRefetch();
        await userProfileOwnerOfRefetch();
        await ownershipHistoryRefetch();
        toast.success('Market item canceled successfully!');
        setLoading(false);
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemRelisted',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === currentAddress) {
        await marketItemRefetch();
        await ownerOfRefetch();
        await userProfileSellerRefetch();
        await userProfileOwnerOfRefetch();
        await ownershipHistoryRefetch();
        toast.success('Market item relisted successfully!');
        setLoading(false);
      }
    },
  });

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemSold',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.buyer === currentAddress) {
        await marketItemRefetch();
        await ownerOfRefetch();
        await userProfileSellerRefetch();
        await userProfileOwnerOfRefetch();
        await ownershipHistoryRefetch();
        toast.success('NFT purchased successfully!');
        setLoading(false);
      }
    },
  });

  // Input price handler
  const handleCurrentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPrice(e.target.value);
  };

  const handleCreateMarketItem = useCallback(async () => {
    if (createMarketItemOrRelistLoading) return;
    if (!isValidPrice(inputPrice)) {
      toast.error('Harga tidak valid. Harap masukkan harga yang benar.');
      return;
    }
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      return;
    }
    setCreateMarketItemOrRelistLoading(true);
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
        abi: NFT_ABI,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address, tokenId],
        account: currentAddress,
      });
      const priceInWei = BigInt(Number(inputPrice) * 1e18); // Konversi ke wei
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
      toast.info(
        'Please wait, creating market item... This may take a few seconds.',
      );
      setLoading(true);
    } catch (error) {
      console.error('Error creating market item:', error);
      toast.error('Gagal menjual NFT. Silakan coba lagi.');
    } finally {
      setCreateMarketItemOrRelistLoading(false);
    }
  }, [
    createMarketItemOrRelistLoading,
    inputPrice,
    currentAddress,
    writeContractAsync,
    tokenId,
  ]);

  const handleCancelMarketItem = useCallback(async () => {
    if (cancelMarketItemLoading) return;
    if (!marketItemData) {
      return;
    }
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      return;
    }
    setCancelMarketItemLoading(true);
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
      toast.info(
        'Please wait, canceling market item... This may take a few seconds.',
      );
      setLoading(true);
    } catch (error) {
      console.error('Error canceling market item:', error);
      toast.error('Gagal membatalkan NFT dari pasar. Silakan coba lagi.');
    } finally {
      setCancelMarketItemLoading(false);
    }
  }, [
    cancelMarketItemLoading,
    currentAddress,
    marketItemData,
    writeContractAsync,
  ]);

  const handleCreateMarketSale = useCallback(async () => {
    if (createMarketSaleLoading) return;
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      return;
    }
    setCreateMarketSaleLoading(true);
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
      toast.info('Please wait, purchasing NFT... This may take a few seconds.');
      setLoading(true);
    } catch (error) {
      console.error('Error creating market sale:', error);
      toast.error('Gagal membeli NFT. Silakan coba lagi.');
    } finally {
      setCreateMarketSaleLoading(false);
    }
  }, [
    createMarketSaleLoading,
    currentAddress,
    marketItemData?.marketItemId,
    marketItemData?.price,
    writeContractAsync,
  ]);

  const handleRelistMarketItem = useCallback(async () => {
    if (createMarketItemOrRelistLoading) return;
    if (!isValidPrice(inputPrice)) {
      toast.error('Harga tidak valid. Harap masukkan harga yang benar.');
      return;
    }
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      return;
    }
    setCreateMarketItemOrRelistLoading(true);
    try {
      // approve nft
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
        abi: NFT_ABI,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address, tokenId],
      });

      const priceInWei = BigInt(Number(inputPrice) * 1e18); // Konversi ke wei
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
      toast.info(
        'Please wait, relisting market item... This may take a few seconds.',
      );
      setLoading(true);
    } catch (error) {
      console.error('Error relisting market item:', error);
      toast.error('Gagal mere-list NFT. Silakan coba lagi.');
    } finally {
      setCreateMarketItemOrRelistLoading(false);
    }
  }, [
    createMarketItemOrRelistLoading,
    currentAddress,
    inputPrice,
    marketItemData?.marketItemId,
    tokenId,
    writeContractAsync,
  ]);

  const handleFavoriteToggle = useCallback(async () => {
    if (favoriteLoading) return;
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      return;
    }
    setFavoriteLoading(true);
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
    } finally {
      setFavoriteLoading(false);
    }
  }, [currentAddress, favorite, favoriteLoading, tokenId, writeContractAsync]);

  useEffect(() => {
    if (isFavoriteData !== undefined) {
      setFavorite(isFavoriteData);
    }
  }, [isFavoriteData]);

  if (!tokenMetadata || loading) {
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div>
      <div className="px-4 py-4">
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
                      {
                        calligraphyStyles.find(
                          (cs) =>
                            BigInt(cs.id) === tokenMetadata.calligraphyStyle,
                        )?.label
                      }
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
                      disabled={favoriteLoading}
                    >
                      {favoriteLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin"></Loader2>
                      ) : (
                        <Heart
                          className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`}
                        />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-4 leading-relaxed text-muted-foreground">
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
                            value={
                              inputPrice !== '' ? inputPrice : currentPrice
                            }
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
                        disabled={
                          !isValidPrice(inputPrice) ||
                          createMarketItemOrRelistLoading
                        }
                      >
                        {createMarketItemOrRelistLoading && (
                          <Loader2 className="animate-spin"></Loader2>
                        )}
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
                          disabled={cancelMarketItemLoading}
                        >
                          {cancelMarketItemLoading && (
                            <Loader2 className="animate-spin"></Loader2>
                          )}
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          variant={'default'}
                          className="z-1"
                          onClick={handleCreateMarketSale}
                          disabled={
                            createMarketSaleLoading ||
                            !marketItemData?.price ||
                            marketItemData?.canceled
                          }
                        >
                          {createMarketSaleLoading && (
                            <Loader2 className="animate-spin"></Loader2>
                          )}
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
              <Tabs defaultValue="attributes">
                <CardHeader>
                  <TabsList>
                    <CardTitle>
                      <TabsTrigger value="attributes">Attributes</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
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
                      <div className="rounded-lg bg-muted p-1 text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                          Presentation Style
                        </div>
                        <div className="text-lg font-bold text-muted-foreground">
                          {presentationStyles.find(
                            (ps) =>
                              BigInt(ps.id) === tokenMetadata.presentationStyle,
                          )?.label || 'Unknown'}
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted p-1 text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                          Decoration
                        </div>
                        <div className="text-lg font-bold text-muted-foreground">
                          {decorations.find(
                            (dc) => BigInt(dc.id) === tokenMetadata.decoration,
                          )?.label || 'Unknown'}
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted p-1 text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                          Composition
                        </div>
                        <div className="text-lg font-bold text-muted-foreground">
                          {compositions.find(
                            (cp) => BigInt(cp.id) === tokenMetadata.composition,
                          )?.label || 'Unknown'}
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted p-1 text-center">
                        <div className="text-sm font-medium text-muted-foreground">
                          Dominant Color
                        </div>
                        <div className="flex items-center justify-center gap-2 text-lg font-bold text-muted-foreground">
                          <div
                            style={{
                              backgroundColor: tokenMetadata.dominantColor,
                            }}
                            className="size-5 rounded-full"
                          ></div>
                          {tokenMetadata.dominantColor || 'Unknown'}
                        </div>
                      </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
