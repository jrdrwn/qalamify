'use client';

import { PencilRuler, PenTool, Search } from 'lucide-react';

import { Badge } from '../ui/badge';

function SidesDecorator() {
  return (
    <>
      <div className="absolute hidden rotate-45 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-5 lg:left-20 lg:flex lg:h-14 lg:w-14 xl:top-10 xl:left-8 xl:h-16 xl:w-16 2xl:left-22">
        <PenTool className="text-primary lg:size-7 xl:size-8" />
      </div>
      <div className="absolute hidden rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-30 lg:left-10 lg:flex lg:h-14 lg:w-14 xl:top-32 xl:left-28 xl:h-16 xl:w-16 2xl:top-35 2xl:left-45">
        <PencilRuler className="text-primary lg:size-7 xl:size-8" />
      </div>
      {/* <div className="absolute top-80 hidden rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:left-17 lg:flex lg:h-14 lg:w-14 xl:left-15 xl:h-16 xl:w-16 2xl:left-20">
        <Palette className="text-primary lg:size-7 xl:size-8" />
      </div> */}
      <div className="absolute hidden scale-x-[-1] -rotate-45 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-5 lg:right-20 lg:flex lg:h-14 lg:w-14 xl:top-10 xl:right-8 xl:h-16 xl:w-16 2xl:right-22">
        <PenTool className="text-primary lg:size-7 xl:size-8" />
      </div>
      <div className="absolute hidden scale-x-[-1] -rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-30 lg:right-10 lg:flex lg:h-14 lg:w-14 xl:top-32 xl:right-28 xl:h-16 xl:w-16 2xl:top-35 2xl:right-45">
        <PencilRuler className="text-primary lg:size-7 xl:size-8" />
      </div>
      {/* <div className="absolute top-80 hidden scale-x-[-1] -rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:right-17 lg:flex lg:h-14 lg:w-14 xl:right-15 xl:h-16 xl:w-16 2xl:right-20">
        <Palette className="text-primary lg:size-7 xl:size-8" />
      </div> */}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative container mx-auto flex justify-center px-2 pt-8 pb-6 lg:px-0 lg:pt-8 lg:pb-8">
      <div>
        <SidesDecorator />
        {/* Header */}
        <div className="text-center">
          <Badge className="mb-4 rounded-full px-4 py-2">
            <Search className="h-4 w-4" />
            Explore
          </Badge>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Discover <span className="text-primary">NFT Calligraphy</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Explore a collection of unique and valuable calligraphy NFTs,
            showcasing the beauty of artistic expression.
          </p>
        </div>
      </div>
    </section>
  );
}
