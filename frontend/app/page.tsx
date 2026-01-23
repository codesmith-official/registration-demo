import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1>Next.js Auth Playground</h1>
      <p>Authentication learning project</p>
      <div className='mt-3'>
        <Link href={'/sign-up'}>Signup</Link>
        <span className='mx-4'>|</span>
        <Link href={'/login'}>Login</Link>
      </div>
    </>
  );
}
