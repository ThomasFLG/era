export default function Header() {
  return (
    <header>
      <div className="nav-container">
        <nav className="nav">
          <img src="../../era.png" alt="logo" className="logo" />
          <div className="nav-links">
            <div className="nav-item">
              <a href="/">Définir date activation/expiration</a>
            </div>
            <div className="nav-item">
              <a href="http://localhost/limesurvey/index.php?r=admin/authentication/sa/login">Connexion admin Limesurvey</a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
