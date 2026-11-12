# PikëNisja – teste psikologjike vetëvlerësuese

Web-aplikacion (desktop + telefon) ku një person plotëson një test të shkurtër psikologjik
(GAD-7, PHQ-9, DASS-21, Brief Resilience Scale), paguan 2 € dhe merr raportin në email. Nga raporti
mund të kërkojë me një klikim një seancë me psikologun.

## Rrjedha

1. `/` – lista e testeve
2. `/test/[slug]` – pyetjet një nga një (vetëm në shfletues), pastaj emaili + pëlqimi
3. `POST /api/checkout` – ruan porosinë në pritje (email dhe përgjigje **të enkriptuara**) dhe krijon pagesën
4. Pagesa te ofruesi (në zhvillim: faqja e simuluar `/pay/mock/[orderId]`)
5. Pas pagesës: `completePayment()` → ndërton linkun e raportit, **fshin porosinë**, dërgon emailin, ridrejton te `/report/[token]`
6. `/report/[token]` – raporti i plotë + butoni "Kërko një seancë" (`POST /api/session-request`). Token-i është vetë raporti i enkriptuar (testi, përgjigjet, emaili, data); serveri nuk ruan asgjë

## Nisja lokale

```bash
npm install
cp .env.example .env.local   # plotësoni DATA_ENCRYPTION_KEY
npm run dev
```

Hapni http://localhost:3000. Me `PAYMENT_PROVIDER=mock` dhe `EMAIL_PROVIDER=mock`:

- pagesa simulohet me një klikim;
- emailet nuk dërgohen, por ruhen si HTML te `data/outbox/` që t'i shihni.

### Dërgim real i emaileve (SMTP)

Në `.env.local` vendosni `EMAIL_PROVIDER=smtp` dhe të dhënat e serverit SMTP. Shembull me Gmail:

```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=adresa.juaj@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx    # "App password", jo fjalëkalimi i zakonshëm
FROM_EMAIL="PikëNisja <adresa.juaj@gmail.com>"
PSYCHOLOGIST_EMAIL=psikologu@...
```

App password-in e krijoni te Google Account → Security → 2-Step Verification → App passwords.
Rinisni `npm run dev` pas çdo ndryshimi në `.env.local`.

## Publikimi në Vercel (për testim)

1. vercel.com → "Continue with GitHub" → **Add New → Project** → importoni `Qaush/PikeNisjaPSK`.
   Te "Git branch" / Production Branch vendosni `feat/mvp` (ose bashkoni më parë në `main`).
2. Në projekt: **Storage → Create Database → Upstash Redis** (plani falas). Vercel-i i vendos vetë
   variablat `KV_REST_API_URL` / `KV_REST_API_TOKEN` (ose `UPSTASH_REDIS_REST_URL` / `_TOKEN`);
   të dyja emërtimet njihen.
3. **Settings → Environment Variables**, shtoni:

   | Variabla | Vlera |
   |---|---|
   | `DATA_ENCRYPTION_KEY` | një string i gjatë i rastësishëm (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `NEXT_PUBLIC_BASE_URL` | `https://<emri-i-projektit>.vercel.app` (pa `/` në fund) |
   | `PSYCHOLOGIST_EMAIL` | emaili i psikologut |
   | `PAYMENT_PROVIDER` | `mock` (pagesë e simuluar, për testim) |
   | `EMAIL_PROVIDER` | `smtp` për emaile reale (plus `SMTP_*` dhe `FROM_EMAIL` si më lart), ose `mock` |

4. **Deploy**. Çdo push në degën e zgjedhur ripublikon automatikisht.

Me `EMAIL_PROVIDER=mock` në Vercel emailet nuk ruhen askund (disku është vetëm për lexim); shihen
vetëm te Logs. Për testim real nga psikologu vendosni SMTP.

## Struktura

| Vendi | Çfarë ka |
|---|---|
| `src/lib/tests/` | Përkufizimet e testeve (pyetje, opsione, intervalet e ashpërsisë) dhe pikëzimi |
| `src/lib/store/` | Ruajtja: skedar JSON në `data/` (lokalisht) ose Upstash Redis (Vercel), pas një ndërfaqeje të përbashkët |
| `src/lib/crypto.ts` | Enkriptimi AES-256-GCM i emailit dhe përgjigjeve |
| `src/lib/payments/` | Ndërfaqja e ofruesit të pagesës + zbatimi `mock` |
| `src/lib/email/` | Ndërfaqja e ofruesit të emailit + zbatimi `mock` |
| `src/lib/orders.ts` | Logjika: nis pagesën, përmbyll pagesën, hap raportin |
| `src/lib/report.ts` | Emaili i raportit dhe emaili për psikologun |
| `src/lib/safety.ts` | Mesazhi i sigurisë dhe numrat e ndihmës (verifikoni para publikimit) |
| `src/app/` | Faqet dhe API-të |

## Para publikimit (TODO)

- [ ] Ofrues pagese real: Paddle ose Lemon Squeezy (pranojnë tregtarë nga Kosova, merren me TVSH-në e BE-së). Zbatohet te `src/lib/payments/` dhe `src/app/api/payments/webhook/route.ts`.
- [ ] Email nga domeni juaj (SMTP i hostingut, ose Resend/Postmark) në vend të Gmail-it, që emailet të mos bien në spam.
- [ ] Rishikim i përkthimeve shqip të GAD-7 / PHQ-9 / DASS-21 / BRS nga psikolog klinik.
- [ ] BRS (Brief Resilience Scale): leja për përdorim me pagesë s'është konfirmuar (burimet e gjetura flasin për kërkim dhe edukim me citim) – të pyetet autori para se testi të shitet.
- [ ] DASS-21: autorët (FAQ 9 dhe 21 te dass.psy.unsw.edu.au) thonë që DASS nuk duhet administruar në faqe të hapura për publikun dhe pikët nuk duhet t'i shfaqen plotësuesit. Testi është shtuar me vendim të psikologes, pasi u njoftua; pohimet janë përkthimi zyrtar shqip (Basha & Kaya), i pandryshuar.
- [ ] PSQI nuk është shtuar: e drejta e autorit është e Universitetit të Pittsburgh-ut dhe përdorimi komercial kërkon licencë.
- [ ] BDI (Beck Depression Inventory) nuk është shtuar: e drejta e autorit është e Pearson-it dhe riprodhimi, përkthimi e përdorimi komercial kërkojnë licencë. Alternativë në domenin publik: CES-D.
- [ ] Verifikim i numrave të urgjencës te `src/lib/safety.ts`.
- [ ] Rishikim juridik i `/privatesia` dhe `/kushtet`.
- [ ] `DATA_ENCRYPTION_KEY` i fortë në mjedisin e prodhimit; `NEXT_PUBLIC_BASE_URL` me domenin real.
- [ ] Raport PDF i bashkangjitur në email (opsionale).

## Shënim mbi privatësinë

Nuk kërkohet emër apo llogari. Pas dërgimit të raportit serveri nuk ruan asnjë të dhënë: porosia
fshihet sapo kryhet pagesa (e papaguara pas `PENDING_ORDER_HOURS` orësh), dhe raporti jeton vetëm te
linku i enkriptuar, që vlen `REPORT_RETENTION_DAYS` ditë. Pasojë: nëse ndërrohet
`DATA_ENCRYPTION_KEY`, linqet e dërguara më parë nuk hapen më. Me `EMAIL_PROVIDER=mock` emailet
shkruhen te `data/outbox/` (vetëm për zhvillim). Të dhënat e kartës i trajton vetëm ofruesi i
pagesës. Adresa e psikologut nuk i shfaqet kurrë klientit; kërkesa për seancë kalon përmes serverit.
