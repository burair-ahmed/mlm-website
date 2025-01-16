import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Await the cookies from the request headers
    const cookieStore = await cookies();  // Ensure this is awaited
    const tokenCookie = cookieStore.get('token');
    console.log('Token Cookie:', tokenCookie);  // Log cookie value

    if (!tokenCookie) {
      console.error('Token is missing in the request.');
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const token = tokenCookie.value;
    console.log('Extracted Token:', token);  // Log extracted token

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as unknown;
      const decodedToken = decoded as { id: string };

      const user = await User.findById(decodedToken.id).populate('referrals');
      if (!user) {
        console.error('User not found with id:', decodedToken.id);
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
      }

      console.log('User found:', user);  // Log user data

      const stats = {
        referralCode: user.referralCode,
        referralsCount: user.referrals.length,
        referredUsers: user.referrals.map((ref: any) => ({
          name: ref.name,
          email: ref.email,
          joined: ref.createdAt,
        })),
      };

      return NextResponse.json(stats);
    } catch (err) {
      console.error('Token verification failed:', err);
      return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json({ message: 'Failed to fetch referral stats.' }, { status: 500 });
  }
}
