import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

async function getReferralTree(userId: string) {
  // Fetch the user by ID and populate their referrals
  const user = await User.findById(userId).populate('referrals');
  
  // Recursively build the tree for each referral
  const tree = {
    name: user.name,
    referrals: await Promise.all(
      user.referrals.map(async (referral: any) => {
        const referralTree = await getReferralTree(referral._id);
        return referralTree;
      })
    ),
  };

  return tree;
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();  // Await the cookies from the request headers
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const token = tokenCookie.value;

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as unknown;
      const decodedToken = decoded as { id: string };

      // Get the referral tree
      const referralTree = await getReferralTree(decodedToken.id);

      return NextResponse.json(referralTree);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching referral tree.' }, { status: 500 });
  }
}
