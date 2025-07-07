'use client';

import { ArrowRight, BellDot, Search, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function Hero() {
  const [q, setQ] = useState('');
  const reviews = {
    count: 200,
    rating: 4.5,
    avatars: [
      {
        src: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
        alt: 'Avatar 1',
      },
      {
        src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
        alt: 'Avatar 2',
      },
      {
        src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
        alt: 'Avatar 3',
      },
      {
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
        alt: 'Avatar 4',
      },
      {
        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80',
        alt: 'Avatar 5',
      },
    ],
  };

  return (
    <section className="container mx-auto flex flex-col justify-center px-2 py-16 lg:flex-row lg:justify-between lg:pr-2 lg:pl-12">
      <div className="text-center lg:text-start">
        <div className="mx-auto flex w-max items-center gap-2 rounded-full bg-muted px-2 py-1 text-muted-foreground lg:mx-0 xl:gap-4 xl:px-4 xl:py-2">
          <span>
            <BellDot className="size-5 text-primary xl:size-6" />
          </span>
          <p className="text-sm xl:text-base">
            A New Collection of Calligraphy Awaits!
          </p>
          <span className="rounded-full bg-primary p-1">
            <ArrowRight className="size-4 text-primary-foreground md:size-5 xl:size-6" />
          </span>
        </div>
        <h1 className="mt-4 mb-4 max-w-3xl bg-gradient-to-br from-primary to-secondary bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl lg:mb-6 lg:text-4xl xl:mb-8 xl:text-6xl xl:tracking-wide">
          Discover and Own Exclusive Islamic Calligraphy NFTs!
        </h1>
        <p className="mx-auto max-w-2xl leading-relaxed lg:mx-0 xl:text-lg xl:tracking-wide">
          Explore a unique and authentic collection of digital Islamic
          calligraphy art. From timeless classics to modern masterpieces, all
          available for you to cherish as NFTs.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start 2xl:mt-12">
          <Input
            type="text"
            placeholder="Cari karya seni kaligrafi..."
            className="w-full max-w-3xs placeholder:text-sm lg:max-w-[350px] lg:px-3 lg:py-5 xl:max-w-[400px] xl:px-4 xl:py-6 xl:placeholder:text-base"
            onChange={(e) => setQ(e.currentTarget.value)}
            value={q}
          />
          <Button className="lg:px-3 lg:py-5 xl:px-4 xl:py-6" asChild>
            <Link
              scroll={false}
              href={{
                pathname: '/explore',
                query: { q },
              }}
            >
              {<Search />}
              <span className="hidden xl:block">Cari Kaligrafi</span>
            </Link>
          </Button>
        </div>
        <div className="mx-auto mt-8 flex w-fit flex-wrap items-center justify-center gap-2 lg:mx-0 2xl:mt-12">
          <span className="mr-2 inline-flex items-center -space-x-4">
            {reviews.avatars.map((avatar, index) => (
              <Avatar
                key={index}
                className="size-10 border-2 border-white lg:size-12"
              >
                <AvatarImage
                  src={avatar.src}
                  alt={avatar.alt}
                  className="object-cover object-center"
                />
              </Avatar>
            ))}
          </span>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="size-4 fill-orange-400 text-orange-400 lg:size-5"
                />
              ))}
              <span className="mr-1 font-semibold">
                {reviews.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-left text-sm font-medium text-muted-foreground lg:text-base">
              Dari {reviews.count}+{' '}
              <Link href="#" className="underline underline-offset-2">
                ulasan
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full pt-20 sm:mx-auto sm:max-w-lg lg:mx-0 xl:max-w-xl xl:pt-0 2xl:max-w-3xl">
        <div className="relative mx-auto flex items-center justify-center lg:h-65 lg:w-120 xl:h-140 2xl:h-170 2xl:w-180">
          <Image
            src={'https://images.unsplash.com/photo-1574246604907-db69e30ddb97'}
            alt="hero"
            width={800}
            height={800}
            className="absolute -top-10 right-0 h-20 w-40 rounded-lg object-cover object-center shadow-lg lg:-top-10 lg:right-5 xl:top-5 xl:h-30 xl:w-50 2xl:top-10 2xl:right-5 2xl:h-40 2xl:w-60"
          />
          <Image
            src={'https://images.unsplash.com/photo-1590075865003-e48277faa558'}
            alt="hero"
            width={800}
            height={800}
            className="absolute bottom-25 left-0 h-20 w-40 rounded-lg object-cover object-bottom shadow-lg lg:bottom-25 lg:left-10 xl:bottom-60 xl:left-5 xl:h-25 xl:w-50"
          />
          <Image
            src={'https://images.unsplash.com/photo-1616422840391-fa670d4b2ae7'}
            alt="hero"
            width={800}
            height={800}
            className="absolute right-0 -bottom-5 h-10 w-60 rounded-lg object-cover object-top shadow-lg lg:right-auto lg:-bottom-7 xl:bottom-15 xl:h-15 xl:w-85"
          />
          <Image
            src={'https://images.unsplash.com/photo-1644564930499-386ed55f97c5'}
            alt="hero"
            width={800}
            height={800}
            className="h-70 w-70 rounded-lg object-cover object-center xl:h-100 xl:w-100 2xl:h-125 2xl:w-125"
          />
        </div>
      </div>
    </section>
  );
}
