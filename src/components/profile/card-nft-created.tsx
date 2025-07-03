import KaligrafiNFT from '@/app/abis/KaligrafiNFT.json';
import MarketplaceNFT from '@/app/abis/Marketplace.json';
import { formatAddress } from '@/lib/utils';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
    <Card className="relative w-80 animate-pulse gap-2 pt-42 pb-4">
      <Skeleton className="absolute -top-8 left-1/2 h-46 w-[calc(100%-2rem)] -translate-x-1/2 rounded-lg" />
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

export default function CardNFTCreated({
  tokenId,
  currentAddress,
}: {
  currentAddress: `0x${string}`;
  tokenId: bigint;
}) {
  const { data: tokenURIData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'tokenURI',
    args: [tokenId],
    account: currentAddress,
  });
  const { data: tokenCreatorData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getTokenCreatorById',
    args: [tokenId],
    account: currentAddress,
  });
  const { data: userProfileData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'getUserProfile',
    args: [tokenCreatorData],
    account: currentAddress,
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
    args: [tokenId],
    account: currentAddress,
  }) as {
    data: boolean | undefined;
  };
  const { writeContractAsync } = useWriteContract();
  const [favorite, setFavorite] = useState(false);
  const [metadata, setMetadata] = useState<FileListItem | null>(null);

  const { data: marketItemData } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
    abi: MarketplaceNFT.abi,
    functionName: 'getMarketItemByTokenId',
    args: [tokenId],
    account: currentAddress as `0x${string}`,
  }) as {
    data:
      | {
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
      | undefined;
  };

  const [currentPrice, setCurrentPrice] = useState<string>('');
  const { data: ownerOfData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    abi: KaligrafiNFT.abi,
    functionName: 'ownerOf',
    args: [tokenId],
    account: currentAddress,
  }) as {
    data: `0x${string}` | undefined;
  };
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
      // if sold approve again
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        abi: KaligrafiNFT.abi,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_MARKET_ADDRESS, tokenId],
        account: currentAddress,
      });
      const priceInWei = BigInt(Number(currentPrice) * 1e18); // Konversi ke wei
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'createMarketItem',
        args: [process.env.NEXT_PUBLIC_NFT_ADDRESS, tokenId, priceInWei],
        account: currentAddress,
      });
      toast.success('NFT berhasil dijual!');
    } catch (error) {
      console.error('Error creating market item:', error);
      toast.error('Gagal menjual NFT. Silakan coba lagi.');
    }
  }, [currentPrice, currentAddress, tokenId, writeContractAsync]);

  const handleCancelMarketItem = useCallback(async () => {
    if (!marketItemData) {
      return;
    }
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'cancelMarketItem',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS,
          marketItemData.marketItemId,
        ],
      });
      toast.success('NFT berhasil dibatalkan dari pasar!');
    } catch (error) {
      console.error('Error canceling market item:', error);
      toast.error('Gagal membatalkan NFT dari pasar. Silakan coba lagi.');
    }
  }, [marketItemData, writeContractAsync]);

  const handleCreateMarketSale = useCallback(async () => {
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'createMarketSale',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS,
          marketItemData?.marketItemId,
        ],
        account: currentAddress,
        value: marketItemData?.price,
      });
      toast.success('Pembelian NFT berhasil!');
    } catch (error) {
      console.error('Error creating market sale:', error);
      toast.error('Gagal membeli NFT. Silakan coba lagi.');
    }
  }, [
    currentAddress,
    marketItemData?.marketItemId,
    marketItemData?.price,
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
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        abi: KaligrafiNFT.abi,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_MARKET_ADDRESS, tokenId],
      });

      const priceInWei = BigInt(Number(currentPrice) * 1e18); // Konversi ke wei
      const tx = await writeContractAsync({
        address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
        abi: MarketplaceNFT.abi,
        functionName: 'relistMarketItem',
        args: [
          process.env.NEXT_PUBLIC_NFT_ADDRESS,
          marketItemData?.marketItemId,
          priceInWei,
        ],
      });
      toast.success('NFT berhasil direlist!');
    } catch (error) {
      console.error('Error relisting market item:', error);
      toast.error('Gagal mere-list NFT. Silakan coba lagi.');
    }
  }, [currentPrice, marketItemData?.marketItemId, tokenId, writeContractAsync]);

  const handleFavoriteToggle = useCallback(async () => {
    try {
      await writeContractAsync({
        address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
        abi: KaligrafiNFT.abi,
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
  }, [favorite, tokenId, writeContractAsync]);

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
    if (isFavoriteData !== undefined) {
      setFavorite(isFavoriteData);
    }
  }, [isFavoriteData]);

  useEffect(() => {
    if (marketItemData?.price) {
      setCurrentPrice(formatEther(marketItemData.price));
    }
  }, [marketItemData]);

  if (metadata === null) {
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
            <AvatarFallback>{currentAddress[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="line-clamp-1 leading-normal text-ellipsis">
            {metadata?.keyvalues.name}
          </CardTitle>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 px-4">
        <div className="flex w-full items-end justify-between">
          {currentAddress === ownerOfData && (
            <>
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
                    marketItemData?.canceled
                      ? handleRelistMarketItem
                      : handleCreateMarketItem
                  }
                >
                  {marketItemData?.canceled ? 'Relist' : 'Sell'}
                </Button>
              </>
            </>
          )}
          {ownerOfData === process.env.NEXT_PUBLIC_MARKET_ADDRESS && (
            <>
              <Button variant={'outline'} className="z-1">
                {marketItemData?.price && formatEther(marketItemData?.price)}{' '}
                ETH
              </Button>
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
            </>
          )}
          {ownerOfData !== process.env.NEXT_PUBLIC_MARKET_ADDRESS &&
            currentAddress !== ownerOfData && (
              <>
                <Button variant={'outline'} className="z-1 line-through">
                  Sold
                </Button>
                <Button className="z-1">
                  {`Owned by ${formatAddress(ownerOfData, 4)}`}
                </Button>
              </>
            )}
        </div>
      </CardFooter>
      <Link href={`/detail/${tokenId}`} className="absolute inset-0"></Link>
    </Card>
  );
}
