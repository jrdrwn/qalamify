'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { NFT_ABI } from '@/app/abis/nft';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Address, formatEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

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
    <Card className="relative col-span-1 gap-2 pt-42 pb-4">
      <Skeleton className="absolute -top-8 left-1/2 h-46 w-[calc(100%-1rem)] -translate-x-1/2 rounded-lg" />
      <CardContent className="px-4">
        <Skeleton className="mb-2 h-6 w-full rounded-md" />
      </CardContent>
      <CardFooter className="flex items-end justify-between px-4">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default function CardNFT({
  currentAccount,
  nft,
  availableMarketItemsRefetch,
}: {
  currentAccount: string;
  nft: INFT;
  availableMarketItemsRefetch?: () => void;
}) {
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

  const { writeContractAsync } = useWriteContract();

  const handleCancelMarketItem = useCallback(async () => {
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
      toast.success('NFT berhasil dibatalkan dari pasar!');
      if (availableMarketItemsRefetch) {
        await availableMarketItemsRefetch();
      }
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error canceling market item:', error);
      toast.error('Gagal membatalkan NFT dari pasar. Silakan coba lagi.');
    }
  }, [
    availableMarketItemsRefetch,
    currentAccount,
    nft.marketItemId,
    writeContractAsync,
  ]);

  const handleCreateMarketSale = useCallback(async () => {
    if (currentAccount === process.env.NEXT_PUBLIC_MARKET_ADDRESS) {
      toast.warning('Please connect to a wallet');
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
      if (availableMarketItemsRefetch) {
        await availableMarketItemsRefetch();
      }
      toast.success('Pembelian NFT berhasil!');
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error creating market sale:', error);
      toast.error('Gagal membeli NFT. Silakan coba lagi.');
    }
  }, [
    availableMarketItemsRefetch,
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

  if (tokenMetadata === null) {
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
            </>
          )}
        </div>
      </CardFooter>
      <Link href={`/detail/${nft.tokenId}`} className="absolute inset-0"></Link>
    </Card>
  );
}
