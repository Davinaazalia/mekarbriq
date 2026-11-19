import logoMekarbriq from '../images/logo-mekarbriq.png';

export function Navbar() {
  return `
    <header class="navbar">
      <a href="/" class="brand" data-link aria-label="MEKARBRIQ - Beranda">
        <span class="brand-icon brand-logo">
          <img
            src="${logoMekarbriq}"
            alt="Logo MEKARBRIQ"
          >
        </span>

        <span>MEKAR<span class="accent">BRIQ</span></span>
      </a>

      <nav class="nav-links">
        <a href="/" data-link>Beranda</a>
        <a href="/profil" data-link>Profil</a>
        <a href="/katalog" data-link>Katalog</a>
        <a href="/edukasi" data-link>Edukasi</a>
      </nav>

      <a href="/katalog" class="nav-button" data-link>
        Lihat Produk
      </a>
    </header>
  `;
}
