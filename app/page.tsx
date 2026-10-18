"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getStagedProducts, displayPrice, type StoreProduct } from "@/lib/products";

export default function Home() {
 const [products,setProducts] = useState<StoreProduct[]>([]);
 const [loading,setLoading] = useState(true);
 const [error,setError] = useState("");
 const [search,setSearch] = useState("");
 const [category,setCategory] = useState("All");
 const [sort,setSort] = useState("featured");
 useEffect(()=>{ let active=true; getStagedProducts().then(items=>{if(active)setProducts(items);}).catch(e=>{if(active)setError(e instanceof Error ? e.message : "Could not load products");}).finally(()=>{if(active)setLoading(false);}); return ()=>{active=false}; },[]);
 const categories=useMemo(()=>["All",...new Set(products.map(p=>p.category))], [products]);
 const visible=useMemo(()=>{
 const filtered=products.filter(p=>(category==="All" || p.category===category) && (p.title+" "+p.description).toLowerCase().includes(search.toLowerCase().trim()));
 return sort==="price-asc" ? filtered.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity)) : sort==="price-desc" ? filtered.sort((a,b)=>(b.price??-1)-(a.price??-1)) : filtered;
 },[products,category,search,sort]);
 return <main>
  <div className="bg-[#28221e] text-white text-center py-2 text-xs tracking-[.2em]">GEKIAN · YOUR STYLE, YOUR STORY</div>
  <header className="max-w-7xl mx-auto px-5 md:px-10 py-7 flex justify-between items-center border-b border-stone-200">
   <Link href="/" className="font-serif tracking-[.22em] text-3xl">GEKIAN</Link>
   <span className="text-xs md:text-sm uppercase tracking-[.2em]">Women's Boutique</span>
  </header>
  <section className="text-center px-5 pt-16 pb-14 bg-[#f1eae1]">
   <div className="text-xs uppercase tracking-[.35em] mb-5">Curated with intention</div>
   <h1 className="font-serif text-5xl md:text-7xl mb-5">Find your signature look.</h1>
   <p className="text-stone-600 max-w-xl mx-auto">Discover the latest arrivals from our curated collection.</p>
   <a href="#shop" className="inline-block mt-8 px-9 py-3 bg-[#28221e] text-white text-xs uppercase tracking-[.2em]">Explore collection</a>
  </section>
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
    {visible.map(product=><Link href={"/products/"+encodeURIComponent(product.id)} key={product.id} className="group">
      <div className="aspect-[3/4] bg-[#e9e3dc] overflow-hidden flex items-center justify-center">
       {product.images[0] ? <img alt={product.title} src={product.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/> : <span className="text-stone-500 text-sm">Image coming soon</span>}
      </div>
      <p className="text-xs uppercase tracking-widest text-stone-500 mt-4">{product.category}</p>
      <h3 className="font-serif text-lg mt-1">{product.title}</h3>
      <p className="mt-1 text-sm">{displayPrice(product)}</p>
     </Link>)}
   </div>}
  </section>
  <footer className="border-t border-stone-200 text-center p-10 text-sm text-stone-500">© {new Date().getFullYear()} GEKIAN. All rights reserved.</footer>
 </main>;
}
