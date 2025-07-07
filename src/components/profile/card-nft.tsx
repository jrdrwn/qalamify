import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { NFT_ABI } from '@/app/abis/nft';
import { formatAddress } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react';
import { CircleUserRound, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Address, formatEther } from 'viem';
import { useReadContract, useWriteContract } from 'wagmi';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
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

export default function CardNFTViewed({ tokenId }: { tokenId: bigint }) {
  const router = useRouter();
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
  // Only fetch userProfileData if tokenCreatorData is available
  const { data: userProfileData } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'getUserProfile',
    args: [tokenCreatorData as Address],
    account: currentAddress,
    query: {
      enabled: !!tokenCreatorData,
    },
  });

  const { writeContractAsync } = useWriteContract();

  const { data: marketItemData, refetch: marketItemRefetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as Address,
    abi: MARKETPLACE_NFT,
    functionName: 'getMarketItemByTokenId',
    args: [tokenId],
    account: currentAddress,
  });

  const { data: ownerOfData, refetch: ownerOfRefetch } = useReadContract({
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
    abi: NFT_ABI,
    functionName: 'ownerOf',
    args: [tokenId],
    account: currentAddress,
  });

  const { data: tokenMetadata, refetch: tokenMetadataRefetch } =
    useReadContract({
      address: process.env.NEXT_PUBLIC_NFT_ADDRESS as Address,
      abi: NFT_ABI,
      functionName: 'getTokenMetadata',
      args: [tokenId],
    });

  // Memoize formatted price
  const formattedMarketPrice = useMemo(() => {
    return marketItemData?.price ? formatEther(marketItemData.price) : '';
  }, [marketItemData?.price]);

  const [currentPrice, setCurrentPrice] = useState<string>('');

  const [createMarketSaleLoading, setCreateMarketSaleLoading] = useState(false);
  const [cancelMarketItemLoading, setCancelMarketItemLoading] = useState(false);
  const [createMarketItemOrRelistLoading, setCreateMarketItemOrRelistLoading] =
    useState(false);

  const handleCurrentPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPrice(e.target.value);
  };

  const handleCreateMarketItem = useCallback(async () => {
    if (createMarketItemOrRelistLoading) return; // Prevent multiple clicks
    setCreateMarketItemOrRelistLoading(true);
    if (
      !currentPrice ||
      isNaN(Number(currentPrice)) ||
      Number(currentPrice) <= 0
    ) {
      toast.error('Harga tidak valid. Harap masukkan harga yang benar.');
      setCreateMarketItemOrRelistLoading(false);

      return;
    }
    try {
      // if sold approve again
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
      await tokenMetadataRefetch();
      router.refresh();
      toast.success('NFT berhasil dijual!');
    } catch (error) {
      console.error('Error creating market item:', error);
      toast.error('Gagal menjual NFT. Silakan coba lagi.');
    } finally {
      setCreateMarketItemOrRelistLoading(false);
    }
  }, [
    createMarketItemOrRelistLoading,
    currentPrice,
    writeContractAsync,
    tokenId,
    currentAddress,
    marketItemRefetch,
    ownerOfRefetch,
    tokenMetadataRefetch,
    router,
  ]);

  const handleCancelMarketItem = useCallback(async () => {
    if (cancelMarketItemLoading) return; // Prevent multiple clicks
    setCancelMarketItemLoading(true);
    if (!marketItemData) {
      toast.error('Tidak ada item pasar yang ditemukan untuk NFT ini.');
      setCancelMarketItemLoading(false);
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
        account: currentAddress,
      });
      await marketItemRefetch();
      await ownerOfRefetch();
      await tokenMetadataRefetch();
      router.refresh();
      toast.success('NFT berhasil dibatalkan dari pasar!');
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
    marketItemRefetch,
    ownerOfRefetch,
    router,
    tokenMetadataRefetch,
    writeContractAsync,
  ]);

  const handleCreateMarketSale = useCallback(async () => {
    if (createMarketSaleLoading) return; // Prevent multiple clicks
    setCreateMarketSaleLoading(true);
    if (!currentAddress) {
      toast.warning('Please connect to a wallet');
      setCreateMarketSaleLoading(false);
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
      await tokenMetadataRefetch();
      router.refresh();
      toast.success('Pembelian NFT berhasil!');
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
    marketItemRefetch,
    ownerOfRefetch,
    router,
    tokenMetadataRefetch,
    writeContractAsync,
  ]);

  const handleRelistMarketItem = useCallback(async () => {
    if (createMarketItemOrRelistLoading) return; // Prevent multiple clicks
    setCreateMarketItemOrRelistLoading(true);
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
      await tokenMetadataRefetch();
      router.refresh();
      toast.success('NFT berhasil direlist!');
    } catch (error) {
      console.error('Error relisting market item:', error);
      toast.error('Gagal mere-list NFT. Silakan coba lagi.');
    } finally {
      setCreateMarketItemOrRelistLoading(false);
    }
  }, [
    createMarketItemOrRelistLoading,
    currentPrice,
    marketItemData?.marketItemId,
    marketItemRefetch,
    ownerOfRefetch,
    router,
    tokenId,
    tokenMetadataRefetch,
    writeContractAsync,
  ]);

  // Gabungkan efek setFavorite dan setCurrentPrice
  useEffect(() => {
    if (marketItemData?.price)
      setCurrentPrice(formatEther(marketItemData.price));
  }, [marketItemData]);

  if (tokenMetadata === null) {
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
    <Card className="relative col-span-1 gap-2 pt-2 pb-2">
      <CardContent className="mb-2 px-2">
        <Image
          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${tokenURIData ?? ''}`}
          alt={tokenMetadata?.name || 'NFT Image'}
          width={800}
          height={800}
          className="mb-4 h-46 rounded-lg bg-muted-foreground object-cover object-center"
        />
        <div className="flex items-center gap-3">
          <Avatar className="size-5 bg-muted">
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
          </Avatar>
          <p className="line-clamp-1 text-ellipsis">{tokenMetadata?.name}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 px-2">
        <div className="flex w-full items-end justify-between">
          {currentAddress === ownerOfData && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Price"
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
                disabled={
                  createMarketItemOrRelistLoading ||
                  !currentPrice ||
                  isNaN(Number(currentPrice)) ||
                  Number(currentPrice) <= 0
                }
              >
                {createMarketItemOrRelistLoading && (
                  <Loader2 className="animate-spin"></Loader2>
                )}
                {marketItemData?.canceled ? 'Relist' : 'Sell'}
              </Button>
            </>
          )}
          {ownerOfData === process.env.NEXT_PUBLIC_MARKET_ADDRESS && (
            <>
              <Button variant={'outline'} className="z-1">
                {formattedMarketPrice} ETH
              </Button>
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
                  disabled={createMarketSaleLoading || !marketItemData?.price}
                >
                  {createMarketSaleLoading && (
                    <Loader2 className="animate-spin"></Loader2>
                  )}
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
