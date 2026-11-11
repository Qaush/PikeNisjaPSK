"use client";

import { usePathname } from "next/navigation";

/**
 * Njoftimi "nuk janë diagnozë" në fund të faqes. Te faqja fillestare nuk shfaqet, sepse aty
 * i njëjti informacion është te blloku "Rreth faqes" (kërkesa aLGwbDE8 e psikologes, 11.11.2026).
 */
export default function FooterDisclaimer() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <p className="mb-3">
      Testet në këtë faqe janë vetëvlerësime orientuese dhe <strong>nuk janë diagnozë</strong>.
      Vetëm një profesionist i shëndetit mendor mund të bëjë vlerësim klinik. Nëse jeni në rrezik
      të menjëhershëm, telefononi urgjencën.
    </p>
  );
}
