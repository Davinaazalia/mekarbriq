
// export function AdminLogin() {
//   return `
//     <section class="admin-login-page">
//       <div class="admin-login-card">
//         <div class="admin-logo">🌱</div>

//         <span class="eyebrow">MEKARBRIQ MANAGEMENT</span>
//         <h1>Selamat Datang!</h1>
//         <p>Masuk untuk mengelola website MEKARBRIQ.</p>

//         <form id="admin-login-form">
//           <label for="admin-username">Username</label>
//           <input
//             type="text"
//             id="admin-username"
//             placeholder="Masukkan username"
//             required
//           >

//           <label for="admin-password">Password</label>
//           <input
//             type="password"
//             id="admin-password"
//             placeholder="Masukkan password"
//             required
//           >

//           <p id="login-error" class="login-error"></p>

//           <button type="submit" class="btn-primary">
//             Masuk Dashboard →
//           </button>
//         </form>

//         <a href="/" class="back-home">← Kembali ke website</a>
//       </div>
//     </section>
//   `;
  
// }
// export function setupAdminLogin() {
//   const form = document.querySelector<HTMLFormElement>(
//     '#admin-login-form'
//   );

//   if (!form) return;

//   form.addEventListener('submit', (event) => {
//     event.preventDefault();

//     const username = (
//       document.querySelector<HTMLInputElement>('#admin-username')!
//     ).value;

//     const password = (
//       document.querySelector<HTMLInputElement>('#admin-password')!
//     ).value;

//     const error = document.querySelector<HTMLParagraphElement>(
//       '#login-error'
//     )!;

//     if (username === 'admin' && password === 'mekarbriq123') {
//       sessionStorage.setItem('mekarbriq_admin', 'true');
//       window.location.href = '/admin';
//     } else {
//       error.textContent = 'Username atau password salah.';
//     }
//   });
// }
import { supabase } from '../../lib/supabase';
export function AdminLogin(): string { return `
<section class="admin-login-page"><div class="admin-login-card"><div class="admin-logo"></div>
<span class="eyebrow">MEKARBRIQ MANAGEMENT</span><h1>Selamat Datang!</h1><p>Masuk untuk mengelola website MEKARBRIQ.</p>
<form id="admin-login-form"><label for="admin-email">Email admin</label><input type="email" id="admin-email" placeholder="Masukkan email" required>
<label for="admin-password">Password</label><input type="password" id="admin-password" placeholder="Masukkan password" required>
<p id="login-error" class="login-error" role="alert"></p><button type="submit" class="btn-primary" id="login-submit">Masuk Dashboard →</button></form>
<a href="/mekarbriq/" class="back-home">← Kembali ke website</a></div></section>`; }
export function setupAdminLogin(): void {
 const form=document.querySelector<HTMLFormElement>('#admin-login-form'); if(!form)return;
 form.addEventListener('submit',async e=>{ e.preventDefault();
  const email=document.querySelector<HTMLInputElement>('#admin-email')!.value.trim();
  const password=document.querySelector<HTMLInputElement>('#admin-password')!.value;
  const msg=document.querySelector<HTMLParagraphElement>('#login-error')!;
  const btn=document.querySelector<HTMLButtonElement>('#login-submit')!; msg.textContent=''; btn.disabled=true; btn.textContent='Memproses...';
  const { error } = await supabase.auth.signInWithPassword({
  email,
  password
});

if (error) {
  console.error('DETAIL LOGIN SUPABASE:', error);

  msg.textContent = error.message;

  btn.disabled = false;
  btn.textContent = 'Masuk Dashboard';
  return;
}
  window.location.href = '/mekarbriq/admin';
 });
}