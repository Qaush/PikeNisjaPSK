# PikëNisja – teste psikologjike vetëvlerësuese

Web-aplikacion (desktop + telefon) ku një person plotëson një test të shkurtër psikologjik
(GAD-7 për ankthin, PHQ-9 për depresionin), paguan 2 € dhe merr raportin në email. Nga raporti
mund t'i shkruajë drejtpërdrejt psikologut.

## Rrjedha

1. `/` – lista e testeve
2. `/test/[slug]` – pyetjet një nga një (vetëm në shfletues), pastaj emaili + pëlqimi
3. `POST /api/checkout` – ruan porosinë (email dhe përgjigje **të enkriptuara**) dhe krijon pagesën
4. Pagesa te ofruesi (në zhvillim: faqja e simuluar `/pay/mock/[orderId]`)
5. Pas pagesës: `completePayment()` → gjeneron token sekret, dërgon emailin, ridrejton te `/report/[token]`
6. `/report/[token]` – raporti i plotë + formulari "Kontakto psikologun" (`POST /api/contact`)

## Nisja lokale

```bash
npm install
cp .env.example .env.local   # plotësoni DATA_ENCRYPTION_KEY
npm run dev
```

Hapni http://localhost:3000. Me `PAYMENT_PROVIDER=mock` dhe `EMAIL_PROVIDER=mock`:

- pagesa simulohet me një klikim;
- emailet nuk dërgohen, por ruhen si HTML te `data/outbox/` që t'i shihni.

## Struktura

| Vendi | Çfarë ka |
|---|---|
| `src/lib/tests/` | Përkufizimet e testeve (pyetje, opsione, intervalet e ashpërsisë) dhe pikëzimi |
| `src/lib/store.ts` | Ruajtja (tani skedar JSON në `data/`; zëvendësohet me DB pa prekur pjesën tjetër) |
| `src/lib/crypto.ts` | Enkriptimi AES-256-GCM i emailit dhe përgjigjeve |
| `src/lib/payments/` | Ndërfaqja e ofruesit të pagesës + zbatimi `mock` |
| `src/lib/email/` | Ndërfaqja e ofruesit të emailit + zbatimi `mock` |
| `src/lib/orders.ts` | Logjika: nis pagesën, përmbyll pagesën, hap raportin |
| `src/lib/report.ts` | Emaili i raportit dhe emaili për psikologun |
| `src/lib/safety.ts` | Mesazhi i sigurisë dhe numrat e ndihmës (verifikoni para publikimit) |
| `src/app/` | Faqet dhe API-të |

## Para publikimit (TODO)

- [ ] Ofrues pagese real: Paddle ose Lemon Squeezy (pranojnë tregtarë nga Kosova, merren me TVSH-në e BE-së). Zbatohet te `src/lib/payments/` dhe `src/app/api/payments/webhook/route.ts`.
- [ ] Ofrues emaili real: Resend / Postmark, te `src/lib/email/`.
- [ ] Bazë të dhënash (Postgres ose SQLite) në vend të `data/db.json`.
- [ ] Rishikim i përkthimeve shqip të GAD-7 / PHQ-9 nga psikolog klinik.
- [ ] Verifikim i numrave të urgjencës te `src/lib/safety.ts`.
- [ ] Rishikim juridik i `/privatesia` dhe `/kushtet`.
- [ ] `DATA_ENCRYPTION_KEY` i fortë në mjedisin e prodhimit; `NEXT_PUBLIC_BASE_URL` me domenin real.
- [ ] Raport PDF i bashkangjitur në email (opsionale).

## Shënim mbi privatësinë

Nuk kërkohet emër apo llogari. Emaili dhe përgjigjet ruhen vetëm të enkriptuara dhe fshihen
automatikisht pas `REPORT_RETENTION_DAYS` ditësh. Të dhënat e kartës i trajton vetëm ofruesi i
pagesës. Adresa e psikologut nuk i shfaqet kurrë klientit; mesazhet kalojnë përmes serverit.
