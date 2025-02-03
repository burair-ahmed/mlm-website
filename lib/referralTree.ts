// lib/referralTree.ts
import User from '../models/User';

export async function getReferralTree(userId: string) {
  const user = await User.findById(userId).populate('referrals');

  if (!user) throw new Error('User not found.');

  const tree = {
    id: user._id,
    name: user.name,
    email: user.email,
    referralCode: user.referralCode,
    joined: user.createdAt,
    referrals: await Promise.all(
      user.referrals.map(async (referral: any) => {
        return await getReferralTree(referral._id);
      })
    ),
  };

  return tree;
}
