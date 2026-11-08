import Link from "next/link";
import { Suspense } from "react";
import { completePayment } from "@/lib/orders";
import { config } from "@/lib/config";

export const metadata = { title: "Pagesa u krye" };

/**
 * Faqja ku kthehet klienti pas pagesës te një ofrues real.
 * Në modalitetin "mock" nuk përdoret (ridrejtimi shkon drejt te raporti).
 *
 * Me ofrues real: webhook-u e konfirmon pagesën; kjo faqe vetëm e pret.
 * Për thjeshtësi tani, nëse porosia ekziston, e përmbyllim këtu (vetëm në mock).
 */
async function Success({ searchParams }: { searchParams: PageProps<"/pay/success">["searchParams"] }) {
  const sp = await searchParams;
  const orderId = typeof sp.order === "string" ? sp.order : undefined;
  if (orderId && config.paymentProvider === "mock") {
    const res = await completePayment(orderId);
    if ("reportToken" in res) {
      return (
        <p>
          Pagesa u krye.{" "}
          <Link href={`/report/${res.reportToken}`} className="font-semibold text-accent underline">
            Hap raportin
          </Link>
        </p>
      );
    }
  }
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Faleminderit!</h1>
      <p className="leading-relaxed text-muted">
        Sapo të konfirmohet pagesa, raporti ju vjen në email me linkun për ta hapur. Zakonisht
        zgjat më pak se një minutë.
      </p>
      <Link href="/" className="font-semibold text-accent underline">
        Kthehu në faqen kryesore
      </Link>
    </div>
  );
}

export default function SuccessPage(props: PageProps<"/pay/success">) {
  return (
    <Suspense fallback={<p className="text-muted">Po kontrollojmë pagesën…</p>}>
      <Success searchParams={props.searchParams} />
    </Suspense>
  );
}
