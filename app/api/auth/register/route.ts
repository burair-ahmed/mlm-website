import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(req: Request) {
    try {
      await dbConnect();
      const { name, email, password, referralCode } = await req.json();
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: 'Email already in use.' }, { status: 400 });
      }
  
      // Generate unique referral code
      const generateReferralCode = () => {
        return Math.random().toString(36).substr(2, 8).toUpperCase();
      };
  
      let newReferralCode;
      do {
        newReferralCode = generateReferralCode();
      } while (await User.findOne({ referralCode: newReferralCode }));
  
      // Handle referrer
      let referrer = null;
      if (referralCode) {
        referrer = await User.findOne({ referralCode });
        if (!referrer) {
          return NextResponse.json({ message: 'Invalid referral code.' }, { status: 400 });
        }
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        referralCode: newReferralCode,
        referrer: referrer ? referrer._id : null,
      });
      await user.save();
  
      // Add this user to the referrer's referrals list
      if (referrer) {
        referrer.referrals.push(user._id);
        await referrer.save();
      }
  
      return NextResponse.json({ message: 'User registered successfully!', referralCode: newReferralCode });
    } catch (error) {
      console.error('Registration error:', error);
      return NextResponse.json({ message: 'Registration failed.' }, { status: 500 });
    }
  }
  