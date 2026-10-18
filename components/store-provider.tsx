'use client';
import {createContext,useContext,useEffect,useState,ReactNode} from 'react';
type Line={id:number;size:string;color:string;qty:number};
type Context={lines:Line[];add:(line:Line)=>void;remove:(index:number)=>void;setQty:(index:number,qty:number)=>void;favorites:number[];toggleFavorite:(id:number)=>void;cartOpen:boolean;setCartOpen:(v:boolean)=>void};
const StoreContext=createContext<Context|null>(null);
export function StoreProvider({children}:{children:ReactNode}){const [lines,setLines]=useState<Line[]>([]);const[favorites,setFavorites]=useState<number[]>([]);const[cartOpen,setCartOpen]=useState(false);const[hydrated,setHydrated]=useState(false);
useEffect(()=>{try{setLines(JSON.parse(localStorage.getItem('gekian-cart')||'[]'));setFavorites(JSON.parse(localStorage.getItem('gekian-wishlist')||'[]'))}catch{}setHydrated(true)},[]);
useEffect(()=>{if(hydrated)localStorage.setItem('gekian-cart',JSON.stringify(lines))},[lines,hydrated]);useEffect(()=>{if(hydrated)localStorage.setItem('gekian-wishlist',JSON.stringify(favorites))},[favorites,hydrated]);
const add=(line:Line)=>{setLines(current=>{const i=current.findIndex(x=>x.id===line.id&&x.size===line.size&&x.color===line.color);if(i<0)return [...current,line];return current.map((x,j)=>i===j?{...x,qty:x.qty+line.qty}:x)});setCartOpen(true)};
return <StoreContext.Provider value={{lines,add,remove:i=>setLines(x=>x.filter((_,j)=>j!==i)),setQty:(i,qty)=>setLines(x=>x.map((v,j)=>i===j?{...v,qty:Math.max(1,qty)}:v)),favorites,toggleFavorite:id=>setFavorites(x=>x.includes(id)?x.filter(v=>v!==id):[...x,id]),cartOpen,setCartOpen}}>{children}</StoreContext.Provider>}
export function useStore(){const ctx=useContext(StoreContext);if(!ctx)throw new Error('Missing StoreProvider');return ctx}
