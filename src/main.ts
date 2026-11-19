import page from 'page';
import './style.css';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Catalog } from './pages/Catalog';
import { Education } from './pages/Education';

import {
  AdminLogin,
  setupAdminLogin
} from './pages/admin/Login';

import {
  AdminDashboard,
  setupAdminDashboard
} from './pages/admin/Dashboard';

import { supabase } from './lib/supabase';
import DOMPurify from 'dompurify';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Mengamankan teks sebelum dimasukkan ke HTML
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char] ?? char);
}

// Render halaman pengunjung
function render(content: string) {
  app.innerHTML = `
    ${Navbar()}
    <main>${content}</main>
    ${Footer()}
  `;

  window.scrollTo(0, 0);
}

// Render halaman admin
function renderAdmin(content: string) {
  app.innerHTML = content;
  window.scrollTo(0, 0);
}

// ================================
// HALAMAN PENGUNJUNG
// ================================

page('/', async () => {
  render(await Home());
});

page('/profil', async () => {
  render(await Profile());
});

page('/dokumentasi/:id', async (ctx) => {
  try {
    const { data, error } = await supabase
      .from('group_documentation')
      .select('id, title, description, image_url')
      .eq('id', ctx.params.id)
      .single();

    if (error || !data) {
      render(`
        <section class="education-content">
          <h2>Dokumentasi tidak ditemukan.</h2>
          <a href="/profil" data-link class="text-link">
            ← Kembali ke Profil
          </a>
        </section>
      `);
      return;
    }

    const escapeHtml = (value: string) =>
      value.replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[char] ?? char);

    render(`
      <section class="education-content">
        <div class="education-heading">
          <div>
            <span class="eyebrow">DOKUMENTASI KEGIATAN</span>
            <h2>${escapeHtml(data.title)}</h2>
          </div>
        </div>

        ${
          data.image_url
            ? `
              <div class="article-image">
                <img
                  src="${escapeHtml(data.image_url)}"
                  alt="${escapeHtml(data.title)}"
                  style="width:100%;height:100%;object-fit:cover;"
                >
              </div>
            `
            : ''
        }

        <div class="article-body">
          <p style="white-space: pre-line;">
            ${escapeHtml(data.description || 'Belum ada keterangan kegiatan.')}
          </p>

          <a href="/profil" data-link class="text-link">
            ← Kembali ke Profil
          </a>
        </div>
      </section>
    `);
  } catch (error) {
    console.error('Gagal memuat detail dokumentasi:', error);

    render(`
      <section class="education-content">
        <h2>Dokumentasi gagal dimuat.</h2>
        <a href="/profil" data-link class="text-link">
          ← Kembali ke Profil
        </a>
      </section>
    `);
  }
});
// Halaman daftar artikel edukasi
page('/edukasi', async () => {
  try {
    render(await Education());
  } catch (error) {
    console.error('Gagal memuat halaman edukasi:', error);

    render(`
      <section class="education-content">
        <h2>Artikel belum dapat dimuat.</h2>
        <a href="/edukasi" class="text-link">
          Coba kembali
        </a>
      </section>
    `);
  }
});

// Halaman detail artikel
page('/edukasi/:id', async (ctx) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, content, image_url')
      .eq('id', ctx.params.id)
      .single();

    if (error || !data) {
      render(`
        <section class="education-content">
          <h2>Artikel tidak ditemukan.</h2>
          <a href="/edukasi" class="text-link">
            ← Kembali ke Edukasi
          </a>
        </section>
      `);
      return;
    }

    const article = data;

    render(`
      <section class="education-content">
        <div class="education-heading">
          <div>
            <span class="eyebrow">
              ${escapeHtml(article.category)}
            </span>
            <h2>${escapeHtml(article.title)}</h2>
          </div>
        </div>

        ${article.image_url ? `
          <div class="article-image">
            <img
              src="${escapeHtml(article.image_url)}"
              alt="${escapeHtml(article.title)}"
            >
          </div>
        ` : ''}

        <div class="article-body">
          <div class="article-rich-content">${DOMPurify.sanitize(article.content)}</div>

          <a href="/edukasi" class="text-link">
            ← Kembali ke Edukasi
          </a>
        </div>
      </section>
    `);

  } catch (error) {
    console.error('Gagal memuat detail artikel:', error);

    render(`
      <section class="education-content">
        <h2>Terjadi kesalahan saat memuat artikel.</h2>
        <a href="/edukasi" class="text-link">
          ← Kembali ke Edukasi
        </a>
      </section>
    `);
  }
});

// Halaman katalog
page('/katalog', async () => {
  try {
    render(await Catalog());
  } catch (error) {
    console.error('Gagal memuat katalog:', error);
    render(`
      <section class="content-section">
        <h2>Produk belum dapat dimuat.</h2>
      </section>
    `);
  }
});

// ================================
// HALAMAN ADMIN
// ================================

// Login admin
page('/admin/login', async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    page.redirect('/admin');
    return;
  }

  renderAdmin(AdminLogin());
  setupAdminLogin();
});

// Dashboard admin
page('/admin', async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    page.redirect('/admin/login');
    return;
  }

  renderAdmin(AdminDashboard());
  await setupAdminDashboard();
});

// ================================
// HALAMAN 404
// ================================

page('*', () => {
  render(`
    <section class="content-section not-found">
      <h1>404</h1>
      <h2>Halaman tidak ditemukan</h2>
      <a href="/" data-link class="btn-primary">
        Kembali ke Beranda
      </a>
    </section>
  `);
});

page();
