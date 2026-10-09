import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({ success: false, message: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: '존재하지 않는 아이디입니다.' }, { status: 401 });
    }

    if (user.password === password) {
      return NextResponse.json({ success: true, message: '로그인 성공!' });
    } else {
      return NextResponse.json({ success: false, message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
