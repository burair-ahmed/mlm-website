// app/api/referrals/tree/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import { getReferralTree } from '../../../../lib/referralTree';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const referralTree = await getReferralTree(userId);

    return NextResponse.json(referralTree);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch referral tree.' }, { status: 500 });
  }
}
