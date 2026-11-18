
export function Profile() {
  return `
    <section class="profile-hero">
      <div class="profile-hero-content">
        <span class="eyebrow">TENTANG KAMI</span>
        <h1>Mengenal Kelompok Tani Ternak <span>Mekar Sari 1</span></h1>
        <p>
          Mengenal lebih dekat kelompok, potensi lokal,
          dan pengembangan produk briket biocarbon.
        </p>
        <a href="#mengenal" class="btn-primary">Kenali Kelompok Kami ↓</a>
      </div>
      <div class="profile-hero-image">
        <img src="/images/profil-kelompok.jpg"
          alt="Dokumentasi Kelompok Tani Ternak Mekar Sari 1"
          onerror="this.style.display='none'">
        <span>Kelompok Tani Ternak Mekar Sari 1</span>
      </div>
    </section>

    <section class="profile-about" id="mengenal">
      <div class="profile-about-label">
        <span class="eyebrow">MENGENAL KAMI</span>
        <h2>Berawal dari potensi lokal, berkembang melalui inovasi.</h2>
      </div>
      <div class="profile-about-text">
        <p>
          Kelompok Tani Ternak Mekar Sari 1 berlokasi di
          Kelurahan Mangunsari, Kecamatan Gunungpati,
          Kota Semarang.
        </p>
        <p>
          Melalui pengembangan MEKARBRIQ, kelompok diperkenalkan
          melalui media digital yang memuat informasi profil,
          katalog produk briket biocarbon, dan edukasi
          pemanfaatan limbah.
        </p>
      </div>
    </section>

    <section class="profile-values">
      <div class="section-heading">
        <span class="eyebrow">IDENTITAS KELOMPOK</span>
        <h2>Mengenal lebih dekat <span>perjalanan kami.</span></h2>
        <p>Informasi mengenai kelompok yang dapat diperbarui oleh pengelola.</p>
      </div>

      <div class="value-grid">
        <article class="value-card">
          <span class="value-number">01</span>
          <h3>Profil Kelompok</h3>
          <p>Informasi sejarah, latar belakang, dan kegiatan kelompok.</p>
        </article>
        <article class="value-card">
          <span class="value-number">02</span>
          <h3>Potensi Lokal</h3>
          <p>Potensi peternakan dan pemanfaatan sumber daya di lingkungan kelompok.</p>
        </article>
        <article class="value-card">
          <span class="value-number">03</span>
          <h3>Pengembangan Produk</h3>
          <p>Informasi pengembangan produk briket biocarbon kelompok.</p>
        </article>
      </div>
    </section>

    <section class="profile-activities">
      <div>
        <span class="eyebrow">DOKUMENTASI</span>
        <h2>Kegiatan <span>Kelompok</span></h2>
        <p>
          Dokumentasi aktivitas nyata Kelompok Tani Ternak
          Mekar Sari 1.
        </p>
      </div>
      <div class="activity-gallery">
        <div class="activity-item">
          <img src="/images/kegiatan-1.jpg" alt="Kegiatan kelompok 1"
            onerror="this.style.display='none'">
        </div>
        <div class="activity-item">
          <img src="/images/kegiatan-2.jpg" alt="Kegiatan kelompok 2"
            onerror="this.style.display='none'">
        </div>
        <div class="activity-item">
          <img src="/images/kegiatan-3.jpg" alt="Kegiatan kelompok 3"
            onerror="this.style.display='none'">
        </div>
      </div>
      <p class="data-note">
        Dokumentasi akan diisi menggunakan foto asli dari mitra.
      </p>
    </section>

    <section class="profile-location">
      <div>
        <span class="eyebrow">LOKASI KELOMPOK</span>
        <h2>Temukan <span>lokasi kami.</span></h2>
        <p>
          Kelurahan Mangunsari, Kecamatan Gunungpati,
          Kota Semarang, Jawa Tengah.
        </p>
      </div>
      <div class="location-card">
        <span>📍</span>
        <h3>Mekar Sari 1</h3>
        <p>Mangunsari, Gunungpati, Semarang</p>
      </div>
    </section>
  `;
}
