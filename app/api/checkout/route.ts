import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }
  const body = await request.text();
  const { items, freeGiftId, visitorName, colorNote } = JSON.parse(body) as {
    items: { id: string; name: string; price: number; emoji: string }[];
    freeGiftId: string;
    visitorName: string;
    colorNote?: string;
  };

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.id === freeGiftId ? `${item.name} 🎁 (Free Gift)` : item.name,
      },
      unit_amount: item.id === freeGiftId ? 0 : item.price * 100,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&name=${encodeURIComponent(visitorName)}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/wishlist`,
    metadata: {
      visitorName,
      colorNote: colorNote || "(none)",
    },
  });

  return NextResponse.json({ url: session.url });
}

export async function GET() {
  return NextResponse.json({ ok: true, stripe: !!process.env.STRIPE_SECRET_KEY });
}
