import { Hero } from '@/components/explore/hero';
import ListNFT from '@/components/explore/list-nft';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense>
      <Hero />
      <ListNFT />
    </Suspense>
  );
}
