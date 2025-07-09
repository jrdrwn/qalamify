'use client';

import { Boxes } from '@/components/ui/background-boxes';
import Link from 'next/link';

import { Button } from '../ui/button';

export default function EndCTA() {
  return (
    <section className="flex h-full flex-col items-center justify-center px-2">
      <div className="relative container mx-auto flex flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-border bg-muted/50 px-4 py-20">
        <h1 className="z-10 mb-4 text-center text-xl font-medium text-muted-foreground lg:text-2xl xl:text-4xl">
          Bergabunglah untuk Merayakan Seni Kaligrafi Digital!
        </h1>
        <p className="z-10 mb-6 max-w-4xl text-center text-sm text-muted-foreground/80 md:text-lg">
          Jadilah bagian dari komunitas yang mendukung seniman lokal dan
          eksplorasi seni kaligrafi dalam bentuk NFT. Mari bersama-sama
          menciptakan peluang baru di dunia seni digital.
        </p>
        <Link href="/explore" className="z-10">
          <Button size={'lg'}>Jelajahi Sekarang!</Button>
        </Link>
        <Boxes />
      </div>
    </section>
  );
}
