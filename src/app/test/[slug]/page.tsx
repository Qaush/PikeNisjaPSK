import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TestRunner from "@/components/TestRunner";
import { config, formatPrice } from "@/lib/config";
import { TESTS, getTest } from "@/lib/tests";

export function generateStaticParams() {
  return TESTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps<"/test/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const test = getTest(slug);
  return test
    ? { title: test.title, description: test.tagline }
    : { title: "Testi nuk u gjet" };
}

async function TestLoader({ params }: { params: PageProps<"/test/[slug]">["params"] }) {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) notFound();
  return <TestRunner test={test} priceLabel={formatPrice()} brandName={config.brandName} />;
}

export default function TestPage(props: PageProps<"/test/[slug]">) {
  return (
    <Suspense fallback={<p className="text-center text-muted">Po ngarkohet testi…</p>}>
      <TestLoader params={props.params} />
    </Suspense>
  );
}
