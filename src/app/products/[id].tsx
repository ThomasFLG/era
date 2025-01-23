// src/app/products/[id].tsx
import { useRouter } from 'next/router';

export default function ProductPage() {
  const { query } = useRouter();
  const { id } = query;  // Cela récupère le paramètre `id` de l'URL (ex. /products/123)

  return (
    <div>
      <h1>Produit ID: {id}</h1>
      {/* Vous pouvez maintenant afficher des détails sur le produit avec l'ID récupéré */}
    </div>
  );
}
