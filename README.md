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
    - public/              _# Static assets (images, icons)_
        - file.svg          _# Image/Icon (SVG)_
        - globe.svg         _# Globe icon (SVG)_
        - next.svg          _# Next.js logo (SVG)_
        - vercel.svg        _# Vercel logo (SVG)_
        - window.svg        _# Window icon (SVG)_
  - src/                     # Main source directory
    - app/                 _# Application files & components_
        - api/              _# API routes & endpoints_
            - route.js      **# Handles API requests**
        - products/         _# Product-related pages/components_
            - [id].tsx      **# Product page (dynamic routing)**
        - favicon.ico       _# Browser tab icon (favicon)_
        - globals.css       _# Global styles_
        - layout.tsx        _# App layout structure_
        - page.module.css   _# Page-specific styles_
        - page.tsx          _# Main page component_
        - components/          _# Reusable components_
            - Footer.tsx        **# Footer component**
            - Header.tsx        **# Header component**
            - SurveyList.js     **# Displays survey list**
        - utils/               _# Utility functions/helpers_
            - hooks/            _# Custom React hooks_
            - libs/             _# Helper libraries_
            - services/         _# External services_
                - limesurvey.js **# LimeSurvey integration**
                
  - .env                     _# Environment variables (API keys)_
  - esling.config.mjs        _# ESLint config (JS/TS linting)_
  - next.env.d.ts            _# TypeScript declarations for environment_
  - package-lock.json        _# Ensures consistent package installs_
  - package.json             _# Project metadata & dependencies_
  - README.md                _# Project documentation_
  - tsconfig.json            _# TypeScript compiler settings_
  - tsconfig.tsbuildinfo     _# TypeScript build info (for incremental builds)_




## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
