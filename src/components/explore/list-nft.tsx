'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '../ui/button';
import CardNFT, { CardNFTSkeleton, INFT } from './card-nft';

export default function ListNFT() {
  const searchParams = useSearchParams();
  const [nfts, setNFTs] = useState<INFT[]>([]);
  const [newLoading, setNewLoading] = useState(false);
  const { data, error, loading } = {
    data: undefined,
    error: null,
    loading: true,
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (data) {
      setNFTs(data);
    }
  }, [data]);

  return (
    <section className="container mx-auto px-2 py-16 lg:px-0">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-16">
        <CardNFT
          creator="Pencipta NFT"
          jenis="Jenis NFT"
          nama="A Kaligrafi testing dolor sit amet"
          image_url="https://images.unsplash.com/photo-1664022617645-cf71791942e4"
          price={2}
          created_at="2023-10-01T12:00:00Z"
          id={1}
          creator_address="0x1234567890abcdef1234567890abcdef12345678"
        />
        {loading &&
          Array(6)
            .fill(0)
            .map((_, index) => <CardNFTSkeleton key={index} />)}
        {!loading &&
          nfts &&
          nfts.map((nft) => <CardNFT key={nft.id} {...nft} />)}
        {!loading && !newLoading && nfts.length === 0 && (
          <p className="w-full text-center text-lg font-semibold text-muted-foreground">
            Tidak ada NFT ditemukan
          </p>
        )}
        {newLoading &&
          Array(3)
            .fill(0)
            .map((_, index) => <CardNFTSkeleton key={index} />)}

        {error && <p>Error: {error.message}</p>}
      </div>
      <div className="flex justify-center">
        {!newLoading && !loading && (
          <Button
            variant="outline"
            onClick={async () => {
              setNewLoading(true);
              const res = await fetch(
                `/api/nft?${createQueryString('skip', nfts.length.toString())}`,
              );
              const data = await res.json();
              setNewLoading(false);
              setNFTs((prev) => [...prev, ...data]);
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
