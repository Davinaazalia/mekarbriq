
const topics = [
  {
    category: "LINGKUNGAN",
    title: "Mengenal Limbah Peternakan",
    description: "Memahami jenis limbah peternakan dan potensi pengelolaannya.",
    image: "/images/edukasi-limbah.jpg"
  },
  {
    category: "PRODUK",
    title: "Apa Itu Briket Biocarbon?",
    description: "Mengenal pengertian, karakteristik, dan pemanfaatan briket biocarbon.",
    image: "/images/edukasi-briket.jpg"
  },
  {
    category: "PEMANFAATAN",
    title: "Potensi Pemanfaatan Limbah",
    description: "Mempelajari bagaimana limbah dapat dimanfaatkan menjadi produk bernilai guna.",
    image: "/images/edukasi-pemanfaatan.jpg"
  }
];

export function Education() {
  return `
    <section class="education-hero">
      <div>
        <span class="eyebrow">RUANG EDUKASI MEKARBRIQ</span>
        <h1>Pengetahuan kecil untuk perubahan <span>yang lebih baik.</span></h1>
        <p>
          Pelajari informasi seputar lingkungan, limbah peternakan,
          dan pengenalan briket biocarbon.
        </p>
      </div>
      <div class="education-hero-art">🌱</div>
    </section>

    <section class="education-content">
      <div class="education-heading">
        <div>
          <span class="eyebrow">ARTIKEL & INFORMASI</span>
          <h2>Jelajahi <span>Topik Edukasi</span></h2>
        </div>
        <p>Informasi untuk mengenal potensi sumber daya lokal.</p>
      </div>

      <div class="article-grid">
        ${topics.map((topic, index) => `
          <article class="article-card">
            <div class="article-image">
              <img src="${topic.image}"
                alt="${topic.title}"
                onerror="this.style.display='none'">
            </div>
            <div class="article-body">
              <span class="article-category">${topic.category}</span>
              <h3>${topic.title}</h3>
              <p>${topic.description}</p>
              <a href="#artikel-${index + 1}" class="text-link">
                Baca selengkapnya →
              </a>
            </div>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="education-process">
      <div class="process-heading">
        <span class="eyebrow">MENGENAL PROSES</span>
        <h2>Dari potensi limbah menuju <span>produk bernilai.</span></h2>
        <p>
          Pelajari proses pemanfaatan limbah menjadi briket
          berdasarkan informasi dan proses nyata dari mitra.
        </p>
      </div>
      <div class="process-note">
        <span>♻</span>
        <h3>Belajar, memahami, dan memanfaatkan.</h3>
        <p>
          Materi tahapan pengolahan akan dilengkapi
          setelah proses produksi dikonfirmasi kepada mitra.
        </p>
      </div>
    </section>
  `;
}
