import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ success: false, message: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { username }
    });

    if (existing) {
      return NextResponse.json({ success: false, message: '이미 존재하는 아이디입니다.' }, { status: 400 });
    }

    await prisma.user.create({
      data: { username, password }
    });
    
    return NextResponse.json({ success: true, message: '회원가입 성공!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
