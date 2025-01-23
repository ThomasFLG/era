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

- erav2/
  - src/                     # Main source directory
    - app/                 # Application files & components
      - api/              # API routes & endpoints
        - route.js      # Handles API requests
      - products/         # Product-related pages/components
        - [id].tsx      # Product page (dynamic routing)
      - favicon.ico       # Browser tab icon (favicon)
      - globals.css       # Global styles
      - layout.tsx        # App layout structure
      - page.module.css   # Page-specific styles
      - page.tsx          # Main page component
    - components/          # Reusable components
      - Footer.tsx        # Footer component
      - Header.tsx        # Header component
      - SurveyList.js     # Displays survey list
    - public/              # Static assets (images, icons)
      - file.svg          # Image/Icon (SVG)
      - globe.svg         # Globe icon (SVG)
      - next.svg          # Next.js logo (SVG)
      - vercel.svg        # Vercel logo (SVG)
      - window.svg        # Window icon (SVG)
    - utils/               # Utility functions/helpers
      - hooks/            # Custom React hooks
      - libs/             # Helper libraries
      - services/         # External services
        - limesurvey.js # LimeSurvey integration
  - .env                     # Environment variables (API keys)
  - esling.config.mjs        # ESLint config (JS/TS linting)
  - next.env.d.ts            # TypeScript declarations for environment
  - package-lock.json        # Ensures consistent package installs
  - package.json             # Project metadata & dependencies
  - README.md                # Project documentation
  - tsconfig.json            # TypeScript compiler settings
  - tsconfig.tsbuildinfo     # TypeScript build info (for incremental builds)



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
