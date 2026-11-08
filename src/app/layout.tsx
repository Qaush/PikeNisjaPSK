import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import Year from "@/components/Year";
import { config } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: {
    default: `${config.brandName} – Teste psikologjike vetëvlerësuese`,
    template: `%s | ${config.brandName}`,
  },
  description:
    "Teste të shkurtra, të validuara shkencërisht, për ankthin dhe depresionin. Raporti ju vjen në email. Privatësi e plotë.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f766e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sq" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border bg-surface/80 backdrop-blur sticky top-0 z-10">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-block h-6 w-6 rounded-full bg-accent" aria-hidden />
              {config.brandName}
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/privatesia" className="hover:text-foreground">
                Privatësia
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto w-full max-w-2xl px-4 py-6 text-xs leading-relaxed text-muted">
            <p>
              Testet në këtë faqe janë vetëvlerësime orientuese dhe <strong>nuk janë diagnozë</strong>.
              Vetëm një profesionist i shëndetit mendor mund të bëjë vlerësim klinik. Nëse jeni në
              rrezik të menjëhershëm, telefononi urgjencën.
            </p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <Link href="/privatesia" className="hover:text-foreground">Politika e privatësisë</Link>
              <Link href="/kushtet" className="hover:text-foreground">Kushtet e përdorimit</Link>
              <span>© <Year /> {config.brandName}</span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
