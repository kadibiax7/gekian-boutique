"use client";
import {createContext,useContext,useEffect,useState,type ReactNode} from "react";
type Line={id:string;size:string;color:string;qty:number};
type Store={lines:Line[];add:(line:Line)=>void;remove:(index:number)=>void;setQty:(index:number,qty:number)=>void;favorites:string[];toggleFavorite:(id:string)=>void;cartOpen:boolean;setCartOpen:(open:boolean)=>void};
const Context=createContext<Store|null>(null);
export function StoreProvider({children}:{children:ReactNode}){const[lines,setLines]=useState<Line[]>([]);const[favorites,setFavorites]=useState<string[]>([]);const[cartOpen,setCartOpen]=useState(false);const[ready,setReady]=useState(false);
useEffect(()=>{try{const c=JSON.parse(localStorage.getItem("gekian-cart")||"[]");const f=JSON.parse(localStorage.getItem("gekian-wishlist")||"[]");if(Array.isArray(c))setLines(c.filter(v=>typeof v.id==="string"&&Number.isFinite(v.qty)));if(Array.isArray(f))setFavorites(f.filter(v=>typeof v==="string"));}catch{}setReady(true)},[]);
useEffect(()=>{if(ready)localStorage.setItem("gekian-cart",JSON.stringify(lines));},[lines,ready]);useEffect(()=>{if(ready)localStorage.setItem("gekian-wishlist",JSON.stringify(favorites));},[favorites,ready]);
const add=(line:Line)=>{setLines(a=>{const i=a.findIndex(v=>v.id===line.id&&v.size===line.size&&v.color===line.color);return i<0?[...a,line]:a.map((v,j)=>j===i?{...v,qty:v.qty+line.qty}:v)});setCartOpen(true)};
return <Context.Provider value={{lines,add,remove:i=>setLines(a=>a.filter((_,j)=>j!==i)),setQty:(i,qty)=>setLines(a=>a.map((v,j)=>i===j?{...v,qty:Math.max(1,qty)}:v)),favorites,toggleFavorite:id=>setFavorites(a=>a.includes(id)?a.filter(v=>v!==id):[...a,id]),cartOpen,setCartOpen}}>{children}</Context.Provider>;}
export function useStore(){const x=useContext(Context);if(!x)throw new Error("Missing StoreProvider");return x;}
