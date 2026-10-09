import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id, 10);
    const body = await request.json();
    const { name, price, description } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, message: 'Name and price required' }, { status: 400 });
    }

    const item = await prisma.item.update({
      where: { id },
      data: { name, price: Number(price), description }
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
  }
}
