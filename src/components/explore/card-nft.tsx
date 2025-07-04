'use client';

import KaligrafiNFT from '@/app/abis/KaligrafiNFT.json';
import MarketplaceNFT from '@/app/abis/Marketplace.json';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FileListItem } from 'pinata';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

export interface INFT {
  marketItemId: bigint;
  nftContract: string;
  tokenId: bigint;
  creator: string;
  seller: string;
  owner: string;
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
}: {
  currentAccount: string;
  nft: INFT;
}) {
  const searchParams = useSearchParams();
  const { data: tokenURIData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'tokenURI',
    args: [nft.tokenId],
    account: nft.creator as `0x${string}`,
  });
  const { data: tokenCreatorData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getTokenCreatorById',
    args: [nft.tokenId],
    account: nft.creator as `0x${string}`,
  });
  const { data: userProfileData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getUserProfile',
    args: [tokenCreatorData],
    account: nft.creator as `0x${string}`,
  }) as {
    data:
      | {
          name: string;
          fullName: string;
          bio: string;
          twitter: string;
          instagram: string;
          email: string;
          avatarURL: string;
          location: string;
        }
      | undefined;
  };

  const { data: isFavoriteData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'isFavorite',
    args: [nft.tokenId],
    account: currentAccount as `0x${string}`,
  }) as {
    data: boolean | undefined;
  };
  const { writeContractAsync } = useWriteContract();
  const [favorite, setFavorite] = useState(false);
  const [metadata, setMetadata] = useState<FileListItem | null>(null);
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
      const priceInWei = BigInt(Number(currentPrice) * 1e18); // Konversi ke wei
      const tx = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'createMarketItem',
        args: [process.env.NEXT_PUBLIC_NFT_ADDRESS, nft.tokenId, priceInWei],
      });
      toast.success('NFT berhasil dijual!');
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error creating market item:', error);
      toast.error('Gagal menjual NFT. Silakan coba lagi.');
    }
  }, [currentPrice, nft.tokenId, writeContractAsync]);

  const handleCancelMarketItem = useCallback(async () => {
    try {
      const tx = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'cancelMarketItem',
        args: [process.env.NEXT_PUBLIC_NFT_ADDRESS, nft.marketItemId],
        account: currentAccount as `0x${string}`,
      });
      toast.success('NFT berhasil dibatalkan dari pasar!');
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error canceling market item:', error);
      toast.error('Gagal membatalkan NFT dari pasar. Silakan coba lagi.');
    }
  }, [currentAccount, nft.marketItemId, writeContractAsync]);

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
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        abi: KaligrafiNFT.abi,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_MARKET_ADDRESS, nft.tokenId],
      });

      const priceInWei = BigInt(Number(currentPrice) * 1e18); // Konversi ke wei
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'relistMarketItem',
        args: [process.env.NEXT_PUBLIC_NFT_ADDRESS, nft.tokenId, priceInWei],
      });
      toast.success('NFT berhasil direlist!');
    } catch (error) {
      console.error('Error relisting market item:', error);
      toast.error('Gagal mere-list NFT. Silakan coba lagi.');
    }
  }, [currentPrice, nft.tokenId, writeContractAsync]);

  const handleCreateMarketSale = useCallback(async () => {
    if (currentAccount === process.env.NEXT_PUBLIC_MARKET_ADDRESS) {
      toast.warning('Please connect to a wallet');
      return;
    }
    try {
      const tx = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'createMarketSale',
        args: [process.env.NEXT_PUBLIC_NFT_ADDRESS, nft.marketItemId],
        account: currentAccount as `0x${string}`,
        value: nft.price,
      });
      toast.success('Pembelian NFT berhasil!');
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error creating market sale:', error);
      toast.error('Gagal membeli NFT. Silakan coba lagi.');
    }
  }, [currentAccount, nft.marketItemId, nft.price, writeContractAsync]);

  const handleFavoriteToggle = useCallback(async () => {
    if (currentAccount === process.env.NEXT_PUBLIC_MARKET_ADDRESS) {
      toast.warning('Please connect to a wallet');
      return;
    }
    try {
      const tx = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        abi: KaligrafiNFT.abi,
        functionName: favorite ? 'removeFavorite' : 'addFavorite',
        args: [nft.tokenId],
      });
      setFavorite(!favorite);
      toast.success(
        `NFT telah ${favorite ? 'dihapus dari' : 'ditambahkan ke'} daftar favorit Anda!`,
      );
      console.log('Transaction sent:', tx);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(
        `Gagal ${favorite ? 'menghapus' : 'menambahkan'} NFT ke daftar favorit. Silakan coba lagi.`,
      );
    }
  }, [favorite, nft.tokenId, writeContractAsync]);

  const getMetadata = useCallback(async () => {
    if (!tokenURIData) return;

    const res = await fetch(`/api/metadata/${tokenURIData}`, {
      cache: 'force-cache',
    });
    if (!res.ok) {
      toast.error('Gagal mengambil metadata NFT');
      return;
    }
    const json = await res.json();
    setMetadata(json);
  }, [tokenURIData]);

  useEffect(() => {
    getMetadata();
  }, [getMetadata]);

  useEffect(() => {
    if (nft?.price) {
      setCurrentPrice(formatEther(nft.price));
    }
  }, [nft]);
  useEffect(() => {
    if (isFavoriteData !== undefined) {
      setFavorite(isFavoriteData);
    }
  }, [isFavoriteData]);

  if (metadata === null) {
    return <CardNFTSkeleton />;
  }

  if (!metadata.keyvalues.name.includes(searchParams.get('q') || '')) {
    return null;
  }

  return (
    <Card className="relative col-span-1 gap-2 pt-42 pb-4">
      <Image
        src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${metadata?.cid}`}
        alt={metadata?.name || 'NFT Image'}
        width={800}
        height={800}
        className="absolute -top-8 left-1/2 h-46 w-[calc(100%-1rem)] -translate-x-1/2 rounded-lg bg-muted-foreground object-cover object-center"
      />
      <Button
        size={'icon'}
        variant={favorite ? 'default' : 'secondary'}
        className="absolute -top-6 right-4 z-1"
        onClick={handleFavoriteToggle}
      >
        <Heart />
      </Button>
      <CardContent className="mb-4 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-5">
            <AvatarImage
              src={userProfileData?.avatarURL || '/default-avatar.png'}
              className="object-cover object-center"
            />
            <AvatarFallback>{nft.creator[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="line-clamp-1 leading-normal text-ellipsis">
            {metadata?.keyvalues.name}
          </CardTitle>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 px-4">
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
          {(!nft || (nft?.canceled && !nft?.sold)) && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="*Price"
                  min={1}
                  className="z-1 max-w-20 appearance-none"
                  value={currentPrice}
                  onChange={handleCurrentPriceChange}
                />
                <span className="text-sm text-muted-foreground">ETH</span>
              </div>

              <Button
                variant={'default'}
                className="z-1"
                onClick={
                  nft?.canceled
                    ? handleRelistMarketItem
                    : handleCreateMarketItem
                }
              >
                Sell
              </Button>
            </>
          )}
        </div>
      </CardFooter>
      <Link href={`/detail/${nft.tokenId}`} className="absolute inset-0"></Link>
    </Card>
  );
}
