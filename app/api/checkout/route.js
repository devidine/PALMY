import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { cart } = await request.json();
    
    if (!cart || cart.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    
    // TODO: Integrate Toss Payments Server-side verification here
    // https://docs.tosspayments.com/reference
    console.log(`[Checkout] Prepared order for Toss Payments. Total Amount: ${total}원`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Checkout prepared',
      orderId: 'ORDER_' + Date.now(),
      amount: total
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Checkout failed' }, { status: 500 });
  }
}
