# Vrinda Resort calculator

Frontend-only React + Vite project, ready for Vercel. No backend, login, database, or environment variables required.

## Run locally

Requires Node.js 22.12+ (or 20.19+).

```powershell
cd D:\Vrinda-Resort-Calculator
npm.cmd install
npm.cmd run dev
```

Open the local URL printed in the terminal. Use `npm.cmd` on Windows if PowerShell blocks `npm.ps1`.

## Check and build

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

## Deploy to Vercel

Push this folder to your Git repository and import that repository in Vercel. Use the **Vite** framework preset, build command **npm run build**, and output directory **dist**. These are also defined in `vercel.json`. No environment variables are needed.

Alternatively, from this project folder run `npx.cmd vercel` and follow Vercel's account prompts. Run `npx.cmd vercel --prod` when ready for production.

Documentation: https://vercel.com/docs/frameworks/frontend/vite

## Pricing and behavior

- All services optional. Basic venue and hall/AC are independent selections.
- Basic day/night rate: ₹70,000.
- Hall 1 marriage: ₹22,000 / 6 included hours; extra ₹3,500/hr. Other event: ₹15,000 / 3 included hours; extra ₹3,500/hr. Hall 2 birthday: ₹8,000 / 3 included hours; extra ₹1,000/hr.
- Waiter fees use the **Charges** column (₹33,250, ₹38,000, ₹42,750, ₹52,250, ₹57,000). Staff counts and A/B/housekeeping values are displayed exactly as listed; they are not recomputed.
- Decoration: day ₹20,000; night ₹30,000.
- Generator ₹3,000/hr. Fractional hours are proportional; no rounding-up rule was supplied.
- DJ without screen ₹13,000 includes DG, so separate DG is suppressed. DJ with screen ₹17,000 excludes DG, which can be selected separately. Outside DJ adds ₹8,000 + ₹3,000 fixed fee + DG usage (defaults to 1 hour).
- Veg rates per guest: 300 → ₹1,100; 350 → ₹1,000; 400 → ₹950; 450 → ₹900; 500 → ₹850. The updated 300 guest veg total is ₹3,30,000.
- Non-veg rates: 300 → ₹1,200; 350 → ₹1,150; 400 → ₹1,100; 450 → ₹1,050; 500 → ₹1,000.
- Outside catering ₹30,000. Catering and waiter gathering sizes can be selected independently.
- The catering image's Count column is interpreted as the per-guest rate because the listed totals equal gathering × count.
- Manual final total overrides the calculated amount and remains fixed when selections change. Clear it or click Use calculated total to restore automatic calculation. Zero is a valid custom amount.
- No taxes or discounts are added. Selections are held in memory and reset on refresh.
- Print, copy, and text download include an itemized estimate and any manual adjustment.

Change prices in `src/calculator.js`. UI is in `src/main.jsx`; styles are in `src/styles.css`. Fonts load from Google Fonts with local fallbacks.
