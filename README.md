This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

erav2/
├── src/                      # ───────────── Main source directory─────────────
│   ├── app/                  # ───────── Application-specific files and components ─────────────────
│   │  ├── api/               # ── API-related files (defines API routes and endpoints) ────────
│   │  │   ├── route.js       # API routes file (handling requests to server-side endpoints)
│   │  ├── products/          # ── Product-related pages or components ───────────────────────────
│   │  │   ├── [id].tsx       # Dynamic product page, used to display details based on the product ID
│   │  ├── favicon.ico        # Favicon file for browser tab icon
│   │  ├── globals.css        # Global CSS file for overall styling of the app
│   │  ├── layout.tsx         # Layout file that defines the structure for the application pages
│   │  ├── page.module.css    # Page-specific CSS module, scoped to the layout/page
│   │  ├── page.tsx           # Main page component, often the homepage or root of the app
│   ├── components/           # ── Reusable components used across various pages ─────────────────────
│   │  ├── Footer.tsx         # Footer component for the bottom of the page
│   │  ├── Header.tsx         # Header component, typically displayed at the top of the page
│   │  ├── SurveyList.js      # Component for displaying a list of surveys
│   ├── public/               # ── Static files and assets (images, icons, SVGs) ─────────────────────
│   │  ├── file.svg           # SVG image (can be used for logos, icons, etc.)
│   │  ├── globe.svg          # SVG file, potentially representing a globe icon
│   │  ├── next.svg           # Next.js logo or SVG graphic
│   │  ├── vercel.svg         # Vercel logo (for deployment/branding purposes)
│   │  ├── window.svg         # SVG image for window icon or similar graphic
│   ├── utils/                # ── Utility functions and helpers ─────────────────────────────────
│   │  ├── hooks/             # Custom React hooks, encapsulating reusable logic
│   │  ├── libs/              # Helper libraries for additional functionality (e.g., date manipulation, formatting)
│   │  ├── services/          # ── Services for handling business logic or external interactions ──
│   │  │   ├── limesurvey.js  # Service for working with LimeSurvey (e.g., data fetching, API calls)
├── .env                      # ── Environment variables (API keys, secrets) ──────────────────────────
├── esling.config.mjs         # ── ESLint configuration file for linting JavaScript/TypeScript ───
├── next.env.d.ts             # ── TypeScript declaration for Next.js environment variables ───────
├── package-lock.json         # ── Automatically generated, ensures consistent package installation ──
├── package.json              # ── Project's metadata and npm dependencies ───────────────────────────
├── README.md                 # ── Project documentation (guidelines, setup, etc.) ─────────────────────
├── tsconfig.json             # ── TypeScript configuration, defines the compiler settings ────────
├── tsconfig.tsbuildinfo      # ── TypeScript build info file for incremental builds ───────────────


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
