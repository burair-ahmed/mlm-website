import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Generate a JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Set token as a cookie
    const cookie = serialize('token', token, {
      httpOnly: true,  // Prevent client-side JS from accessing it
      secure: false,   // For local development, change this to true for production (when using HTTPS)
      maxAge: 60 * 60, // 1 hour expiry
      path: '/',       // Available across the entire app
    });

    // Create response with token
    const response = NextResponse.json({ message: 'Login successful!', token: token });
    response.headers.set('Set-Cookie', cookie); // Set the cookie in the response

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Login failed.' }, { status: 500 });
  }
}
