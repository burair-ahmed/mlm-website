import AuthForm from './(shared)/AuthForm';
import Link from 'next/link';


export default function Home() {
  return (
  <div>
      <h1>Welcome to the Referral Platform</h1>
      <nav>
        <Link href="/dashboard">Go to Dashboard</Link>
      </nav>
      <AuthForm type="register" />
      <AuthForm type="login" />
  </div>
  );
}
