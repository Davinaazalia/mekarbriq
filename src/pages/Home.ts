import { getProducts, type Product } from '../data/products';
import { supabase } from '../lib/supabase';
import logoMekarbriq from '../images/logo-mekarbriq.png';
import kelompokTaniImage from '../images/kelompok-tani.jpg';
import aktivitasProduksiImage from '../images/aktivitas-produksi.jpg';
import heroImage from '../images/hero-mekarbriq.jpg';


interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url: string | null;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char] ?? char);
}

// Ubah HTML dari Quill menjadi teks biasa untuk preview kartu beranda.
// Mengubah HTML Quill menjadi teks biasa
function stripHtml(value: string): string {
  const temp = document.createElement('div');

  // Beri jarak antar paragraf dan daftar
  temp.innerHTML = value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|li|h[1-6]|div|ol|ul)>/gi, ' ');

  return (temp.textContent || temp.innerText || '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Membatasi jumlah kata
function limitWords(value: string, maxWords: number): string {
  const clean = stripHtml(value);

  if (!clean) return '';

  const words = clean.split(/\s+/);

  return words.length > maxWords
    ? words.slice(0, maxWords).join(' ') + '...'
    : clean;
}


export async function Home(): Promise<string> {
  let products: Product[] = [];
  let articles: Article[] = [];

  try {
    products = (await getProducts()).slice(0, 2);
  } catch (error) {
    console.error('Gagal mengambil produk beranda:', error);
  }

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, content, image_url')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;
    articles = data ?? [];
  } catch (error) {
    console.error('Gagal mengambil artikel edukasi:', error);
  }

  return `
    <section class="home-hero" id="beranda">
      <div class="home-hero-copy">
        <span class="eyebrow">INOVASI BERKELANJUTAN · MEKARBRIQ</span>
        <h1>Mengolah Limbah,<br><span>Menghadirkan Nilai.</span></h1>
        <p>
          Mengenal potensi briket biocarbon melalui inovasi dan
          pemberdayaan Kelompok Tani Ternak Mekar Sari 1.
        </p>
        <div class="home-hero-actions">
          <a href="#katalog" class="btn-primary">Jelajahi Produk <span>→</span></a>
          <a href="/profil" class="btn-secondary" data-link>Kenali Kelompok Kami</a>
        </div>
        <div class="home-hero-caption">
          <span class="home-caption-mark">✳</span>
          <span>Potensi lokal untuk pemanfaatan yang lebih bernilai.</span>
        </div>
      </div>

      <div class="home-hero-visual">
        <div class="home-hero-photo">
          <img
            src="${heroImage}"
            alt="Foto produk atau aktivitas MEKARBRIQ"
            onerror="this.style.display='none'; this.parentElement.classList.add('image-placeholder');"
          >
          <div class="home-photo-placeholder">
            <span>＋</span>
            <strong>Foto Utama MEKARBRIQ</strong>
            <small>Letakkan hero-mekarbriq.jpg di public/images/</small>
          </div>
        </div>
        <div class="home-hero-stamp">
          <span>MEKAR</span>
          <strong>BRIQ</strong>
          <small>FROM WASTE TO VALUE</small>
        </div>
        <div class="home-hero-orbit"></div>
      </div>
    </section>

    <section class="home-about" id="profil">
      <div class="home-about-media">
        <div class="home-about-main-photo">
          <img
            src="${kelompokTaniImage}"
            alt="Kelompok Tani Ternak Mekar Sari 1"
            onerror="this.style.display='none'; this.parentElement.classList.add('image-placeholder');"
          >
          <div class="home-photo-placeholder">
            <span>＋</span>
            <strong>Foto Kelompok</strong>
            <small>Letakkan kelompok-tani.jpg di public/images/</small>
          </div>
        </div>
        <div class="home-about-small-photo">
          <img
            src="${aktivitasProduksiImage}"
            alt="Aktivitas kelompok"
            onerror="this.style.display='none'; this.parentElement.classList.add('image-placeholder');"
          >
          <div class="home-photo-placeholder">
            <span>＋</span>
            <strong>Foto Aktivitas</strong>
            <small>aktivitas-produksi.jpg</small>
          </div>
        </div>
        <div class="home-about-location"><span>⌖</span> Mangunsari, Gunungpati</div>
      </div>

      <div class="home-about-copy">
        <span class="eyebrow">TENTANG KAMI</span>
        <h2>Berangkat dari potensi lokal, <span>tumbuh bersama.</span></h2>
        <p class="home-about-lead">
          MEKARBRIQ merupakan media informasi digital Kelompok Tani Ternak
          Mekar Sari 1 yang berlokasi di Kelurahan Mangunsari, Kecamatan
          Gunungpati, Kota Semarang.
        </p>
        <p>
          Melalui website ini, pengunjung dapat mengenal kelompok,
          melihat informasi produk briket biocarbon, serta membaca
          edukasi mengenai pemanfaatan limbah dan potensi sumber daya lokal.
        </p>

        <div class="home-about-points">
          <div>
            <span class="home-point-icon">01</span>
            <div>
              <strong>Kenali kelompok</strong>
              <small>Informasi profil dan lokasi kelompok.</small>
            </div>
          </div>
          <div>
            <span class="home-point-icon">02</span>
            <div>
              <strong>Jelajahi produk</strong>
              <small>Informasi produk briket biocarbon.</small>
            </div>
          </div>
          <div>
            <span class="home-point-icon">03</span>
            <div>
              <strong>Tambah wawasan</strong>
              <small>Artikel seputar limbah dan biocarbon.</small>
            </div>
          </div>
        </div>

        <a href="/profil" class="home-text-cta" data-link>Selengkapnya tentang kelompok <span>↗</span></a>
      </div>
    </section>

    <section class="home-focus">
      <div class="home-focus-heading">
        <span class="eyebrow">NILAI YANG DIANGKAT</span>
        <h2>Mengenal potensi <span>di sekitar kita.</span></h2>
        <p>MEKARBRIQ mempertemukan informasi kelompok, produk, dan pengetahuan dalam satu ruang digital.</p>
      </div>
      <div class="home-focus-grid">
        <article class="home-focus-card">
          <span>01 / LOKAL</span>
          <div class="home-focus-icon">⌖</div>
          <h3>Potensi Lokal</h3>
          <p>Mengenal kelompok dan potensi sumber daya yang ada di lingkungan sekitar.</p>
        </article>
        <article class="home-focus-card home-focus-card-featured">
          <span>02 / PRODUK</span>
          <div class="home-focus-icon">♨</div>
          <h3>Briket Biocarbon</h3>
          <p>Melihat informasi produk briket biocarbon yang diperkenalkan oleh kelompok.</p>
        </article>
        <article class="home-focus-card">
          <span>03 / EDUKASI</span>
          <div class="home-focus-icon">✳</div>
          <h3>Berbagi Pengetahuan</h3>
          <p>Membaca wawasan mengenai pengelolaan limbah dan pemanfaatannya.</p>
        </article>
      </div>
    </section>

    <section class="section catalog home-catalog" id="katalog">
      <div class="section-heading">
        <span class="eyebrow">KATALOG PRODUK</span>
        <h2>Produk <span>MEKARBRIQ</span></h2>
        <p>Kenali produk briket biocarbon dari kelompok kami.</p>
      </div>
      <div
        class="product-grid"
        style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;align-items:stretch;"
      >
        ${
          products.length > 0
            ? products.map((product) => `
              <article
                class="product-card"
                style="display:flex;flex-direction:column;min-width:0;overflow:hidden;background:#fff;border-radius:18px;"
              >
                <div
                  class="product-image home-product-image"
                  style="height:700px;min-height:200px;position:relative;overflow:hidden;flex:none;background:#e4ecd9;"
                >
                  ${
                    product.image
                      ? `
                        <img
                          src="${escapeHtml(product.image)}"
                          alt="${escapeHtml(product.name)}"
                          style="display:block;width:100%;height:100%;object-fit:cover;"
                        >
                      `
                      : `
                        <div class="home-card-image-placeholder" style="width:100%;height:100%;">
                          <span>♨</span>
                          <small>Foto produk belum tersedia</small>
                        </div>
                      `
                  }
                  <span
                    class="product-category"
                    style="position:absolute;top:16px;left:16px;z-index:2;display:inline-block;padding:7px 12px;border-radius:30px;background:#fff;color:#24552f;font-size:11px;"
                  >
                    ${escapeHtml(limitWords(product.category || 'Produk', 2))}
                  </span>
                </div>

                <div
                  class="product-info"
                  style="display:block;flex:1;padding:22px 24px 24px;background:#fff;"
                >
                  <h3 style="display:block;margin:2 0 10px;color:#193c25;font-size:20px;line-height:1.4;">
                    ${escapeHtml(limitWords(product.name || 'Produk MEKARBRIQ', 5))}
                  </h3>
                  <p style="display:block;margin:0 0 18px;color:#687568;font-size:13px;line-height:1.8;">
                    ${escapeHtml(limitWords(product.description || 'Informasi produk briket biocarbon dari MEKARBRIQ.', 20))}
                  </p>
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-link"
                    style="display:inline-flex;align-items:center;gap:7px;color:#24552f;font-size:13px;font-weight:700;text-decoration:none;"
                  >
                    Pesan / Tanya Produk →
                  </a>
                </div>
              </article>
            `).join('')
            : '<p class="home-empty-state">Produk belum tersedia. Silakan cek kembali nanti.</p>'
        }
      </div>

      <div class="home-centered-link"><a href="/katalog" class="home-text-cta" data-link>Lihat seluruh katalog </a></div>
    </section>

    <section class="home-education" id="artikel-edukasi">
      <div class="home-education-top">
        <div class="home-education-heading">
          <span class="eyebrow">RUANG EDUKASI</span>
          <h2>Pengetahuan kecil,<br><span>dampak yang berarti.</span></h2>
        </div>
        <div class="home-education-side">
          <a href="/edukasi" class="home-education-all-link" data-link>
            Lihat Semua Edukasi <span>→</span>
          </a>
          <p>Temukan informasi seputar pengelolaan limbah, briket biocarbon, dan potensi pemanfaatan sumber daya lokal.</p>
        </div>
      </div>
      <div class="article-grid home-article-grid">
        ${
          articles.length > 0
            ? articles.map((article) => `
              <article class="article-card">
                <div class="article-image">
                  ${
                    article.image_url
                      ? `<img src="${escapeHtml(article.image_url)}" alt="${escapeHtml(article.title)}">`
                      : '<div class="home-card-image-placeholder"><span>♻</span><small>Foto artikel belum tersedia</small></div>'
                  }
                </div>
                <div class="article-body">
                  <span class="article-category">${escapeHtml(limitWords(article.category, 2))}</span>
                  <h3>${escapeHtml(limitWords(article.title, 6))}</h3>
                  <p>${escapeHtml(limitWords(article.content, 20))}</p>
                  <a href="/edukasi/${encodeURIComponent(article.id)}" class="text-link">Baca selengkapnya →</a>
                </div>
              </article>
            `).join('')
            : '<p class="home-empty-state">Belum ada artikel edukasi yang dipublikasikan.</p>'
        }
      </div>
    </section>

    <section class="home-contact" id="kontak">
      <div class="home-contact-mark"><span class="brand-icon brand-logo">
          <img
            src="${logoMekarbriq}"
            alt="Logo MEKARBRIQ"
          >
        </span></div>
      <div class="home-contact-copy">
        <span class="eyebrow">TERHUBUNG DENGAN KAMI</span>
        <h2>Mari mengenal MEKARBRIQ lebih dekat.</h2>
        <p>Hubungi kelompok untuk mendapatkan informasi lebih lanjut mengenai produk dan kegiatan.</p>
      </div>
      <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" class="home-contact-button">Hubungi Kami <span>↗</span></a>
    </section>
  `;
}
