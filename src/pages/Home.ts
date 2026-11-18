
const products = [
  {
    name: 'Briket Biocarbon Padat',
    category: 'Produk 01',
    description: 'Informasi produk briket biocarbon dari Kelompok Tani Ternak Mekar Sari 1.'
  },
  {
    name: 'Briket Biocarbon Berlubang',
    category: 'Produk 02',
    description: 'Kenali informasi dan karakteristik produk briket biocarbon kelompok kami.'
  }
];

export function Home() {
  return `
    <section class="hero" id="beranda">
      <div class="hero-content">
        <span class="eyebrow">INOVASI BERKELANJUTAN</span>

        <h1>
          Mengolah Limbah,
          <span>Menghadirkan Nilai.</span>
        </h1>

        <p>
          Mengenal potensi briket biocarbon melalui inovasi
          dan pemberdayaan Kelompok Tani Ternak Mekar Sari 1.
        </p>

        <div class="hero-actions">
          <a href="#katalog" class="btn-primary">
            Jelajahi Produk →
          </a>
          <a href="#profil" class="btn-secondary">
            Tentang Kami
          </a>
        </div>

        <div class="hero-note">
          🌿 Informasi produk dan edukasi pemanfaatan limbah
        </div>
      </div>

      <div class="hero-visual">
        <div class="visual-circle"></div>
        <div class="visual-card">
          <div class="visual-icon">♨</div>
          <span>BRIQUETTE</span>
          <strong>BioCarbon</strong>
          <small>MEKARBRIQ</small>
        </div>
      </div>
    </section>

    <section class="section intro" id="profil">
      <span class="eyebrow">TENTANG MEKARBRIQ</span>
      <h2>Mengenal lebih dekat <span>kelompok kami.</span></h2>

      <p>
        MEKARBRIQ merupakan media informasi digital Kelompok
        Tani Ternak Mekar Sari 1 yang berlokasi di Kelurahan
        Mangunsari, Kecamatan Gunungpati, Kota Semarang.
      </p>

      <p>
        Website ini dikembangkan untuk memperkenalkan profil
        kelompok, katalog produk briket biocarbon, serta
        informasi edukasi mengenai pemanfaatan limbah.
      </p>
    </section>

    <section class="section catalog" id="katalog">
      <div class="section-heading">
        <span class="eyebrow">KATALOG PRODUK</span>
        <h2>Produk <span>MEKARBRIQ</span></h2>
        <p>Kenali produk briket biocarbon dari kelompok kami.</p>
      </div>

      <div class="product-grid">
        ${products.map(product => `
          <article class="product-card">
            <div class="product-image">
              <span class="product-symbol">♨</span>
              <span class="product-category">${product.category}</span>
            </div>

            <div class="product-info">
              <h3>${product.name}</h3>
              <p>${product.description}</p>
              <a href="#kontak" class="text-link">
                Informasi produk →
              </a>
            </div>
          </article>
        `).join('')}
      </div>

      <p class="data-note">
        *Nama dan informasi produk masih contoh awal dan perlu
        dikonfirmasi kepada mitra.
      </p>
    </section>

    <section class="section education" id="edukasi">
      <div>
        <span class="eyebrow">RUANG EDUKASI</span>
        <h2>Belajar tentang potensi <span>biocarbon.</span></h2>
        <p>
          Temukan informasi mengenai pengelolaan limbah,
          pengenalan briket biocarbon, dan potensi pemanfaatan
          sumber daya lokal.
        </p>
        <a href="#kontak" class="btn-primary">
          Jelajahi Edukasi →
        </a>
      </div>

      <div class="education-visual">
        <span>♻</span>
        <strong>FROM WASTE TO VALUE</strong>
      </div>
    </section>

    <section class="contact section" id="kontak">
      <div>
        <span class="eyebrow">TERHUBUNG DENGAN KAMI</span>
        <h2>Ingin mengetahui lebih lanjut?</h2>
        <p>Hubungi kelompok untuk mendapatkan informasi produk.</p>
      </div>

      <a href="https://wa.me/" class="btn-primary">
        Hubungi via WhatsApp →
      </a>
    </section>
  `;
}
