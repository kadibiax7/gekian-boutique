"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProduct, displayPrice, type StoreProduct } from "@/lib/products";
export default function ProductDetail() {
 const params=useParams();
 const id=typeof params.id==="string" ? params.id : "";
 const [product,setProduct]=useState<StoreProduct|null>(null);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState("");
 const [image,setImage]=useState(0);
 useEffect(()=>{let active=true; getProduct(id).then(p=>{if(active)setProduct(p);}).catch(e=>{if(active)setError(e instanceof Error?e.message:"Unable to load product");}).finally(()=>{if(active)setLoading(false);}); return ()=>{active=false};},[id]);
 return <main className="min-h-screen">
  <header className="max-w-7xl mx-auto py-7 px-5 border-b border-stone-200 flex justify-between items-center"><Link href="/" className="font-serif text-3xl tracking-[.22em]">GEKIAN</Link><Link href="/" className="text-sm underline">Back to collection</Link></header>
  <section className="max-w-6xl mx-auto px-5 py-12">
   {loading ? <p role="status">Loading product…</p> : error ? <p role="alert">Product unavailable: {error}</p> : !product ? <p>Product not available. <Link className="underline" href="/">Return to the collection</Link>.</p> :
   <div className="grid md:grid-cols-2 gap-12">
    <div><div className="bg-[#e9e3dc] aspect-[3/4] flex items-center justify-center overflow-hidden">{product.images[image] ? <img className="w-full h-full object-cover" alt={product.title} src={product.images[image]}/> : <span className="text-stone-500">Image coming soon</span>}</div>
    {product.images.length>1 && <div className="flex gap-2 mt-3 flex-wrap">{product.images.map((url,i)=><button key={url} aria-label={"View image "+(i+1)} onClick={()=>setImage(i)} className={"w-16 h-20 border-2 "+(i===image?"border-stone-900":"border-transparent")}><img alt="" src={url} className="w-full h-full object-cover"/></button>)}</div>}</div>
    <div><p className="uppercase tracking-[.25em] text-stone-500 text-xs mb-3">{product.category}</p><h1 className="font-serif text-4xl md:text-5xl mb-5">{product.title}</h1>
    <p className="text-2xl mb-8">{displayPrice(product)}</p>
    {product.description && <p className="leading-7 text-stone-700 whitespace-pre-line">{product.description}</p>}
    <div className="border-t border-stone-200 mt-8 pt-7"><p className="text-sm text-stone-600">Checkout is not available yet. Product information is sourced from our live catalog.</p></div>
    </div>
   </div>}
  </section>
 </main>;
}
