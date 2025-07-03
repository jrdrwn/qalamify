'use client';

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
  useAppKitBalance,
} from '@reown/appkit/react';
import {
  Home,
  Menu,
  PencilRuler,
  Plus,
  Search,
  User,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Badge } from '../ui/badge';
import { ModeToggle } from './theme-toggle';

export default function Header() {
  const { open: openWalletModal } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { fetchBalance } = useAppKitBalance();
  const [balance, setBalance] =
    useState<Awaited<ReturnType<typeof fetchBalance>>>();
  const defaultMenus = [
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
  ];
  const [menus, setMenus] = useState(defaultMenus);

  const pathname = usePathname();

  const handleConnectWallet = () => {
    openWalletModal({
      view: isConnected ? 'Account' : 'Connect',
    });
  };

  const getBalance = useCallback(async () => {
    if (isConnected && address) {
      const balanceData = await fetchBalance();
      setBalance(balanceData);
      setMenus([
        ...defaultMenus,
        {
          title: (
            <span className="flex items-center justify-center gap-1.5">
              <User className="text-primary" />
              Profile
            </span>
          ),
          href: `/profile`,
        },
      ]);
      return;
    }
    setMenus(defaultMenus);
  }, [isConnected, address]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

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
            <span className="">Qalamint</span>
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
                      pathname === menu.href
                        ? 'underline underline-offset-2'
                        : '',
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
            <Wallet />
            {isConnected && address ? (
              balance ? (
                <>
                  {balance.data?.balance} {balance.data?.symbol}{' '}
                  <Badge>{formatAddress(address, 3)}</Badge>
                </>
              ) : (
                <span>Loading...</span>
              )
            ) : (
              <span>Connect Wallet</span>
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
