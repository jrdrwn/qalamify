'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { NFT_ABI } from '@/app/abis/nft';
import { CircleUserRound, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Address, formatEther } from 'viem';
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';

import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export interface INFT {
  marketItemId: bigint;
  nftContractAddress: Address;
  tokenId: bigint;
  creator: Address;
  seller: Address;
  owner: Address;
  price: bigint;
  sold: boolean;
  canceled: boolean;
}

export function FormatedTime(datetime: string) {
  return new Date(datetime).toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    timeZoneName: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CardNFTSkeleton() {
  return (
    <Card className="relative col-span-1 gap-2 py-2">
      <CardContent className="mb-2 px-2">
        <Skeleton className="mb-4 h-46 rounded-lg" />
        <Skeleton className="mb-3 h-6 w-full rounded-md" />
      </CardContent>
      <CardFooter className="flex items-end justify-between px-2">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default function CardNFT({
  currentAccount,
  nft,
}: {
  currentAccount: string;
  nft: INFT;
  availableMarketItemsRefetch?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  // Optimized: Only fetch tokenURI and metadata in parallel, fetch userProfile only if needed
  const { data: tokenURIData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [nft.tokenId],
    account: nft.creator as Address,
  });
  const { data: tokenMetadata } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getTokenMetadata',
    args: [nft.tokenId],
  });
  // Only fetch creator and user profile if needed for avatar
  const { data: tokenCreatorData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getTokenCreatorById',
    args: [nft.tokenId],
    account: nft.creator as Address,
    query: { enabled: !!nft.tokenId }, // Only fetch if tokenId exists
  });
  const { data: userProfileData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getUserProfile',
    args: [tokenCreatorData as Address],
    account: nft.creator as Address,
    query: { enabled: !!tokenCreatorData }, // Only fetch if creator data exists
  });

  const [createMarketSaleLoading, setCreateMarketSaleLoading] = useState(false);
  const [cancelMarketItemLoading, setCancelMarketItemLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  useWatchContractEvent({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCanceled',
    async onLogs(logs) {
      if (logs.length === 0) return;
      if (logs[0].args?.seller === currentAccount) {
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
      if (logs[0].args?.seller === currentAccount) {
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
      if (logs[0].args?.buyer === currentAccount) {
        toast.success('NFT purchased successfully!');
        setLoading(false);
      }
    },
  });

  const handleCancelMarketItem = useCallback(async () => {
    if (cancelMarketItemLoading) return; // Prevent multiple clicks
    setCancelMarketItemLoading(true);
    if (currentAccount === process.env.NEXT_PUBLIC_MARKET_ADDRESS) {
      toast.warning('Please connect to a wallet');
      setCancelMarketItemLoading(false);
      return;
    }
    try {
      const tx = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
        abi: MARKETPLACE_NFT,
        functionName: 'cancelMarketItem',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
          nft.marketItemId,
        ],
        account: currentAccount as Address,
      });
      toast.info(
        'Please wait, canceling market item... This may take a few seconds.',
      );
      setLoading(true);
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error canceling market item:', error);
      toast.error('Gagal membatalkan NFT dari pasar. Silakan coba lagi.');
    } finally {
      setCancelMarketItemLoading(false);
    }
  }, [
    cancelMarketItemLoading,
    currentAccount,
    nft.marketItemId,
    writeContractAsync,
  ]);

  const handleCreateMarketSale = useCallback(async () => {
    if (createMarketSaleLoading) return; // Prevent multiple clicks
    setCreateMarketSaleLoading(true);
    if (currentAccount === process.env.NEXT_PUBLIC_MARKET_ADDRESS) {
      toast.warning('Please connect to a wallet');
      setCreateMarketSaleLoading(false);
      return;
    }
    try {
      const tx = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
        abi: MARKETPLACE_NFT,
        functionName: 'createMarketSale',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
          nft.marketItemId,
        ],
        account: currentAccount as Address,
        value: nft.price,
      });
      toast.info('Please wait, purchasing NFT... This may take a few seconds.');
      setLoading(true);
      toast.success('Pembelian NFT berhasil!');
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error creating market sale:', error);
      toast.error('Gagal membeli NFT. Silakan coba lagi.');
    } finally {
      setCreateMarketSaleLoading(false);
    }
  }, [
    createMarketSaleLoading,
    currentAccount,
    nft.marketItemId,
    nft.price,
    writeContractAsync,
  ]);

  // Early return if metadata not loaded
  if (!tokenMetadata) {
    return <CardNFTSkeleton />;
  }

  // Early return if search query doesn't match
  const searchQuery = searchParams.get('q') || '';
  if (
    searchQuery &&
    !tokenMetadata?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  if (tokenMetadata === null || loading) {
    return <CardNFTSkeleton />;
  }

  if (!tokenMetadata?.name.includes(searchParams.get('q') || '')) {
    return null;
  }

  return (
    <Card className="relative col-span-1 gap-2 pt-2 pb-2">
      <CardContent className="mb-2 px-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${tokenURIData}`}
          alt={tokenMetadata?.name || 'NFT Image'}
          width={800}
          height={800}
          className="mb-4 h-46 rounded-lg bg-muted-foreground object-cover object-center"
        />
        <div className="flex items-center gap-3">
          {userProfileData?.avatarURL ? (
            <>
              <AvatarImage
                src={userProfileData?.avatarURL}
                className="object-cover object-center"
              />
              <AvatarFallback>
                {userProfileData?.username[0] || 'Q'}
              </AvatarFallback>
            </>
          ) : (
            <CircleUserRound className="size-5 text-muted-foreground" />
          )}
          <p className="line-clamp-1 text-ellipsis">{tokenMetadata.name}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 px-2">
        <div className="flex w-full items-end justify-between">
          {nft && !nft?.canceled && !nft?.sold && (
            <>
              <Button variant={'outline'} className="z-1">
                {nft?.price && formatEther(nft?.price)} ETH
              </Button>
              {nft.seller === currentAccount ? (
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
                  disabled={createMarketSaleLoading}
                >
                  {createMarketSaleLoading && (
                    <Loader2 className="animate-spin"></Loader2>
                  )}
                  Buy
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
      <Link href={`/detail/${nft.tokenId}`} className="absolute inset-0"></Link>
    </Card>
  );
}
