import Link from "next/link";
import {getTestStripe} from "@/lib/stripe-server";
export const dynamic = "force-dynamic";
export default async function CheckoutSuccess({searchParams}:{searchParams:Promise<{session_id?:string}>}) {
  const {session_id} = await searchParams;
  let paid = false;
  if (session_id && /^cs_test_[A-Za-z0-9_]+$/.test(session_id) && session_id.length < 300) {
    try {const session=await getTestStripe().checkout.sessions.retrieve(session_id);paid=!session.livemode && session.payment_status === "paid" && session.metadata?.store === "gekian";} catch {}
  }
  return <main className="container-site py-20 min-h-[60vh]"><h1 className="font-serif text-4xl mb-5">{paid?"Test payment confirmed":"Payment not confirmed"}</h1><p>{paid?"This was a sandbox payment. No real money was charged and no order will be shipped.":"We could not confirm a completed test payment. Your bag has been kept."}</p><Link href="/" className="underline block mt-8">Return to the store</Link></main>;
}
