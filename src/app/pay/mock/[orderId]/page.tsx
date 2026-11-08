import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { config, formatPrice } from "@/lib/config";
import { getOrder } from "@/lib/store";
import { getTest } from "@/lib/tests";

export const metadata = { title: "Pagesa (simulim)" };

/**
 * Faqe pagese e SIMULUAR, vetëm për zhvillim. Imiton ekranin e një ofruesi pagese.
 * Në prodhim klienti ridrejtohet te faqja reale e Paddle/Stripe/bankës.
 */
async function MockCheckout({ params }: { params: PageProps<"/pay/mock/[orderId]">["params"] }) {
  if (config.paymentProvider !== "mock") notFound();
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) notFound();
  const test = getTest(order.testSlug);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="rounded-xl border border-dashed border-amber-400 bg-amber-50 p-3 text-xs text-amber-900">
        <strong>Modalitet testimi.</strong> Kjo faqe simulon ofruesin e pagesës. Asnjë pagesë
        reale nuk kryhet.
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">Përmbledhja e porosisë</p>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Produkti</dt>
            <dd className="text-right font-medium">
              {config.brandName} – {test?.title ?? order.testSlug}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Porosia</dt>
            <dd className="font-mono text-xs">{order.id}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-border pt-3 text-base">
            <dt className="font-semibold">Totali</dt>
            <dd className="font-semibold">{formatPrice(order.amountCents)}</dd>
          </div>
        </dl>

        {order.status === "paid" ? (
          <p className="mt-6 rounded-xl bg-accent-soft p-3 text-sm">
            Kjo porosi është paguar tashmë.{" "}
            <Link href={`/report/${order.reportToken}`} className="font-semibold text-accent underline">
              Hap raportin
            </Link>
          </p>
        ) : (
          <form action="/api/payments/mock/confirm" method="post" className="mt-6 flex flex-col gap-3">
            <input type="hidden" name="orderId" value={order.id} />
            <div className="grid gap-2">
              <label className="text-xs text-muted">Numri i kartës (simulim)</label>
              <input
                disabled
                value="4242 4242 4242 4242"
                className="rounded-xl border border-border bg-background px-3 py-2.5 font-mono text-sm text-muted"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-5 py-3.5 text-base font-semibold text-white transition hover:bg-accent-strong"
            >
              Paguaj {formatPrice(order.amountCents)}
            </button>
            <Link
              href={`/test/${order.testSlug}`}
              className="text-center text-sm text-muted hover:text-foreground"
            >
              Anulo dhe kthehu
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

export default function MockPayPage(props: PageProps<"/pay/mock/[orderId]">) {
  return (
    <Suspense fallback={<p className="text-center text-muted">Po ngarkohet pagesa…</p>}>
      <MockCheckout params={props.params} />
    </Suspense>
  );
}
