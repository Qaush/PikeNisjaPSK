import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Faqja nuk u gjet</h1>
      <p className="text-muted">Linku që ndoqët nuk ekziston ose është zhvendosur.</p>
      <Link href="/" className="font-semibold text-accent underline">
        Kthehu te testet
      </Link>
    </div>
  );
}
