
import { supabase } from '../lib/supabase';
import DOMPurify from 'dompurify';
import edukasiHero from '../images/edukasi-hero.png';

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

// Ringkasan kartu edukasi dibatasi agar tinggi kartu tetap rapi.
function limitWords(value: string, maxWords: number): string {
  const plainText = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/\\s+/g, ' ')
    .trim();

  const words = plainText.split(' ').filter(Boolean);
  return words.length > maxWords
    ? `${words.slice(0, maxWords).join(' ')}...`
    : plainText;
}

export async function Education(): Promise<string> {
  let topics: Article[] = [];
  let errorMessage = '';

  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, content, image_url')
      .order('created_at', { ascending: false });

    if (error) throw error;

    topics = data ?? [];
  } catch (error) {
    console.error('Gagal mengambil artikel edukasi:', error);
    errorMessage = 'Artikel belum dapat dimuat. Silakan coba kembali.';
  }

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
   
      <div class="catalog-hero-decoration">
        <img
          src="${edukasiHero}"
          alt="Dua varian produk ECO-CARBON: Original kotoran sapi dan Blend ampas kopi serta sekam padi"
        >
      </div>
    </section>

    <section class="education-content">
      <div class="education-heading">
        <div>
          <span class="eyebrow">ARTIKEL & INFORMASI</span>
          <h2>Jelajahi <span>Topik Edukasi</span></h2>
        </div>
        
      </div>

      <div class="article-grid">
        ${
          errorMessage
            ? `<p>${escapeHtml(errorMessage)}</p>`
            : topics.length > 0
              ? topics.map((topic) => `
                <article class="article-card">
                  <div class="article-image">
                    ${
                      topic.image_url
                        ? `<img
                            src="${escapeHtml(topic.image_url)}"
                            alt="${escapeHtml(topic.title)}"
                            onerror="this.style.display='none'"
                          >`
                        : ''
                    }
                  </div>

                  <div class="article-body">
                    <span class="article-category">
                      ${escapeHtml(topic.category)}
                    </span>
                    <h3>${escapeHtml(topic.title)}</h3>
                    <p>${escapeHtml(limitWords(topic.content, 32))}</p>
                    <a href="/mekarbriq/edukasi/${encodeURIComponent(topic.id)}" class="text-link">
                    Baca selengkapnya →
                    </a>
                  </div>
                </article>
              `).join('')
              : '<p>Belum ada artikel edukasi.</p>'
        }
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
