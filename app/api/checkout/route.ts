import {NextResponse} from "next/server";
import {getAdminDb} from "@/lib/firebase-admin";
import {getTestStripe} from "@/lib/stripe-server";
import {approvedItem, CheckoutError, parseCart} from "@/lib/checkout-validation";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = process.env.CHECKOUT_ORIGIN || "https://gekian.com";
  if (request.headers.get("origin") !== origin) return NextResponse.json({error:"Open the store directly to check out."},{status:403});
  if (Number(request.headers.get("content-length") || 0) > 16000) return NextResponse.json({error:"Bag is too large."},{status:413});
  try {
    const text = await request.text();
    if (text.length > 16000) throw new CheckoutError("Bag is too large.");
    let body; try {body=JSON.parse(text);} catch {throw new CheckoutError("Invalid bag.");}
    const lines = parseCart(body.lines);
    const stripe = getTestStripe();
    const db = getAdminDb();
    const docs = await db.getAll(...lines.map(v => db.collection("products").doc(v.id)));
    // Check aggregate product stock as well as each configured variant.
    const quantities = new Map<string,number>();
    const line_items = lines.map((line,i) => {
      if (!docs[i].exists) throw new CheckoutError("An item is no longer available.");
      const data = docs[i].data()!;
      const item = approvedItem(data,line);
      const total = (quantities.get(line.id) || 0) + line.qty;
      quantities.set(line.id,total);
      if (Number.isSafeInteger(data.checkout.stock) && total > data.checkout.stock) throw new CheckoutError("An item has insufficient confirmed stock.");
      return {quantity:line.qty, price_data:{currency:"usd",unit_amount:item.unitAmount,product_data:{name:item.name,metadata:{product_id:line.id}}}};
    });
    const session = await stripe.checkout.sessions.create({mode:"payment",allowed_payment_method_types:["card"],line_items,shipping_address_collection:{allowed_countries:["US"]},success_url:origin+"/checkout/success?session_id={CHECKOUT_SESSION_ID}",cancel_url:origin+"/?checkout=cancelled",metadata:{store:"gekian",environment:"test"},expires_at:Math.floor(Date.now()/1000)+1800});
    if (session.livemode || !session.url?.startsWith("https://checkout.stripe.com/")) throw new Error("Unexpected checkout response");
    return NextResponse.json({url:session.url},{headers:{"Cache-Control":"no-store"}});
  } catch (error) {
    if (error instanceof CheckoutError) return NextResponse.json({error:error.message},{status:400});
    // Never log a provider error object: it can include request or credential data.
    console.error("Test checkout failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json({error:"Test checkout is not configured yet. Please try again later."},{status:503});
  }
}
