import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, description } = body;
    
    if (!name || !price) {
      return NextResponse.json({ success: false, message: 'Name and price required' }, { status: 400 });
    }
    
    const item = await prisma.item.create({
      data: { name, price: Number(price), description }
    });
    
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
  }
}
