"use client";
import { useEffect, useMemo, useState } from "react";
import {ProductCard} from "@/components/product-card";
import {useStore} from "@/components/store-provider";
import {useSearchParams} from "next/navigation";
import {Suspense} from "react";
import { getStagedProducts, displayPrice, type StoreProduct } from "@/lib/products";

function HomeContent() {
 const [products,setProducts] = useState<StoreProduct[]>([]);
 const {favorites}=useStore();
 const searchParams=useSearchParams();
 const [loading,setLoading] = useState(true);
 const [error,setError] = useState("");
 const [search,setSearch] = useState("");
 useEffect(()=>{setSearch(searchParams.get("q")??"");},[searchParams]);
 const [category,setCategory] = useState("All");
 const [sort,setSort] = useState("featured");
 useEffect(()=>{ let active=true; getStagedProducts().then(items=>{if(active)setProducts(items);}).catch(e=>{if(active)setError(e instanceof Error ? e.message : "Could not load products");}).finally(()=>{if(active)setLoading(false);}); return ()=>{active=false}; },[]);
 const categories=useMemo(()=>["All",...new Set(products.map(p=>p.category))], [products]);
 const visible=useMemo(()=>{
 const filtered=products.filter(p=>(category==="All" || p.category===category) && (p.title+" "+p.description).toLowerCase().includes(search.toLowerCase().trim()) && (searchParams.get("wishlist")!=="true" || favorites.includes(p.id)));
 return sort==="price-asc" ? filtered.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity)) : sort==="price-desc" ? filtered.sort((a,b)=>(b.price??-1)-(a.price??-1)) : filtered;
 },[products,category,search,sort,favorites,searchParams]);
 return <main>
  <section className="relative min-h-[520px] lg:min-h-[610px] flex items-center bg-[#e8ded3]"><img alt="GEKIAN fashion editorial" src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=90" className="absolute inset-0 w-full h-full object-cover"/><div className="absolute inset-0 bg-gradient-to-r from-[#26201b]/70 via-[#26201b]/20 to-transparent"/><div className="container-site relative py-24 text-white"><p className="text-xs tracking-[.3em] mb-6">THE NEW SEASON / 2026</p><h1 className="editorial text-[clamp(57px,7.5vw,112px)] leading-[.99] max-w-[660px]">Style that<br/><i>stays with you.</i></h1><p className="mt-7 max-w-sm text-sm leading-7">Quiet confidence. Beautiful essentials. Pieces you’ll reach for again and again.</p><a href="#shop" className="inline-block mt-9 bg-white text-[#24201f] px-8 py-4 text-xs tracking-widest">EXPLORE THE COLLECTION</a></div></section>
  <div className="bg-[#f8f5f0] py-4 text-center text-xs tracking-[.2em]">CURATED WITH INTENTION · EVERYDAY ELEGANCE · MADE FOR YOUR MOMENTS</div>
  <section id="shop" className="max-w-7xl mx-auto px-5 md:px-10 py-14">
   <div className="flex flex-wrap justify-between items-end gap-5 mb-8">
    <div><p className="text-xs uppercase tracking-[.3em] text-stone-500 mb-3">The collection</p><h2 className="font-serif text-4xl">Shop GEKIAN</h2></div>
    <span className="text-stone-500 text-sm">{loading ? "Loading…" : visible.length+" products"}</span>
   </div>
   <div className="grid md:grid-cols-3 gap-3 mb-8">
    <input aria-label="Search products" className="border border-stone-300 px-4 py-3 bg-white" placeholder="Search pieces…" value={search} onChange={e=>setSearch(e.target.value)}/>
    <select aria-label="Filter by category" className="border border-stone-300 px-4 py-3 bg-white" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>
    <select aria-label="Sort products" className="border border-stone-300 px-4 py-3 bg-white" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>
   </div>
   {loading && <p role="status" className="text-center py-20">Loading collection from our catalog…</p>}
   {!loading && error && <div role="alert" className="border border-rose-200 bg-rose-50 p-6">Could not load the collection. Check the Firebase configuration and Firestore read rules. <span className="block mt-2 text-sm">{error}</span></div>}
   {!loading && !error && !visible.length && <p className="text-center text-stone-500 py-20">No products available for this selection yet.</p>}
   {!loading && !error && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
    {visible.map(product=><ProductCard key={product.id} product={product}/>)}
   </div>}
  </section>

 </main>;
}

export default function Home(){return <Suspense fallback={<div className="p-12 text-center">Loading collection…</div>}><HomeContent/></Suspense>}
