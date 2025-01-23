// src/app/components/Header.tsx
export default function Header() {
    return (
      <header>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '0 15px' }}><a href="/">Accueil</a></li>
            <li style={{ margin: '0 15px' }}><a href="/about">À propos</a></li>
            <li style={{ margin: '0 15px' }}><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>
    );
  }
  
