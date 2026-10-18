import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "GEKIAN | Women's Fashion", description: "Shop the GEKIAN women's fashion collection." };
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="en"><body>{children}</body></html>;
}
