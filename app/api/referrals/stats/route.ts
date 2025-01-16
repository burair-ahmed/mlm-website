import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Await the cookies API to get the cookies
    const cookieStore = await cookies();
    
    // Get the token from the cookieStore
    const tokenCookie = cookieStore.get('token');
    
    if (!tokenCookie) {
      console.error('Token is missing in the request.');
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    // Extract the token value from cookie
    const token = tokenCookie.value;

    // Verify the token
    let decoded;
    try {
      // First cast to 'unknown' and then to the expected type { id: string }
      decoded = jwt.verify(token, JWT_SECRET) as unknown;

      // Now cast to { id: string } after the verification
      const decodedToken = decoded as { id: string };

      // Find the user based on the decoded id
      const user = await User.findById(decodedToken.id).populate('referrals');
      if (!user) {
        console.error('User not found with id:', decodedToken.id);
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
      }
      console.log('Token extracted:', token);

      // Prepare the stats object
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
