"use client";
import {useEffect,useMemo,useState} from "react";import Link from "next/link";import {useParams} from "next/navigation";import {Heart,Minus,Plus,Star} from "lucide-react";
import {getProduct,displayPrice,type StoreProduct} from "@/lib/products";import {useStore} from "@/components/store-provider";
type Variant={name?:string;original_color?:string;original_size?:string;color?:string;size?:string;stock?:number;inventory?:number};
export default function ProductPage(){
 const params=useParams();const id=typeof params.id==="string"?params.id:"";const{add,favorites,toggleFavorite}=useStore();
 const[p,setP]=useState<StoreProduct|null>(null);const[loading,setLoading]=useState(true);const[error,setError]=useState("");const[image,setImage]=useState(0);const[qty,setQty]=useState(1);const[variantIndex,setVariantIndex]=useState(-1);
 useEffect(()=>{let active=true;setLoading(true);getProduct(id).then(x=>{if(active){setP(x);setImage(0);setVariantIndex(-1)}}).catch(e=>{if(active)setError(e instanceof Error?e.message:"Unable to load product")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[id]);
 const variants=useMemo(()=>p?.variants.filter(v=>v&&typeof v==="object").map(v=>v as Variant)??[],[p]);
 const selected=variantIndex>=0?variants[variantIndex]:null;
 return <main className="container-site py-10 min-h-[65vh]">
 <nav className="text-xs text-stone-500 mb-8"><Link href="/#shop">SHOP</Link> / {p?.category??"PRODUCT"}</nav>
 {loading?<p role="status">Loading product…</p>:error?<p role="alert" className="text-red-700">{error}</p>:!p?<p>Product unavailable. <Link href="/#shop" className="underline">Shop collection</Link></p>:
 <div className="grid lg:grid-cols-2 gap-12">
 <div><div className="aspect-[4/5] bg-[#f1ede7]">{p.images[image]?<img src={p.images[image]} alt={p.title} className="w-full h-full object-cover"/>:<div className="flex items-center justify-center h-full text-stone-500">Image coming soon</div>}</div>{p.images.length>1&&<div className="flex gap-3 mt-4 flex-wrap">{p.images.map((url,i)=><button aria-label={"View image "+(i+1)} key={url+i} onClick={()=>setImage(i)} className={"w-16 h-20 border "+(image===i?"border-black":"border-transparent")}><img src={url} alt="" className="w-full h-full object-cover"/></button>)}</div>}</div>
 <div><p className="text-xs uppercase tracking-[.2em] text-stone-500">{p.category}</p><h1 className="editorial text-5xl mt-3">{p.title}</h1>
 {p.rating!==null&&p.reviewCount!==null&&<div className="flex gap-2 items-center text-sm mt-4"><Star size={16}/>{p.rating.toFixed(1)} ({p.reviewCount} ratings reported by supplier)</div>}
 <p className="text-2xl mt-7">{displayPrice(p)}</p><p className="mt-7 text-sm text-stone-600 leading-7 whitespace-pre-line">{p.description}</p>
 {variants.length>0&&<div className="mt-8"><label htmlFor="variant" className="block text-sm mb-2">Available options</label><select id="variant" className="w-full border border-stone-300 bg-white p-3" value={variantIndex} onChange={e=>setVariantIndex(Number(e.target.value))}><option value={-1}>Select an option</option>{variants.map((v,i)=><option key={i} value={i}>{[v.name||v.original_color||v.color,v.original_size||v.size,v.stock!==undefined&&v.stock<=0?"Out of stock":""].filter(Boolean).join(" / ")||"Option "+(i+1)}</option>)}</select></div>}
 <div className="mt-8 flex gap-3 items-center"><div className="flex border border-stone-300 items-center"><button className="p-3" aria-label="Decrease quantity" onClick={()=>setQty(x=>Math.max(1,x-1))}><Minus size={15}/></button><span>{qty}</span><button className="p-3" aria-label="Increase quantity" onClick={()=>setQty(x=>Math.min(10,x+1))}><Plus size={15}/></button></div>
 <button disabled={p.price===null||(variants.length>0&&!selected)||(selected?.stock!==undefined&&selected.stock<=0)} onClick={()=>add({id:p.id,color:selected?.original_color||selected?.color||"",size:selected?.original_size||selected?.size||selected?.name||"",qty})} className="btn-dark flex-1 text-xs tracking-widest">ADD TO BAG</button><button aria-label="Toggle wishlist" className="border border-stone-300 p-3" onClick={()=>toggleFavorite(p.id)}><Heart fill={favorites.includes(p.id)?"#a57067":"none"}/></button></div>
 <p className="text-xs text-stone-500 mt-4">Checkout is not yet available. Stock and shipping must be reconfirmed before accepting an order.</p>
 </div></div>}
 </main>
}
