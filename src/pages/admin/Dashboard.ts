import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  type Product
} from '../../data/products';

export function AdminDashboard() {
  const products = getProducts();

  return `
    <div class="admin-layout">
      <aside class="admin-sidebar">
        <div class="admin-brand">🌱 MEKAR<span>BRIQ</span></div>
        <p class="sidebar-label">MENU UTAMA</p>

        <a href="#dashboard" class="admin-menu active">▦ Dashboard</a>
        <a href="#produk" class="admin-menu">▣ Kelola Produk</a>
        <a href="#edukasi" class="admin-menu">▤ Kelola Edukasi</a>
        <a href="#profil" class="admin-menu">◉ Profil Kelompok</a>
        <a href="#dokumentasi" class="admin-menu">▧ Dokumentasi</a>

        <button id="admin-logout" class="admin-logout" type="button">
          Keluar
        </button>
      </aside>

      <main class="admin-main">
        <header class="admin-topbar">
          <div>
            <span class="eyebrow">ADMIN PANEL</span>
            <h1>Dashboard</h1>
          </div>
          <span class="admin-avatar">A</span>
        </header>

        <section class="admin-welcome">
          <h2>Selamat datang, Admin! 👋</h2>
          <p>Kelola informasi dan konten website MEKARBRIQ melalui halaman ini.</p>
        </section>

        <section class="admin-stats">
          <article class="stat-card">
            <span>Total Produk</span>
            <strong id="admin-product-count">${products.length}</strong>
            <small>Produk katalog</small>
          </article>
          <article class="stat-card">
            <span>Artikel Edukasi</span>
            <strong>0</strong>
            <small>Materi edukasi</small>
          </article>
          <article class="stat-card">
            <span>Halaman Website</span>
            <strong>4</strong>
            <small>Halaman publik</small>
          </article>
        </section>

        <section class="admin-products" id="produk">
          <div class="admin-section-heading">
            <div>
              <span class="eyebrow">MANAJEMEN KONTEN</span>
              <h2>Kelola Produk</h2>
              <p>Tambah, ubah, atau hapus produk yang tampil di katalog.</p>
            </div>
            <button id="show-product-form" class="btn-primary" type="button">
              + Tambah Produk
            </button>
          </div>

          <form id="product-form" class="product-form" hidden>
            <h3 id="product-form-title">Tambah Produk</h3>
            <input type="hidden" id="product-id">

            <label for="product-name">Nama produk</label>
            <input id="product-name" type="text" maxlength="90"
              placeholder="Contoh: Briket Biocarbon" required>

            <label for="product-category">Kategori / label</label>
            <input id="product-category" type="text" maxlength="30"
              placeholder="Contoh: PRODUK 01" required>

            <label for="product-image">Lokasi gambar</label>
            <input id="product-image" type="text"
              placeholder="/images/nama-gambar.jpg">

            <label for="product-description">Deskripsi</label>
            <textarea id="product-description" rows="4" maxlength="500"
              placeholder="Tuliskan informasi produk..." required></textarea>

            <div class="product-form-actions">
              <button class="btn-primary" type="submit" id="save-product">
                Simpan Produk
              </button>
              <button class="btn-secondary" type="button" id="cancel-product">
                Batal
              </button>
            </div>
            <p id="product-form-message" class="product-form-message"></p>
          </form>

          <div id="admin-product-list" class="admin-product-list">
            ${renderProductRows(products)}
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderProductRows(products: Product[]): string {
  if (products.length === 0) {
    return '<div class="admin-empty">Belum ada produk. Klik “Tambah Produk” untuk membuat produk pertama.</div>';
  }

  return products.map(product => `
    <article class="admin-product-row">
      <div class="admin-product-thumb">
        ${
          product.image
            ? `<img src="${escapeHtml(product.image)}" alt=""
                 onerror="this.style.display='none'">`
            : '♨'
        }
      </div>
      <div class="admin-product-details">
        <strong>${escapeHtml(product.name)}</strong>
        <span>${escapeHtml(product.category)}</span>
        <p>${escapeHtml(product.description)}</p>
      </div>
      <div class="admin-product-actions">
        <button type="button" class="edit-product" data-id="${escapeHtml(product.id)}">
          Edit
        </button>
        <button type="button" class="delete-product" data-id="${escapeHtml(product.id)}">
          Hapus
        </button>
      </div>
    </article>
  `).join('');
}

export function setupAdminDashboard(): void {
  const logoutButton = document.querySelector<HTMLButtonElement>('#admin-logout');
  const showFormButton = document.querySelector<HTMLButtonElement>('#show-product-form');
  const cancelButton = document.querySelector<HTMLButtonElement>('#cancel-product');
  const form = document.querySelector<HTMLFormElement>('#product-form');
  const list = document.querySelector<HTMLDivElement>('#admin-product-list');
  const message = document.querySelector<HTMLParagraphElement>('#product-form-message');

  logoutButton?.addEventListener('click', () => {
    sessionStorage.removeItem('mekarbriq_admin');
    window.location.href = '/admin/login';
  });

  if (!form || !list) return;

  const nameInput = document.querySelector<HTMLInputElement>('#product-name')!;
  const categoryInput = document.querySelector<HTMLInputElement>('#product-category')!;
  const imageInput = document.querySelector<HTMLInputElement>('#product-image')!;
  const descriptionInput = document.querySelector<HTMLTextAreaElement>('#product-description')!;
  const idInput = document.querySelector<HTMLInputElement>('#product-id')!;
  const title = document.querySelector<HTMLHeadingElement>('#product-form-title')!;
  const count = document.querySelector<HTMLElement>('#admin-product-count')!;

  function refreshList(): void {
    const products = getProducts();
    list!.innerHTML = renderProductRows(products);
    count.textContent = String(products.length);
  }

  function resetForm(): void {
    form!.reset();
    idInput.value = '';
    title.textContent = 'Tambah Produk';
    form!.hidden = true;
    if (message) message.textContent = '';
  }

  showFormButton?.addEventListener('click', () => {
    resetForm();
    form.hidden = false;
    title.textContent = 'Tambah Produk';
    nameInput.focus();
  });

  cancelButton?.addEventListener('click', resetForm);

  form.addEventListener('submit', event => {
    event.preventDefault();

    const values = {
      name: nameInput.value.trim(),
      category: categoryInput.value.trim(),
      image: imageInput.value.trim(),
      description: descriptionInput.value.trim()
    };

    if (!values.name || !values.category || !values.description) {
      if (message) message.textContent = 'Lengkapi nama, kategori, dan deskripsi produk.';
      return;
    }

    if (idInput.value) {
      updateProduct(idInput.value, values);
    } else {
      addProduct(values);
    }

    resetForm();
    refreshList();

    if (message) message.textContent = 'Produk berhasil disimpan di browser ini.';
  });

  list.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const editButton = target.closest<HTMLButtonElement>('.edit-product');
    const deleteButton = target.closest<HTMLButtonElement>('.delete-product');

    if (editButton) {
      const product = getProducts().find(item => item.id === editButton.dataset.id);
      if (!product) return;

      idInput.value = product.id;
      nameInput.value = product.name;
      categoryInput.value = product.category;
      imageInput.value = product.image;
      descriptionInput.value = product.description;
      title.textContent = 'Edit Produk';
      form.hidden = false;
      nameInput.focus();
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (deleteButton) {
      const id = deleteButton.dataset.id;
      const confirmed = window.confirm('Yakin ingin menghapus produk ini?');
      if (!confirmed || !id) return;

      deleteProduct(id);
      refreshList();
      resetForm();
    }
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[char];
  });
}
