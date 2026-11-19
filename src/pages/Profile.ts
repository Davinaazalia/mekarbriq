import { supabase } from '../lib/supabase';

interface GroupProfile {
  id: number;
  name: string;
  intro: string;
  history: string | null;
  vision: string | null;
  mission: string | null;
  address: string | null;
  hero_image: string | null;
  group_image: string | null;
}

interface GroupDocument {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char] ?? char);
}
// Membatasi jumlah kata pada kartu dokumentasi
function limitWords(value: string, maxWords: number): string {
  const words = value.trim().split(/\s+/);

  if (!value.trim()) return '';
  if (words.length <= maxWords) return value;

  return words.slice(0, maxWords).join(' ') + '...';
}

export async function Profile(): Promise<string> {
  let profile: GroupProfile | null = null;
  let documents: GroupDocument[] = [];

  try {
    const { data, error } = await supabase.from('group_profile')
      .select('id,name,intro,history,vision,mission,address,hero_image,group_image')
      .eq('id', 1).maybeSingle();
    if (error) throw error;
    profile = data as GroupProfile | null;
  } catch (error) {
    console.error('Gagal memuat profil kelompok:', error);
  }

  try {
    const { data, error } = await supabase.from('group_documentation')
      .select('id,title,description,image_url')
      .order('created_at', { ascending: false });
    if (error) throw error;
    documents = (data ?? []) as GroupDocument[];
  } catch (error) {
    console.error('Gagal memuat dokumentasi kelompok:', error);
  }

  const name = profile?.name || 'Kelompok Tani Ternak Mekar Sari 1';
  const intro = profile?.intro || 'Mengenal lebih dekat kelompok, potensi lokal, dan pengembangan produk briket biocarbon.';
  const history = profile?.history || 'Kelompok Tani Ternak Mekar Sari 1 berlokasi di Kelurahan Mangunsari, Kecamatan Gunungpati, Kota Semarang.';
  const address = profile?.address || 'Kelurahan Mangunsari, Kecamatan Gunungpati, Kota Semarang, Jawa Tengah.';
  const missions = (profile?.mission || '').split('\n').map((item) => item.trim()).filter(Boolean);

  return `
    <section class="profile-hero">
      <div class="profile-hero-content">
        <span class="eyebrow">TENTANG KAMI</span>
        <h1>Mengenal Kelompok Tani Ternak <span>${escapeHtml(name)}</span></h1>
        <p>${escapeHtml(intro)}</p>
        <a href="#mengenal" class="btn-primary">Kenali Kelompok Kami ↓</a>
      </div>
      <div class="profile-hero-image">
        ${profile?.hero_image ? `<img src="${escapeHtml(profile.hero_image)}" alt="Foto profil ${escapeHtml(name)}">` : `<img src="/images/profil-kelompok.jpg" alt="Dokumentasi kelompok" onerror="this.style.display='none'">`}
        <span>${escapeHtml(name)}</span>
      </div>
    </section>

<section class="profile-about" id="mengenal">
  <div class="profile-about-image">
    ${
      profile?.group_image
        ? `
          <img
            src="${escapeHtml(profile.group_image)}"
            alt="Kegiatan Kelompok Tani Ternak Mekar Sari 1"
          >
        `
        : `
          <div class="profile-image-placeholder">
            Foto kelompok belum tersedia
          </div>
        `
    }
  </div>

  <div class="profile-about-content">
    <span class="eyebrow">MENGENAL KAMI</span>

    <h2>Berawal dari potensi lokal,
      <span>berkembang melalui inovasi.</span>
    </h2>

    <p>${escapeHtml(history)}</p>
    <p>${escapeHtml(intro)}</p>
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
          <p>${escapeHtml(history)}</p>
        </article>
        <article class="value-card">
          <span class="value-number">02</span>
          <h3>Visi</h3>
          <p>${escapeHtml(profile?.vision || 'Informasi visi kelompok belum ditambahkan.')}</p>
        </article>
        <article class="value-card">
          <span class="value-number">03</span>
          <h3>Misi</h3>
          <p>${missions.length ? missions.map(escapeHtml).join('<br>') : 'Informasi misi kelompok belum ditambahkan.'}</p>
        </article>
      </div>
    </section>

    <section class="profile-activities">
      <div>
        <span class="eyebrow">DOKUMENTASI</span>
        <h2>Kegiatan <span>Kelompok</span></h2>
        <p>Dokumentasi aktivitas nyata ${escapeHtml(name)}.</p>
      </div>
      <div class="activity-gallery">
        ${
          documents.length
            ? documents.map((item) => `
  <article class="activity-item">
    <img
      src="${escapeHtml(item.image_url)}"
      alt="${escapeHtml(item.title)}"
    >

    <div class="activity-caption">
      <strong>${escapeHtml(item.title)}</strong>

      ${
        item.description
          ? `<p>${escapeHtml(limitWords(item.description, 20))}</p>`
          : ''
      }

      <a
        href="/dokumentasi/${encodeURIComponent(item.id)}"
        data-link
        class="text-link"
      >
        Baca selengkapnya →
      </a>
    </div>
  </article>
`).join('')
            : `<p class="data-note">Dokumentasi kegiatan belum ditambahkan.</p>`
        }
      </div>
    </section>

    <section class="profile-location">
      <div>
        <span class="eyebrow">LOKASI KELOMPOK</span>
        <h2>Temukan <span>lokasi kami.</span></h2>
        <p>${escapeHtml(address)}</p>
      </div>
      <div class="location-card">
        <span>📍</span>
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(address)}</p>
      </div>
    </section>
  `;
}
