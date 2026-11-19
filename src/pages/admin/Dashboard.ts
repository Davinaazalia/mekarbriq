import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  uploadProductImage,
  type Product
} from '../../data/products';
import { supabase } from '../../lib/supabase';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

type Article = {
  id: string;
  title: string;
  category: string;
  content: string;
  image_url?: string | null;
  created_at?: string;
};

type GroupDocument = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at?: string;
};

type GroupProfile = {
  id: number;
  name: string;
  intro: string;
  history: string | null;
  vision: string | null;
  mission: string | null;
  address: string | null;
  hero_image: string | null;
  group_image: string | null;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    };
    return entities[char];
  });
}

function renderProductRows(products: Product[]): string {
  if (!products.length) {
    return '<div class="admin-empty">Belum ada produk. Klik “Tambah Produk” untuk membuat produk pertama.</div>';
  }

  return products.map((product) => `
    <article class="admin-product-row">
      <div class="admin-product-thumb">
        ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">` : '♨'}
      </div>
      <div class="admin-product-details">
        <strong>${escapeHtml(product.name)}</strong>
        <span>${escapeHtml(product.category)}</span>
        <p>${escapeHtml(product.description)}</p>
      </div>
      <div class="admin-product-actions">
        <button type="button" class="edit-product" data-id="${escapeHtml(product.id)}">Edit</button>
        <button type="button" class="delete-product" data-id="${escapeHtml(product.id)}">Hapus</button>
      </div>
    </article>
  `).join('');
}

function renderArticleRows(articles: Article[]): string {
  if (!articles.length) {
    return '<div class="admin-empty">Belum ada artikel edukasi. Klik “Tambah Artikel” untuk membuat artikel pertama.</div>';
  }

  return articles.map((article) => `
    <article class="admin-product-row">
      <div class="admin-product-thumb">
        ${article.image_url ? `<img src="${escapeHtml(article.image_url)}" alt="${escapeHtml(article.title)}">` : '📰'}
      </div>
      <div class="admin-product-details">
        <strong>${escapeHtml(article.title)}</strong>
        <span>${escapeHtml(article.category)}</span>
        <p>${escapeHtml(article.content.slice(0, 180))}${article.content.length > 180 ? '…' : ''}</p>
      </div>
      <div class="admin-product-actions">
        <button type="button" class="edit-article" data-id="${escapeHtml(article.id)}">Edit</button>
        <button type="button" class="delete-article" data-id="${escapeHtml(article.id)}">Hapus</button>
      </div>
    </article>
  `).join('');
}

export function AdminDashboard(): string {
  return `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-brand">🌱 MEKAR<span>BRIQ</span></div>
        <p class="sidebar-label">MENU UTAMA</p>
        <a href="#dashboard" class="admin-menu active" data-view="dashboard">▦ Dashboard</a>
        <a href="#produk" class="admin-menu" data-view="produk">▣ Kelola Produk</a>
        <a href="#edukasi" class="admin-menu" data-view="edukasi">▤ Kelola Edukasi</a>
        <a href="#profil" class="admin-menu" data-view="profil">◉ Profil Kelompok</a>
        <a href="#dokumentasi" class="admin-menu" data-view="dokumentasi">▧ Dokumentasi</a>
        <button id="admin-logout" class="admin-logout" type="button">Keluar</button>
      </aside>

      <main class="admin-main">
        <header class="admin-topbar">
          <div><span class="eyebrow">ADMIN PANEL</span><h1 id="admin-page-title">Dashboard</h1></div>
          <span class="admin-avatar">A</span>
        </header>

        <section class="admin-view" data-panel="dashboard">
          <section class="admin-welcome">
            <h2>Selamat datang, Admin! 👋</h2>
            <p>Kelola informasi dan konten website MEKARBRIQ melalui halaman ini.</p>
          </section>
          <section class="admin-stats">
            <article class="stat-card"><span>Total Produk</span><strong id="admin-product-count">0</strong><small>Produk katalog</small></article>
            <article class="stat-card"><span>Artikel Edukasi</span><strong id="admin-article-count">0</strong><small>Materi edukasi</small></article>
            <article class="stat-card"><span>Halaman Website</span><strong>4</strong><small>Halaman publik</small></article>
          </section>
          <section class="admin-products">
            <div class="admin-section-heading"><div><span class="eyebrow">RINGKASAN</span><h2>Selamat mengelola MEKARBRIQ</h2><p>Pilih menu di sebelah kiri untuk mengelola konten website.</p></div></div>
          </section>
        </section>

        <section class="admin-view" data-panel="produk" hidden>
          <section class="admin-products">
            <div class="admin-section-heading">
              <div><span class="eyebrow">MANAJEMEN KONTEN</span><h2>Kelola Produk</h2><p>Tambah, ubah, atau hapus produk yang tampil di katalog.</p></div>
              <button id="show-product-form" class="btn-primary" type="button">+ Tambah Produk</button>
            </div>
            <form id="product-form" class="product-form" hidden>
              <h3 id="product-form-title">Tambah Produk</h3>
              <input type="hidden" id="product-id">
              <label for="product-name">Nama produk</label><input id="product-name" type="text" maxlength="90" required>
              <label for="product-category">Kategori / label</label><input id="product-category" type="text" maxlength="30" required>
              <label for="product-file">Foto produk (JPG, PNG, WebP; maksimal 5 MB)</label>
              <input id="product-file" type="file" accept="image/jpeg,image/png,image/webp">
              <img id="product-preview" alt="Preview foto produk" hidden style="max-width:180px;max-height:180px;object-fit:cover;border-radius:12px;margin-top:10px">
              <small id="current-image-note"></small>
              <label for="product-description">Deskripsi</label>
              <div id="product-description-editor" class="rich-editor"></div>
              <div class="product-form-actions"><button class="btn-primary" type="submit" id="save-product">Simpan Produk</button><button class="btn-secondary" type="button" id="cancel-product">Batal</button></div>
              <p id="product-form-message" class="product-form-message" role="status"></p>
            </form>
            <div id="admin-product-list" class="admin-product-list">Memuat produk...</div>
          </section>
        </section>

        <section class="admin-view" data-panel="edukasi" hidden>
          <section class="admin-products">
            <div class="admin-section-heading">
              <div><span class="eyebrow">MANAJEMEN KONTEN</span><h2>Kelola Edukasi</h2><p>Tambah, ubah, dan hapus artikel edukasi untuk pengunjung website.</p></div>
              <button id="show-article-form" class="btn-primary" type="button">+ Tambah Artikel</button>
            </div>
            <form id="article-form" class="product-form" hidden>
              <h3 id="article-form-title">Tambah Artikel</h3>
              <input type="hidden" id="article-id">
              <label for="article-title">Judul artikel</label><input id="article-title" type="text" maxlength="150" required>
              <label for="article-category">Kategori</label><input id="article-category" type="text" maxlength="60" required>
              <label for="article-file">Foto artikel (JPG, PNG, WebP; maksimal 5 MB)</label>
              <input id="article-file" type="file" accept="image/jpeg,image/png,image/webp">
              <img id="article-preview" alt="Preview foto artikel" hidden style="max-width:220px;max-height:160px;object-fit:cover;border-radius:12px;margin-top:10px">
              <small id="article-image-note"></small>
              <label for="article-content">Isi artikel</label>
              <div id="article-content-editor" class="rich-editor"></div>
              <div class="product-form-actions"><button class="btn-primary" type="submit" id="save-article">Simpan Artikel</button><button class="btn-secondary" type="button" id="cancel-article">Batal</button></div>
              <p id="article-form-message" class="product-form-message" role="status"></p>
            </form>
            <div id="admin-article-list" class="admin-product-list">Memuat artikel...</div>
          </section>
        </section>

        <section class="admin-view" data-panel="profil" hidden>
          <section class="admin-products">
            <div class="admin-section-heading">
              <div><span class="eyebrow">INFORMASI KELOMPOK</span><h2>Profil Kelompok</h2><p>Kelola informasi yang ditampilkan pada halaman Profil website.</p></div>
            </div>
            <form id="group-profile-form" class="product-form">
              <label for="group-name">Nama kelompok</label>
              <input id="group-name" type="text" maxlength="150" required>
              <label for="group-intro">Deskripsi singkat</label>
              <textarea id="group-intro" rows="3" maxlength="1000" required></textarea>
              <label for="group-history">Sejarah / cerita kelompok</label>
              <textarea id="group-history" rows="5" maxlength="5000"></textarea>
              <label for="group-vision">Visi</label>
              <textarea id="group-vision" rows="3" maxlength="1500"></textarea>
              <label for="group-mission">Misi (satu poin per baris)</label>
              <textarea id="group-mission" rows="4" maxlength="3000"></textarea>
              <label for="group-address">Alamat / lokasi</label>
              <textarea id="group-address" rows="2" maxlength="500"></textarea>
              <label for="group-hero-file">Foto utama profil (JPG, PNG, WebP; maksimal 5 MB)</label>
              <input id="group-hero-file" type="file" accept="image/jpeg,image/png,image/webp">
              <img id="group-hero-preview" alt="Preview foto utama" hidden style="max-width:240px;max-height:160px;object-fit:cover;border-radius:12px;margin-top:10px">
              <small id="group-hero-note"></small>
              <label for="group-photo-file">Foto kelompok (JPG, PNG, WebP; maksimal 5 MB)</label>
              <input id="group-photo-file" type="file" accept="image/jpeg,image/png,image/webp">
              <img id="group-photo-preview" alt="Preview foto kelompok" hidden style="max-width:240px;max-height:160px;object-fit:cover;border-radius:12px;margin-top:10px">
              <small id="group-photo-note"></small>
              <div class="product-form-actions">
                <button class="btn-primary" type="submit" id="save-group-profile">Simpan Profil</button>
              </div>
              <p id="group-profile-message" class="product-form-message" role="status"></p>
            </form>
          </section>
        </section>

        <section class="admin-view" data-panel="dokumentasi" hidden>
          <section class="admin-products">
            <div class="admin-section-heading">
              <div><span class="eyebrow">GALERI KEGIATAN</span><h2>Dokumentasi</h2><p>Tambah, ubah, dan hapus foto kegiatan kelompok yang tampil di halaman Profil.</p></div>
              <button id="show-document-form" class="btn-primary" type="button">+ Tambah Dokumentasi</button>
            </div>
            <form id="document-form" class="product-form" hidden>
              <h3 id="document-form-title">Tambah Dokumentasi</h3>
              <input type="hidden" id="document-id">
              <label for="document-title">Judul / nama kegiatan</label>
              <input id="document-title" type="text" maxlength="150" required>
              <label for="document-description">Keterangan</label>
              <textarea id="document-description" rows="3" maxlength="1000"></textarea>
              <label for="document-file">Foto dokumentasi (JPG, PNG, WebP; maksimal 5 MB)</label>
              <input id="document-file" type="file" accept="image/jpeg,image/png,image/webp">
              <img id="document-preview" alt="Preview dokumentasi" hidden style="max-width:240px;max-height:160px;object-fit:cover;border-radius:12px;margin-top:10px">
              <small id="document-image-note"></small>
              <div class="product-form-actions">
                <button class="btn-primary" type="submit" id="save-document">Simpan Dokumentasi</button>
                <button class="btn-secondary" type="button" id="cancel-document">Batal</button>
              </div>
              <p id="document-form-message" class="product-form-message" role="status"></p>
            </form>
            <div id="admin-document-list" class="admin-product-list">Memuat dokumentasi...</div>
          </section>
        </section>
      </main>
    </div>
  `;
}

export async function setupAdminDashboard(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = '/admin/login';
    return;
  }

  const getElement = <T extends HTMLElement>(selector: string): T => {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Elemen ${selector} tidak ditemukan.`);
    return element;
  };

  // Rich text editors Quill untuk deskripsi produk dan isi artikel.
  const quillToolbar = [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'link'],
    ['clean']
  ];

  const productEditor = new Quill('#product-description-editor', {
    theme: 'snow',
    placeholder: 'Tulis deskripsi produk...',
    modules: { toolbar: quillToolbar }
  });

  const articleEditor = new Quill('#article-content-editor', {
    theme: 'snow',
    placeholder: 'Tulis isi artikel...',
    modules: { toolbar: quillToolbar }
  });

  const cleanEditorHtml = (html: string): string =>
    DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed']
    });

  const pageTitle = getElement<HTMLHeadingElement>('#admin-page-title');
  const productList = getElement<HTMLDivElement>('#admin-product-list');
  const articleList = getElement<HTMLDivElement>('#admin-article-list');
  const productCount = getElement<HTMLElement>('#admin-product-count');
  const articleCount = getElement<HTMLElement>('#admin-article-count');

  // Navigasi sidebar: tampilkan satu panel sesuai menu yang dipilih.
  document.querySelectorAll<HTMLAnchorElement>('.admin-menu[data-view]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const view = link.dataset.view;
      if (!view) return;
      document.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
        panel.hidden = panel.dataset.panel !== view;
      });
      document.querySelectorAll('.admin-menu').forEach((menu) => menu.classList.remove('active'));
      link.classList.add('active');
      const labels: Record<string, string> = {
        dashboard: 'Dashboard', produk: 'Kelola Produk', edukasi: 'Kelola Edukasi',
        profil: 'Profil Kelompok', dokumentasi: 'Dokumentasi'
      };
      pageTitle.textContent = labels[view] ?? 'Dashboard';
      window.location.hash = view;
    });
  });

  getElement<HTMLButtonElement>('#admin-logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  });

  let products: Product[] = [];
  let articles: Article[] = [];
  let currentImage = '';

  async function refreshProducts(): Promise<void> {
    productList.textContent = 'Memuat produk...';
    try {
      products = await getProducts();
      productList.innerHTML = renderProductRows(products);
      productCount.textContent = String(products.length);
    } catch (error) {
      productList.textContent = `Gagal memuat produk: ${error instanceof Error ? error.message : 'Periksa koneksi Supabase.'}`;
    }
  }

  async function refreshArticles(): Promise<void> {
    articleList.textContent = 'Memuat artikel...';
    try {
      const { data, error } = await supabase.from('articles')
        .select('id,title,category,content,image_url,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      articles = (data ?? []) as Article[];
      articleList.innerHTML = renderArticleRows(articles);
      articleCount.textContent = String(articles.length);
    } catch (error) {
      articleList.textContent = `Gagal memuat artikel: ${error instanceof Error ? error.message : 'Periksa tabel articles dan kebijakan RLS.'}`;
    }
  }

  // CRUD produk
  const productForm = getElement<HTMLFormElement>('#product-form');
  const productId = getElement<HTMLInputElement>('#product-id');
  const productName = getElement<HTMLInputElement>('#product-name');
  const productCategory = getElement<HTMLInputElement>('#product-category');
  const productFile = getElement<HTMLInputElement>('#product-file');

  const productPreview = getElement<HTMLImageElement>('#product-preview');
  const productImageNote = getElement<HTMLElement>('#current-image-note');
  const productFormTitle = getElement<HTMLHeadingElement>('#product-form-title');
  const productMessage = getElement<HTMLParagraphElement>('#product-form-message');
  const saveProduct = getElement<HTMLButtonElement>('#save-product');

  function resetProductForm(): void {
    productForm.reset(); productId.value = ''; currentImage = ''; productEditor.setText('');
    productPreview.removeAttribute('src'); productPreview.hidden = true;
    productImageNote.textContent = ''; productFormTitle.textContent = 'Tambah Produk';
    productForm.hidden = true; productMessage.textContent = '';
  }

  getElement<HTMLButtonElement>('#show-product-form').addEventListener('click', () => {
    resetProductForm(); productForm.hidden = false; productName.focus();
  });
  getElement<HTMLButtonElement>('#cancel-product').addEventListener('click', resetProductForm);

  productFile.addEventListener('change', () => {
    const file = productFile.files?.[0];
    if (!file) { productPreview.hidden = true; return; }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
      productMessage.textContent = 'Pilih gambar JPG, PNG, atau WebP maksimal 5 MB.';
      productFile.value = ''; productPreview.hidden = true; return;
    }
    productPreview.src = URL.createObjectURL(file); productPreview.hidden = false;
    productMessage.textContent = '';
  });

  productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = productName.value.trim();
    const category = productCategory.value.trim();
    const description = productEditor.getText().trim() ? cleanEditorHtml(productEditor.root.innerHTML) : '';
    if (!name || !category || !description) {
      productMessage.textContent = 'Lengkapi nama, kategori, dan deskripsi produk.'; return;
    }
    const file = productFile.files?.[0];
    saveProduct.disabled = true; saveProduct.textContent = 'Menyimpan...'; productMessage.textContent = '';
    try {
      if (file) currentImage = await uploadProductImage(file);
      const input = { name, category, description, image: currentImage };
      if (productId.value) await updateProduct(productId.value, input);
      else await addProduct(input);
      resetProductForm(); await refreshProducts();
    } catch (error) {
      productMessage.textContent = error instanceof Error ? error.message : 'Gagal menyimpan produk.';
    } finally {
      saveProduct.disabled = false; saveProduct.textContent = 'Simpan Produk';
    }
  });

  productList.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const edit = target.closest<HTMLButtonElement>('.edit-product');
    const remove = target.closest<HTMLButtonElement>('.delete-product');
    if (edit) {
      const product = products.find((item) => item.id === edit.dataset.id);
      if (!product) return;
      productId.value = product.id; productName.value = product.name;
      productCategory.value = product.category; productEditor.clipboard.dangerouslyPasteHTML(cleanEditorHtml(product.description));
      currentImage = product.image; productFormTitle.textContent = 'Edit Produk';
      if (currentImage) { productPreview.src = currentImage; productPreview.hidden = false; }
      else { productPreview.removeAttribute('src'); productPreview.hidden = true; }
      productImageNote.textContent = currentImage ? 'Foto saat ini dipertahankan jika tidak memilih foto baru.' : '';
      productForm.hidden = false; productName.focus(); productForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (remove) {
      const id = remove.dataset.id;
      if (!id || !window.confirm('Yakin ingin menghapus produk ini?')) return;
      try { await deleteProduct(id); await refreshProducts(); }
      catch (error) { window.alert(error instanceof Error ? error.message : 'Gagal menghapus produk.'); }
    }
  });

  // CRUD artikel edukasi
  const articleForm = getElement<HTMLFormElement>('#article-form');
  const articleId = getElement<HTMLInputElement>('#article-id');
  const articleTitle = getElement<HTMLInputElement>('#article-title');
  const articleCategory = getElement<HTMLInputElement>('#article-category');

  const articleFile = getElement<HTMLInputElement>('#article-file');
  const articlePreview = getElement<HTMLImageElement>('#article-preview');
  const articleImageNote = getElement<HTMLElement>('#article-image-note');
  const articleFormTitle = getElement<HTMLHeadingElement>('#article-form-title');
  const articleMessage = getElement<HTMLParagraphElement>('#article-form-message');
  const saveArticle = getElement<HTMLButtonElement>('#save-article');

  let currentArticleImage = '';

  function resetArticleForm(): void {
    articleForm.reset(); articleId.value = ''; currentArticleImage = ''; articleEditor.setText('');
    articlePreview.removeAttribute('src'); articlePreview.hidden = true;
    articleImageNote.textContent = '';
    articleFormTitle.textContent = 'Tambah Artikel';
    articleForm.hidden = true; articleMessage.textContent = '';
  }

  articleFile.addEventListener('change', () => {
    const file = articleFile.files?.[0];
    if (!file) { articlePreview.hidden = true; return; }
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) {
      articleMessage.textContent = 'Pilih gambar JPG, PNG, atau WebP maksimal 5 MB.';
      articleFile.value = ''; articlePreview.hidden = true; return;
    }
    articlePreview.src = URL.createObjectURL(file);
    articlePreview.hidden = false;
    articleMessage.textContent = '';
  });

  getElement<HTMLButtonElement>('#show-article-form').addEventListener('click', () => {
    resetArticleForm(); articleForm.hidden = false; articleTitle.focus();
  });
  getElement<HTMLButtonElement>('#cancel-article').addEventListener('click', resetArticleForm);

  articleForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = articleTitle.value.trim();
    const category = articleCategory.value.trim();
    const content = articleEditor.getText().trim() ? cleanEditorHtml(articleEditor.root.innerHTML) : '';
    if (!title || !category || !content) {
      articleMessage.textContent = 'Lengkapi judul, kategori, dan isi artikel.'; return;
    }
    const selectedArticleFile = articleFile.files?.[0];
    saveArticle.disabled = true; saveArticle.textContent = 'Menyimpan...'; articleMessage.textContent = '';
    try {
      if (selectedArticleFile) currentArticleImage = await uploadProductImage(selectedArticleFile);
      const payload = { title, category, content, image_url: currentArticleImage || null };
      const result = articleId.value
        ? await supabase.from('articles').update(payload).eq('id', articleId.value)
        : await supabase.from('articles').insert(payload);
      if (result.error) throw result.error;
      resetArticleForm(); await refreshArticles();
    } catch (error) {
      articleMessage.textContent = error instanceof Error ? error.message : 'Gagal menyimpan artikel.';
    } finally {
      saveArticle.disabled = false; saveArticle.textContent = 'Simpan Artikel';
    }
  });

  articleList.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const edit = target.closest<HTMLButtonElement>('.edit-article');
    const remove = target.closest<HTMLButtonElement>('.delete-article');
    if (edit) {
      const article = articles.find((item) => item.id === edit.dataset.id);
      if (!article) return;
      articleId.value = article.id; articleTitle.value = article.title;
      articleCategory.value = article.category; articleEditor.clipboard.dangerouslyPasteHTML(cleanEditorHtml(article.content));
      currentArticleImage = article.image_url ?? '';
      if (currentArticleImage) {
        articlePreview.src = currentArticleImage; articlePreview.hidden = false;
        articleImageNote.textContent = 'Foto saat ini dipertahankan jika tidak memilih foto baru.';
      } else {
        articlePreview.removeAttribute('src'); articlePreview.hidden = true;
        articleImageNote.textContent = '';
      }
      articleFormTitle.textContent = 'Edit Artikel'; articleForm.hidden = false;
      articleTitle.focus(); articleForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (remove) {
      const id = remove.dataset.id;
      if (!id || !window.confirm('Yakin ingin menghapus artikel ini?')) return;
      try {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) throw error;
        await refreshArticles();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Gagal menghapus artikel.');
      }
    }
  });


  // Profil kelompok: satu record utama (id = 1).
  const profileForm = getElement<HTMLFormElement>('#group-profile-form');
  const groupName = getElement<HTMLInputElement>('#group-name');
  const groupIntro = getElement<HTMLTextAreaElement>('#group-intro');
  const groupHistory = getElement<HTMLTextAreaElement>('#group-history');
  const groupVision = getElement<HTMLTextAreaElement>('#group-vision');
  const groupMission = getElement<HTMLTextAreaElement>('#group-mission');
  const groupAddress = getElement<HTMLTextAreaElement>('#group-address');
  const groupHeroFile = getElement<HTMLInputElement>('#group-hero-file');
  const groupPhotoFile = getElement<HTMLInputElement>('#group-photo-file');
  const groupHeroPreview = getElement<HTMLImageElement>('#group-hero-preview');
  const groupPhotoPreview = getElement<HTMLImageElement>('#group-photo-preview');
  const groupHeroNote = getElement<HTMLElement>('#group-hero-note');
  const groupPhotoNote = getElement<HTMLElement>('#group-photo-note');
  const groupProfileMessage = getElement<HTMLParagraphElement>('#group-profile-message');
  const saveGroupProfile = getElement<HTMLButtonElement>('#save-group-profile');

  let currentHeroImage = '';
  let currentGroupImage = '';

  async function loadGroupProfile(): Promise<void> {
    groupProfileMessage.textContent = 'Memuat profil...';
    const { data, error } = await supabase.from('group_profile')
      .select('id,name,intro,history,vision,mission,address,hero_image,group_image')
      .eq('id', 1).maybeSingle();
    if (error) {
      groupProfileMessage.textContent = `Gagal memuat profil: ${error.message}`;
      return;
    }
    if (!data) {
      groupProfileMessage.textContent = 'Belum ada profil tersimpan. Isi formulir lalu klik Simpan Profil.';
      return;
    }
    const profile = data as GroupProfile;
    groupName.value = profile.name ?? '';
    groupIntro.value = profile.intro ?? '';
    groupHistory.value = profile.history ?? '';
    groupVision.value = profile.vision ?? '';
    groupMission.value = profile.mission ?? '';
    groupAddress.value = profile.address ?? '';
    currentHeroImage = profile.hero_image ?? '';
    currentGroupImage = profile.group_image ?? '';
    if (currentHeroImage) { groupHeroPreview.src = currentHeroImage; groupHeroPreview.hidden = false; }
    if (currentGroupImage) { groupPhotoPreview.src = currentGroupImage; groupPhotoPreview.hidden = false; }
    groupHeroNote.textContent = currentHeroImage ? 'Foto saat ini akan dipertahankan jika tidak memilih foto baru.' : '';
    groupPhotoNote.textContent = currentGroupImage ? 'Foto saat ini akan dipertahankan jika tidak memilih foto baru.' : '';
    groupProfileMessage.textContent = 'Profil berhasil dimuat.';
  }

  function previewGroupImage(input: HTMLInputElement, preview: HTMLImageElement, message: HTMLElement): void {
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
        message.textContent = 'Pilih gambar JPG, PNG, atau WebP maksimal 5 MB.';
        input.value = '';
        return;
      }
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
      message.textContent = 'Foto baru siap diunggah.';
    });
  }
  previewGroupImage(groupHeroFile, groupHeroPreview, groupHeroNote);
  previewGroupImage(groupPhotoFile, groupPhotoPreview, groupPhotoNote);

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = groupName.value.trim();
    const intro = groupIntro.value.trim();
    if (!name || !intro) {
      groupProfileMessage.textContent = 'Nama kelompok dan deskripsi singkat wajib diisi.';
      return;
    }
    saveGroupProfile.disabled = true;
    saveGroupProfile.textContent = 'Menyimpan...';
    try {
      const heroFile = groupHeroFile.files?.[0];
      const photoFile = groupPhotoFile.files?.[0];
      if (heroFile) currentHeroImage = await uploadProductImage(heroFile);
      if (photoFile) currentGroupImage = await uploadProductImage(photoFile);

      const payload = {
        id: 1, name, intro,
        history: groupHistory.value.trim() || null,
        vision: groupVision.value.trim() || null,
        mission: groupMission.value.trim() || null,
        address: groupAddress.value.trim() || null,
        hero_image: currentHeroImage || null,
        group_image: currentGroupImage || null,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('group_profile').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
      groupProfileMessage.textContent = 'Profil kelompok berhasil disimpan.';
      groupHeroFile.value = '';
      groupPhotoFile.value = '';
      groupHeroNote.textContent = currentHeroImage ? 'Foto tersimpan.' : '';
      groupPhotoNote.textContent = currentGroupImage ? 'Foto tersimpan.' : '';
    } catch (error) {
      groupProfileMessage.textContent = error instanceof Error ? error.message : 'Gagal menyimpan profil.';
    } finally {
      saveGroupProfile.disabled = false;
      saveGroupProfile.textContent = 'Simpan Profil';
    }
  });

  // Dokumentasi: galeri kegiatan dengan CRUD foto.
  const documentList = getElement<HTMLDivElement>('#admin-document-list');
  const documentForm = getElement<HTMLFormElement>('#document-form');
  const documentId = getElement<HTMLInputElement>('#document-id');
  const documentTitle = getElement<HTMLInputElement>('#document-title');
  const documentDescription = getElement<HTMLTextAreaElement>('#document-description');
  const documentFile = getElement<HTMLInputElement>('#document-file');
  const documentPreview = getElement<HTMLImageElement>('#document-preview');
  const documentImageNote = getElement<HTMLElement>('#document-image-note');
  const documentFormTitle = getElement<HTMLHeadingElement>('#document-form-title');
  const documentMessage = getElement<HTMLParagraphElement>('#document-form-message');
  const saveDocument = getElement<HTMLButtonElement>('#save-document');
  let documents: GroupDocument[] = [];
  let currentDocumentImage = '';

  function renderDocumentRows(items: GroupDocument[]): string {
    if (!items.length) return '<div class="admin-empty">Belum ada dokumentasi. Klik “Tambah Dokumentasi” untuk menambahkan foto kegiatan.</div>';
    return items.map((item) => `
      <article class="admin-product-row">
        <div class="admin-product-thumb">${item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.title)}">` : '▧'}</div>
        <div class="admin-product-details">
          <strong>${escapeHtml(item.title)}</strong>
          <span>Dokumentasi kegiatan</span>
          <p>${escapeHtml(item.description ?? '')}</p>
        </div>
        <div class="admin-product-actions">
          <button type="button" class="edit-document" data-id="${escapeHtml(item.id)}">Edit</button>
          <button type="button" class="delete-document" data-id="${escapeHtml(item.id)}">Hapus</button>
        </div>
      </article>
    `).join('');
  }

  async function refreshDocuments(): Promise<void> {
    documentList.textContent = 'Memuat dokumentasi...';
    try {
      const { data, error } = await supabase.from('group_documentation')
        .select('id,title,description,image_url,created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      documents = (data ?? []) as GroupDocument[];
      documentList.innerHTML = renderDocumentRows(documents);
    } catch (error) {
      documentList.textContent = `Gagal memuat dokumentasi: ${error instanceof Error ? error.message : 'Periksa tabel group_documentation dan kebijakan RLS.'}`;
    }
  }

  function resetDocumentForm(): void {
    documentForm.reset();
    documentId.value = '';
    currentDocumentImage = '';
    documentPreview.removeAttribute('src');
    documentPreview.hidden = true;
    documentImageNote.textContent = '';
    documentFormTitle.textContent = 'Tambah Dokumentasi';
    documentMessage.textContent = '';
    documentForm.hidden = true;
  }

  documentFile.addEventListener('change', () => {
    const file = documentFile.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      documentMessage.textContent = 'Pilih gambar JPG, PNG, atau WebP maksimal 5 MB.';
      documentFile.value = '';
      return;
    }
    documentPreview.src = URL.createObjectURL(file);
    documentPreview.hidden = false;
    documentMessage.textContent = '';
  });

  getElement<HTMLButtonElement>('#show-document-form').addEventListener('click', () => {
    resetDocumentForm();
    documentForm.hidden = false;
    documentTitle.focus();
  });
  getElement<HTMLButtonElement>('#cancel-document').addEventListener('click', resetDocumentForm);

  documentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = documentTitle.value.trim();
    if (!title) {
      documentMessage.textContent = 'Judul kegiatan wajib diisi.';
      return;
    }
    const file = documentFile.files?.[0];
    if (!documentId.value && !file) {
      documentMessage.textContent = 'Pilih foto untuk dokumentasi baru.';
      return;
    }
    saveDocument.disabled = true;
    saveDocument.textContent = 'Menyimpan...';
    try {
      if (file) currentDocumentImage = await uploadProductImage(file);
      const payload = {
        title,
        description: documentDescription.value.trim() || null,
        image_url: currentDocumentImage
      };
      const result = documentId.value
        ? await supabase.from('group_documentation').update(payload).eq('id', documentId.value)
        : await supabase.from('group_documentation').insert(payload);
      if (result.error) throw result.error;
      resetDocumentForm();
      await refreshDocuments();
    } catch (error) {
      documentMessage.textContent = error instanceof Error ? error.message : 'Gagal menyimpan dokumentasi.';
    } finally {
      saveDocument.disabled = false;
      saveDocument.textContent = 'Simpan Dokumentasi';
    }
  });

  documentList.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    const edit = target.closest<HTMLButtonElement>('.edit-document');
    const remove = target.closest<HTMLButtonElement>('.delete-document');
    if (edit) {
      const item = documents.find((entry) => entry.id === edit.dataset.id);
      if (!item) return;
      documentId.value = item.id;
      documentTitle.value = item.title;
      documentDescription.value = item.description ?? '';
      currentDocumentImage = item.image_url;
      documentPreview.src = currentDocumentImage;
      documentPreview.hidden = false;
      documentImageNote.textContent = 'Foto saat ini dipertahankan jika tidak memilih foto baru.';
      documentFormTitle.textContent = 'Edit Dokumentasi';
      documentForm.hidden = false;
      documentTitle.focus();
      documentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (remove) {
      const id = remove.dataset.id;
      if (!id || !window.confirm('Yakin ingin menghapus dokumentasi ini?')) return;
      try {
        const { error } = await supabase.from('group_documentation').delete().eq('id', id);
        if (error) throw error;
        await refreshDocuments();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Gagal menghapus dokumentasi.');
      }
    }
  });

  await loadGroupProfile();
  await refreshDocuments();

  await Promise.all([refreshProducts(), refreshArticles()]);

  // Pulihkan panel berdasarkan hash, jika pengguna membuka tautan menu tertentu.
  const initialView = window.location.hash.replace('#', '');
  const initialLink = document.querySelector<HTMLAnchorElement>(`.admin-menu[data-view="${initialView}"]`);
  if (initialLink) initialLink.click();
}
