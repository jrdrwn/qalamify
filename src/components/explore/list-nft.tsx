'use client';

import { MARKETPLACE_NFT } from '@/app/abis/marketplace';
import { cn } from '@/lib/utils';
import { useAppKitAccount } from '@reown/appkit/react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useReadContract, useWatchContractEvent } from 'wagmi';

import {
  calligraphyStyles,
  compositions,
  decorations,
  presentationStyles,
} from '../create';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import CardNFT, { CardNFTSkeleton } from './card-nft';

// Simpan address market di luar komponen agar tidak re-create setiap render
const MARKET_ADDRESS = process.env.NEXT_PUBLIC_MARKET_ADDRESS as `0x${string}`;

export default function ListNFT() {
  const searchParams = useSearchParams();
  const { address } = useAppKitAccount();
  const {
    data: availableMarketItems,
    isLoading: isLoadingAvailableMarketItems,
    isError: isErrorAvailableMarketItems,
    refetch: availableMarketItemsRefetch,
  } = useReadContract({
    address: MARKET_ADDRESS,
    abi: MARKETPLACE_NFT,
    functionName: 'fetchAvailableMarketItemsWithMetadata',
    args: [
      searchParams.get('offset')
        ? BigInt(parseInt(searchParams.get('offset') as string, 10))
        : BigInt(0),
      searchParams.get('limit')
        ? BigInt(parseInt(searchParams.get('limit') as string, 10))
        : BigInt(10),
    ],
  });

  useWatchContractEvent({
    address: MARKET_ADDRESS,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCreated',
    async onLogs(logs) {
      // Hanya refetch jika event berasal dari akun yang sedang aktif
      if (logs[0].args?.seller?.toLowerCase() === address?.toLowerCase()) {
        await availableMarketItemsRefetch();
      }
    },
  });

  useWatchContractEvent({
    address: MARKET_ADDRESS,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemCanceled',
    async onLogs(logs) {
      // Hanya refetch jika event berasal dari akun yang sedang aktif
      if (logs[0].args?.seller?.toLowerCase() === address?.toLowerCase()) {
        await availableMarketItemsRefetch();
        toast.success('NFT berhasil dibatalkan dari pasar!');
      }
    },
  });

  useWatchContractEvent({
    address: MARKET_ADDRESS,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemSold',
    async onLogs(logs) {
      // Hanya refetch jika event berasal dari akun yang sedang aktif
      if (logs[0].args?.buyer?.toLowerCase() === address?.toLowerCase()) {
        await availableMarketItemsRefetch();
        toast.success('NFT berhasil dibeli!');
      }
    },
  });

  useWatchContractEvent({
    address: MARKET_ADDRESS,
    abi: MARKETPLACE_NFT,
    eventName: 'MarketItemRelisted',
    async onLogs(logs) {
      // Hanya refetch jika event berasal dari akun yang sedang aktif
      if (logs[0].args?.seller?.toLowerCase() === address?.toLowerCase()) {
        await availableMarketItemsRefetch();
        toast.success('NFT berhasil dire-list di pasar!');
      }
    },
  });

  // Helper untuk render skeleton
  const renderSkeletons = (count: number) =>
    Array(count)
      .fill(0)
      .map((_, index) => <CardNFTSkeleton key={index} />);

  // Memoize hasil NFT agar tidak re-render jika tidak berubah
  const nfts = availableMarketItems || [];
  const [q, setQ] = useState<string>('');
  const [calligraphyStyle, setCalligraphyStyle] = useState<number>();
  const [presentationStyle, setPresentationStyle] = useState<number>();
  const [composition, setComposition] = useState<number>();
  const [decoration, setDecoration] = useState<number>();

  useEffect(() => {
    if (searchParams.get('q')) {
      setQ(searchParams.get('q') as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="container mx-auto px-2 pt-4 pb-10 lg:px-0">
      <div className="mx-auto mb-8 flex flex-wrap items-center justify-between gap-2 px-4 lg:gap-4">
        <div className="flex w-full max-w-[400px] items-center gap-2">
          <Input
            type="search"
            placeholder="Contoh: Kaligrafi Arab..."
            className="w-full max-w-[400px]"
            onChange={(e) => setQ(e.target.value)}
            value={q}
          />
          <Button asChild>
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
        </div>
        <div className="flex flex-wrap justify-center gap-2 lg:justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                role="combobox"
                className={'justify-between'}
              >
                {calligraphyStyle
                  ? calligraphyStyles.find((cs) => cs.id === calligraphyStyle)
                      ?.label
                  : 'Calligraphy Style'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search" className="h-9" />
                <CommandList>
                  <CommandEmpty>Not found</CommandEmpty>
                  <CommandGroup>
                    {calligraphyStyles.map((cs) => (
                      <CommandItem
                        key={cs.id}
                        value={cs.id.toString()}
                        onSelect={() => {
                          setCalligraphyStyle(
                            calligraphyStyle === cs.id ? undefined : cs.id,
                          );
                        }}
                      >
                        {cs.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            cs.id === calligraphyStyle
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                role="combobox"
                className={cn(
                  'justify-between',
                  !composition && 'text-muted-foreground',
                )}
              >
                {composition
                  ? compositions.find((cs) => cs.id === composition)?.label
                  : 'Composition'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search" className="h-9" />
                <CommandList>
                  <CommandEmpty>Not found</CommandEmpty>
                  <CommandGroup>
                    {compositions.map((cs) => (
                      <CommandItem
                        key={cs.id}
                        value={cs.id.toString()}
                        onSelect={() => {
                          setComposition(
                            composition === cs.id ? undefined : cs.id,
                          );
                        }}
                      >
                        {cs.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            cs.id === composition ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                role="combobox"
                className={cn(
                  'justify-between',
                  !presentationStyle && 'text-muted-foreground',
                )}
              >
                {presentationStyle
                  ? presentationStyles.find((ps) => ps.id === presentationStyle)
                      ?.label
                  : 'Presentation Style'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search" className="h-9" />
                <CommandList>
                  <CommandEmpty>Not found</CommandEmpty>
                  <CommandGroup>
                    {presentationStyles.map((ps) => (
                      <CommandItem
                        key={ps.id}
                        value={ps.id.toString()}
                        onSelect={() => {
                          setPresentationStyle(
                            presentationStyle === ps.id ? undefined : ps.id,
                          );
                        }}
                      >
                        {ps.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            ps.id === presentationStyle
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                role="combobox"
                className={cn(
                  'justify-between',
                  !decoration && 'text-muted-foreground',
                )}
              >
                {decoration
                  ? decorations.find((dc) => dc.id === decoration)?.label
                  : 'Decoration'}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search" className="h-9" />
                <CommandList>
                  <CommandEmpty>Not found</CommandEmpty>
                  <CommandGroup>
                    {decorations.map((dc) => (
                      <CommandItem
                        key={dc.id}
                        value={dc.id.toString()}
                        onSelect={() => {
                          setDecoration(
                            decoration === dc.id ? undefined : dc.id,
                          );
                        }}
                      >
                        {dc.label}
                        <Check
                          className={cn(
                            'ml-auto',
                            dc.id === decoration ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoadingAvailableMarketItems && renderSkeletons(6)}
        {!isLoadingAvailableMarketItems &&
          nfts.length > 0 &&
          nfts
            .filter(
              (nft) =>
                nft.metadata.name.includes(q) ||
                nft.metadata.description.includes(q),
            )
            .filter((nft) =>
              calligraphyStyle
                ? nft.metadata.calligraphyStyle == BigInt(calligraphyStyle)
                : true,
            )
            .filter((nft) =>
              presentationStyle
                ? nft.metadata.presentationStyle == BigInt(presentationStyle)
                : true,
            )
            .filter((nft) =>
              decoration ? nft.metadata.decoration == BigInt(decoration) : true,
            )
            .map((nft) => (
              <CardNFT
                key={nft.item.marketItemId}
                currentAccount={address || MARKET_ADDRESS}
                nft={nft.item}
              />
            ))}
        {!isLoadingAvailableMarketItems && nfts.length === 0 && (
          <p className="col-span-4 w-full text-center text-lg font-semibold text-muted-foreground">
            Tidak ada NFT ditemukan
          </p>
        )}
        {isErrorAvailableMarketItems && (
          <p>There was an error loading the NFTs. Please try again later.</p>
        )}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {parseInt(searchParams.get('offset') || '0', 10) === 0 ? (
          <Button variant={'secondary'} disabled>
            <ChevronLeft />
            Prev
          </Button>
        ) : (
          <Link
            href={{
              pathname: '/explore',
              query: {
                ...Object.fromEntries(searchParams.entries()),
                offset: (
                  parseInt(searchParams.get('offset') || '0', 10) - 10
                ).toString(),
              },
            }}
            passHref
          >
            <Button variant={'secondary'}>
              <ChevronLeft />
              Prev
            </Button>
          </Link>
        )}
        {availableMarketItems && availableMarketItems.length < 1 ? (
          <Button variant={'secondary'} disabled>
            Next
            <ChevronRight />
          </Button>
        ) : (
          <Link
            href={{
              pathname: '/explore',
              query: {
                ...Object.fromEntries(searchParams.entries()),
                offset: (
                  parseInt(searchParams.get('offset') || '0', 10) + 10
                ).toString(),
              },
            }}
            passHref
          >
            <Button variant={'secondary'}>
              Next
              <ChevronRight />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
