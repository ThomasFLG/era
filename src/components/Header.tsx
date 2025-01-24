// src/app/components/Header.tsx
export default function Header() {
    return (
      <header>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0 15px' }}><a href="/">Accueil</a></li>
            <li style={{ margin: '0 15px' }}><a href="/listeSurvey">Liste des formulaires</a></li>
          </ul>
        </nav>
      </header>
    );
  }
  