"use client";
import Link from "next/link";
import {Heart,Menu,Search,ShoppingBag,X} from "lucide-react";
import {useState} from "react";
import {useStore} from "./store-provider";
export function Header(){const{lines,favorites,setCartOpen}=useStore();const[menu,setMenu]=useState(false);const count=lines.reduce((n,v)=>n+v.qty,0);
return <header className="sticky top-0 z-40 border-b border-[#e9e7e5] bg-white"><div className="container-site"><div className="flex h-[68px] items-center gap-5">
<button aria-label={menu?"Close menu":"Open menu"} className="lg:hidden" onClick={()=>setMenu(!menu)}>{menu?<X size={20}/>:<Menu size={20}/>}</button>
<Link href="/" className="shrink-0 text-[25px] tracking-[-.08em]" aria-label="GEKIAN home"><span className="font-light">GE</span><span className="font-bold">KIAN</span></Link>
<nav className="hidden lg:flex gap-6 text-xs tracking-wider"><Link href="/#shop">WOMEN</Link><Link href="/#shop">NEW IN</Link><Link href="/#shop">ACCESSORIES</Link></nav>
<form action="/" className="ml-auto max-w-[330px] min-w-0 flex-1 flex items-center rounded-full border border-[#dedede] px-3 py-2"><input name="q" aria-label="Search products" placeholder="Search women's fashion" className="min-w-0 flex-1 bg-transparent text-xs outline-none"/><button aria-label="Search" type="submit"><Search size={16}/></button></form>
<Link href="/?wishlist=true#shop" aria-label={"Wishlist: "+favorites.length} className="relative"><Heart size={19}/>{favorites.length>0&&<span className="absolute -top-2 -right-2 bg-black text-white text-[9px] px-1 rounded-full">{favorites.length}</span>}</Link>
<button aria-label={"Open bag: "+count} onClick={()=>setCartOpen(true)} className="relative"><ShoppingBag size={19}/>{count>0&&<span className="absolute -top-2 -right-2 bg-black text-white text-[9px] px-1 rounded-full">{count}</span>}</button>
</div>{menu&&<nav className="flex gap-5 py-4 text-xs"><Link href="/#shop" onClick={()=>setMenu(false)}>SHOP ALL</Link><Link href="/?wishlist=true#shop" onClick={()=>setMenu(false)}>WISHLIST</Link></nav>}</div></header>}
