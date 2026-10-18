'use client';

import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { useStore } from './store-provider';

const collections = [
  { label: 'New In', href: '/shop' },
  { label: 'Clothing', href: '/shop' },
  { label: 'Dresses', href: '/shop?category=Dresses' },
  { label: 'Tops', href: '/shop?category=Tops' },
  { label: 'Bottoms', href: '/shop?category=Bottoms' },
  { label: 'Knitwear', href: '/shop?category=Knitwear' },
  { label: 'Outerwear', href: '/shop?category=Outerwear' },
  { label: 'Accessories', href: '/shop?category=Accessories' },
  { label: 'Sale', href: '/shop' },
];

export function Header() {
  const { lines, setCartOpen, favorites } = useStore();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e9e7e5] bg-white">
      <div className="mx-auto max-w-[1420px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[58px] items-center gap-5">
          <button
            aria-label={menu ? 'Close menu' : 'Open menu'}
            className="shrink-0 lg:hidden"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link href="/" aria-label="GEKIAN home" className="shrink-0 text-[25px] leading-none tracking-[-.08em]">
            <span className="font-light">GE</span>
            <span className="font-bold">KIAN</span>
          </Link>

          <nav aria-label="Featured collections" className="hidden shrink-0 items-center gap-5 pl-3 lg:flex">
            <Link href="/shop" className="flex h-[58px] items-center border-b-2 border-black text-[10px] tracking-[.03em]">WOMEN</Link>
            <Link href="/shop?category=Dresses" className="text-[10px] tracking-[.03em]">NEW IN</Link>
            <Link href="/shop?category=Accessories" className="text-[10px] tracking-[.03em]">ACCESSORIES</Link>
          </nav>

          <form action="/shop" className="ml-auto flex h-[34px] min-w-0 max-w-[330px] flex-1 items-center rounded-full border border-[#dedede] px-3">
            <input
              name="q"
              aria-label="Search products"
              placeholder="Search within women's clothing"
              className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-[#888]"
            />
            <button aria-label="Submit search" type="submit" className="ml-2 shrink-0 text-[#333]">
              <Search size={16} strokeWidth={1.6} />
            </button>
          </form>

          <div className="flex shrink-0 items-center gap-4 sm:gap-5">
            <Link
              aria-label={`Wishlist with ${favorites.length} items`}
              href="/shop?wishlist=true"
              className="relative hidden sm:block"
            >
              <Heart size={18} strokeWidth={1.6} />
              {favorites.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button
              aria-label={`Open shopping bag with ${lines.reduce((count, line) => count + line.qty, 0)} items`}
              onClick={() => setCartOpen(true)}
              className="relative"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              {lines.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">
                  {lines.reduce((count, line) => count + line.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav aria-label="Shop categories" className="hidden h-[36px] items-center justify-center gap-6 border-t border-[#f1f1f1] text-[10px] lg:flex">
          {collections.map((collection) => (
            <Link
              key={collection.label}
              href={collection.href}
              className={collection.label === 'Sale' ? 'text-[#a3483f]' : ''}
            >
              {collection.label}
            </Link>
          ))}
        </nav>

        {menu && (
          <nav aria-label="Mobile shop categories" className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[#f1f1f1] py-5 text-[11px] uppercase tracking-[.12em] lg:hidden">
            {collections.map((collection) => (
              <Link
                key={collection.label}
                href={collection.href}
                onClick={() => setMenu(false)}
                className={collection.label === 'Sale' ? 'text-[#a3483f]' : ''}
              >
                {collection.label}
              </Link>
            ))}
            <Link href="/shop?wishlist=true" onClick={() => setMenu(false)} className="sm:hidden">
              Wishlist
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
