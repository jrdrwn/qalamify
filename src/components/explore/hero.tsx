'use client';

import { cn } from '@/lib/utils';
import { Filter, PencilRuler, PenTool, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

function SidesDecorator() {
  return (
    <>
      <div className="absolute hidden rotate-45 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-5 lg:left-20 lg:flex lg:h-14 lg:w-14 xl:top-15 xl:left-8 xl:h-16 xl:w-16 2xl:left-22">
        <PenTool className="text-primary lg:size-7 xl:size-8" />
      </div>
      <div className="absolute hidden rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-48 lg:left-10 lg:flex lg:h-14 lg:w-14 xl:top-46 xl:left-28 xl:h-16 xl:w-16 2xl:top-50 2xl:left-45">
        <PencilRuler className="text-primary lg:size-7 xl:size-8" />
      </div>
      {/* <div className="absolute top-80 hidden rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:left-17 lg:flex lg:h-14 lg:w-14 xl:left-15 xl:h-16 xl:w-16 2xl:left-20">
        <Palette className="text-primary lg:size-7 xl:size-8" />
      </div> */}
      <div className="absolute hidden scale-x-[-1] -rotate-45 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-5 lg:right-20 lg:flex lg:h-14 lg:w-14 xl:top-15 xl:right-8 xl:h-16 xl:w-16 2xl:right-22">
        <PenTool className="text-primary lg:size-7 xl:size-8" />
      </div>
      <div className="absolute hidden scale-x-[-1] -rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:top-48 lg:right-10 lg:flex lg:h-14 lg:w-14 xl:top-46 xl:right-28 xl:h-16 xl:w-16 2xl:top-50 2xl:right-45">
        <PencilRuler className="text-primary lg:size-7 xl:size-8" />
      </div>
      {/* <div className="absolute top-80 hidden scale-x-[-1] -rotate-12 items-center justify-center rounded-md border-2 border-primary bg-muted shadow lg:right-17 lg:flex lg:h-14 lg:w-14 xl:right-15 xl:h-16 xl:w-16 2xl:right-20">
        <Palette className="text-primary lg:size-7 xl:size-8" />
      </div> */}
    </>
  );
}

export function Hero() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('q')) {
      setQ(searchParams.get('q') as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative container mx-auto flex justify-center px-2 pt-8 pb-6 lg:px-0 lg:pt-8 lg:pb-12">
      <div>
        <SidesDecorator />
        {/* Header */}
        <div className="mb-12 text-center">
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
        <div className="mx-auto mt-12 flex items-center justify-center gap-2 lg:gap-4">
          <Input
            type="search"
            placeholder="Contoh: Kaligrafi Arab..."
            className="w-full max-w-[400px] placeholder:text-sm lg:px-4 lg:py-6 lg:placeholder:text-base"
            onChange={(e) => setQ(e.target.value)}
            value={q}
          />
          <Button className="lg:px-4 lg:py-6" asChild>
            <Link
              scroll={false}
              href={{
                pathname: '/explore',
                query: { q },
              }}
            >
              {<Search />}
              <span className="hidden lg:block">Cari</span>
            </Link>
          </Button>
          <Button
            className="lg:px-4 lg:py-6"
            variant={'secondary'}
            onClick={() => {
              // setFilterOpen(!filterOpen);
              toast.info('Fitur ini akan segera hadir!');
            }}
          >
            <Filter />
            <span className="hidden lg:block">Filter</span>
          </Button>
        </div>
        <div
          className={cn(
            'mt-4 flex-wrap items-center justify-center gap-4 [&>*]:placeholder:text-sm lg:[&>*]:placeholder:text-base',
            filterOpen ? 'flex' : 'hidden',
          )}
        >
          {/* TODO: FILTERING */}
        </div>
      </div>
    </section>
  );
}
