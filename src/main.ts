
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

const app = document.querySelector<HTMLDivElement>('#app')!;

// Render halaman pengunjung
function render(content: string) {
  app.innerHTML = `
    ${Navbar()}
    <main>${content}</main>
    ${Footer()}
  `;

  window.scrollTo(0, 0);
}

// Render halaman admin tanpa navbar pengunjung
function renderAdmin(content: string) {
  app.innerHTML = content;
  window.scrollTo(0, 0);
}

// HALAMAN PENGUNJUNG
page('/', () => render(Home()));
page('/profil', () => render(Profile()));
page('/katalog', () => render(Catalog()));
page('/edukasi', () => render(Education()));

// HALAMAN LOGIN ADMIN
page('/admin/login', () => {
  renderAdmin(AdminLogin());
  setupAdminLogin();
});

// HALAMAN DASHBOARD ADMIN
page('/admin', () => {
  const isLoggedIn = sessionStorage.getItem('mekarbriq_admin');

  if (isLoggedIn !== 'true') {
    page.redirect('/admin/login');
    return;
  }

  renderAdmin(AdminDashboard());
  setupAdminDashboard();
});

// HALAMAN 404
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
