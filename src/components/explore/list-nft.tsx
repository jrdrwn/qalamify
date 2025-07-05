'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { useAppKitAccount } from '@reown/appkit/react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useReadContract } from 'wagmi';

import { Button } from '../ui/button';
import CardNFT, { CardNFTSkeleton } from './card-nft';

export default function ListNFT() {
  const searchParams = useSearchParams();
  const { address } = useAppKitAccount();
  const [newLoading, setNewLoading] = useState(false);
  const {
    data: availableMarketItems,
    isLoading: isLoadingAvailableMarketItems,
    isError: isErrorAvailableMarketItems,
    refetch: availableMarketItemsRefetch,
  } = useReadContract({
    address: process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_NFT,
    functionName: 'fetchAvailableMarketItems',
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <section className="container mx-auto px-2 py-16 lg:px-0">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoadingAvailableMarketItems &&
          Array(6)
            .fill(0)
            .map((_, index) => <CardNFTSkeleton key={index} />)}
        {!isLoadingAvailableMarketItems &&
          availableMarketItems &&
          availableMarketItems.map((nft) => (
            <CardNFT
              key={nft.marketItemId}
              currentAccount={
                address || process.env.NEXT_PUBLIC_MARKET_ADDRESS!
              }
              nft={nft}
              availableMarketItemsRefetch={availableMarketItemsRefetch}
            />
          ))}

        {!isLoadingAvailableMarketItems &&
          availableMarketItems?.length === 0 && (
            <p className="col-span-4 w-full text-center text-lg font-semibold text-muted-foreground">
              Tidak ada NFT ditemukan
            </p>
          )}
        {newLoading &&
          Array(3)
            .fill(0)
            .map((_, index) => <CardNFTSkeleton key={index} />)}

        {isErrorAvailableMarketItems && (
          <p>There was an error loading the NFTs. Please try again later.</p>
        )}
      </div>
      <div className="flex justify-center">
        {!newLoading && !isLoadingAvailableMarketItems && (
          <Button
            variant="outline"
            onClick={async () => {
              // setNewLoading(true);
              // const res = await fetch(
              //   `/api/nft?${createQueryString('skip', nfts.length.toString())}`,
              // );
              // const data = await res.json();
              // setNewLoading(false);
              // setNFTs((prev) => [...prev, ...data]);
              toast.info('Fitur ini akan segera hadir!');
            }}
            className="mx-auto mt-8"
          >
            Muat lebih banyak
          </Button>
        )}
      </div>
    </section>
  );
}
