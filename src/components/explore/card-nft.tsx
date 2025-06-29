import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export interface INFT {
  id: number;
  nama: string;
  jenis: string;
  image_url: string;
  creator: string; // Nama pencipta NFT
  price: number; // Harga NFT
  created_at: string; // Tanggal NFT dibuat
  creator_address: string; // Alamat dompet pencipta NFT
}
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

export default function CardNFT(nft: INFT) {
  const [favorite, setFavorite] = useState(false);
  return (
    <Card className="relative col-span-1 gap-2 pt-42 pb-4">
      <Image
        src={nft.image_url}
        alt={nft.nama}
        width={800}
        height={800}
        className="absolute -top-8 left-1/2 h-46 w-[calc(100%-1rem)] -translate-x-1/2 rounded-lg object-cover object-center"
      />
      <Button
        size={'icon'}
        variant={favorite ? 'default' : 'secondary'}
        className="absolute -top-6 right-4 z-1"
        onClick={() => {
          setFavorite(!favorite);
          toast.info('NFT telah ditambahkan ke daftar favorit Anda!');
        }}
      >
        <Heart />
      </Button>
      <CardContent className="px-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-5">
            <AvatarImage
              src={`https://images.unsplash.com/photo-1694434943114-c8ea2049f781`}
              className="object-cover object-center"
            />
            <AvatarFallback>{nft.creator_address[0]}</AvatarFallback>
          </Avatar>
          <CardTitle className="line-clamp-1 text-ellipsis">
            {nft.nama}
          </CardTitle>
        </div>
      </CardContent>
      <CardFooter className="flex items-end justify-between px-4">
        <div className="flex flex-col">
          <span className="font-semibold">{nft.price} ETH</span>
        </div>
        <Button
          className="z-1 flex items-center justify-between"
          variant={'ghost'}
          size={'sm'}
        >
          <ShoppingCart />
        </Button>
      </CardFooter>
      <Link
        href={`/explore/${nft.id}`}
        target="_blank"
        className="absolute inset-0"
      ></Link>
    </Card>
  );
}
