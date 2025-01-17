// app/layout.tsx
import { ReactNode } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ERA</title>
      </head>
      <body className="bg-white text-gray-900">
        {/* En-tête (Header) */}
        <Header />
        
        {/* Section principale contenant le contenu des pages (Body) */}
        <main className="p-5">
          {children}  {/* Contenu dynamique des pages */}
        </main>

        {/* Pied de page (Footer) */}
        <Footer />
      </body>
    </html>
  );
}
