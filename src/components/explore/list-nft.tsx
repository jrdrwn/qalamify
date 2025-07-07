'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { useAppKitAccount } from '@reown/appkit/react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useReadContract } from 'wagmi';

import { Button } from '../ui/button';
import CardNFT, { CardNFTSkeleton } from './card-nft';

// Simpan address market di luar komponen agar tidak re-create setiap render
const MARKET_ADDRESS = process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`;

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
    address: MARKET_ADDRESS,
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

  // Helper untuk render skeleton
  const renderSkeletons = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, index) => <CardNFTSkeleton key={index} />);

  // Memoize hasil NFT agar tidak re-render jika tidak berubah
  const nfts = availableMarketItems || [];

  return (
    <section className="container mx-auto px-2 pt-4 pb-10 lg:px-0">
      <div className="grid grid-cols-1 gap-x-8 gap-y-16 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoadingAvailableMarketItems && renderSkeletons(6)}
        {!isLoadingAvailableMarketItems &&
          nfts.length > 0 &&
          nfts.map((nft) => (
            <CardNFT
              key={nft.marketItemId}
              currentAccount={address || MARKET_ADDRESS}
              nft={nft}
              availableMarketItemsRefetch={availableMarketItemsRefetch}
            />
          ))}
        {!isLoadingAvailableMarketItems && nfts.length === 0 && (
          <p className="col-span-4 w-full text-center text-lg font-semibold text-muted-foreground">
            Tidak ada NFT ditemukan
          </p>
        )}
        {newLoading && renderSkeletons(3)}
        {isErrorAvailableMarketItems && (
          <p>There was an error loading the NFTs. Please try again later.</p>
        )}
      </div>
      <div className="flex justify-center">
        {!newLoading && !isLoadingAvailableMarketItems && (
          <Button
            variant="outline"
            onClick={async () => {
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
