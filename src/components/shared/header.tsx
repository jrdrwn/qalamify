'use client';

import { NFT_ABI } from '@/app/abis/nft';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn, formatAddress } from '@/lib/utils';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitState,
} from '@reown/appkit/react';
import {
  Home,
  Loader2,
  Menu,
  PencilRuler,
  Plus,
  Search,
  User,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useReadContract } from 'wagmi';

import { Badge } from '../ui/badge';
import { ModeToggle } from './theme-toggle';

export default function Header() {
  const { open: openWalletModal } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { open } = useAppKitState();

  const { data: userProfileData } = useReadContract({
    abi: NFT_ABI,
    address: process.env.NEXT_PUBLIC_NFT_ADDRESS as `0x${string}`,
    functionName: 'getUserProfile',
    args: [address as `0x${string}`],
    query: {
      enabled: isConnected,
    },
  });

  const defaultMenus = useMemo(
    () => [
      {
        title: (
          <span className="flex items-center justify-center gap-1.5">
            <Home className="text-primary" />
            Home
          </span>
        ),
        href: '/',
      },
      {
        title: (
          <span className="flex items-center justify-center gap-1.5">
            <Search className="text-primary" />
            Explore
          </span>
        ),
        href: '/explore',
      },
      {
        title: (
          <span className="flex items-center justify-center gap-1.5">
            <Plus className="text-primary" />
            Create
          </span>
        ),
        href: '/create',
      },
    ],
    [],
  );

  const menus = useMemo(() => {
    if (isConnected) {
      return [
        ...defaultMenus,
        {
          title: (
            <span className="flex items-center justify-center gap-1.5">
              <User className="text-primary" />
              Profile
              {!userProfileData?.username || !userProfileData?.fullName ? (
                <Badge>Please update!</Badge>
              ) : null}
            </span>
          ),
          href: `/profile`,
        },
      ];
    }
    return defaultMenus;
  }, [isConnected, userProfileData, defaultMenus]);

  const pathname = usePathname();

  const handleConnectWallet = async () => {
    await openWalletModal({
      view: isConnected ? 'Account' : 'Connect',
    });
  };

  return (
    <header className="w-full border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between rounded-none px-4">
        <Link
          href="/"
          scroll={false}
          className="flex items-center gap-2"
          prefetch={false}
        >
          <Button className="rounded-full">
            <PencilRuler />
            <span className="">Qalamify</span>
          </Button>
        </Link>
        <NavigationMenu>
          <NavigationMenuList className="hidden items-center gap-2 text-sm font-medium lg:flex lg:gap-2 xl:gap-6">
            {menus.map((menu, idx) => (
              <NavigationMenuItem key={idx}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle({
                    className: cn(
                      'bg-transparent',
                      pathname === menu.href ? 'bg-muted' : '',
                    ),
                  })}
                  active={pathname === menu.href}
                  asChild
                >
                  <Link
                    href={menu.href}
                    className="flex items-center justify-center"
                    prefetch={false}
                  >
                    {menu.title}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-4">
          <Button variant={'outline'} onClick={handleConnectWallet}>
            {open ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Wallet />
                {isConnected && address ? (
                  <Badge>{formatAddress(address, 6)}</Badge>
                ) : (
                  <span>Connect Wallet</span>
                )}
              </>
            )}
          </Button>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
              >
                <Menu className="size-5 text-foreground/70" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4 lg:hidden">
              <SheetTitle>Menu</SheetTitle>
              <NavigationMenu className="items-start">
                <NavigationMenuList className="grid gap-4">
                  {menus.map((menu, idx) => (
                    <NavigationMenuItem key={idx}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                        active={pathname === menu.href}
                        asChild
                      >
                        <Link href={menu.href}>{menu.title}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
