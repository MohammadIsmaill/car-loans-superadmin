import Link from 'next/link';

export default function Header() {
  return (
    <Link href="/dashboard" className="text-2xl font-extrabold text-primary">
      CarTIBI
    </Link>
  );
}
