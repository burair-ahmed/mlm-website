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
    if (!tokenCookie) {
      return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
    }

    const token = tokenCookie.value;

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Return user details
    const userData = {
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
    };

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch user details.' }, { status: 500 });
  }
}
