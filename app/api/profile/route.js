import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ success: false, message: 'Username is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        nickname: true,
        address: true,
        birthday: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { username, nickname, address, birthday } = body;

    if (!username) {
      return NextResponse.json({ success: false, message: 'Username is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: { nickname, address, birthday }
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
