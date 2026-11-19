
// const products = [
//   {
//     name: "Briket Biocarbon Padat",
//     category: "PRODUK 01",
//     image: "/images/briket-padat.jpg",
//     description: "Informasi mengenai karakteristik dan penggunaan produk briket biocarbon."
//   },
//   {
//     name: "Briket Biocarbon Berlubang",
//     category: "PRODUK 02",
//     image: "/images/briket-berlubang.jpg",
//     description: "Informasi mengenai karakteristik dan penggunaan produk briket biocarbon."
//   }
// ];

// import { getProducts } from '../data/products';

// export function Catalog() {
//   const products = getProducts();

//   return `
//     <section class="catalog-hero">
//       <div>
//         <span class="eyebrow">KATALOG MEKARBRIQ</span>
//         <h1>Kenali produk <span>briket biocarbon kami.</span></h1>
//         <p>
//           Temukan informasi produk briket biocarbon
//           dari Kelompok Tani Ternak Mekar Sari 1.
//         </p>
//       </div>
//       <div class="catalog-hero-decoration">♨</div>
//     </section>

//     <section class="catalog-content">
//       <div class="catalog-heading">
//         <div>
//           <span class="eyebrow">PRODUK KAMI</span>
//           <h2>Produk <span>Unggulan</span></h2>
//         </div>
//         <p>Jelajahi informasi produk yang tersedia.</p>
//       </div>

//       <div class="catalog-grid">
//         ${
//           products.length
//             ? products.map(product => `
//               <article class="catalog-card">
//                 <div class="catalog-image">
//                   ${
//                     product.image
//                       ? `<img src="${product.image}" alt="${escapeHtml(product.name)}"
//                            onerror="this.style.display='none'">`
//                       : ''
//                   }
//                   <span>${escapeHtml(product.category)}</span>
//                 </div>
//                 <div class="catalog-card-content">
//                   <h3>${escapeHtml(product.name)}</h3>
//                   <p>${escapeHtml(product.description)}</p>
//                   <a href="#kontak" class="catalog-link">
//                     Tanyakan Produk <span>→</span>
//                   </a>
//                 </div>
//               </article>
//             `).join('')
//             : '<p>Belum ada produk yang ditampilkan.</p>'
//         }
//       </div>

//       <p class="data-note">
//         Nama, bentuk, foto, dan informasi produk perlu
//         disesuaikan dengan hasil konfirmasi mitra.
//       </p>
//     </section>

//     <section class="catalog-benefits">
//       <div>
//         <span class="eyebrow">INFORMASI PRODUK</span>
//         <h2>Kenali produk sebelum <span>memesan.</span></h2>
//         <p>
//           Hubungi pengelola untuk mendapatkan informasi
//           ketersediaan, harga, dan detail produk.
//         </p>
//       </div>
//       <div class="benefit-points">
//         <div>01 <span>Informasi produk</span></div>
//         <div>02 <span>Konfirmasi ketersediaan</span></div>
//         <div>03 <span>Hubungi kelompok</span></div>
//       </div>
//     </section>

//     <section class="catalog-contact" id="kontak">
//       <div>
//         <span class="eyebrow">TERTARIK DENGAN PRODUK KAMI?</span>
//         <h2>Hubungi MEKARBRIQ</h2>
//         <p>Dapatkan informasi lebih lanjut mengenai produk.</p>
//       </div>
//       <a href="https://wa.me/" class="btn-primary">
//         Hubungi via WhatsApp →
//       </a>
//     </section>
//   `;
// }

// function escapeHtml(value: string): string {
//   return value.replace(/[&<>"']/g, char => {
//     const entities: Record<string, string> = {
//       '&': '&amp;',
//       '<': '&lt;',
//       '>': '&gt;',
//       '"': '&quot;',
//       "'": '&#39;'
//     };
//     return entities[char];
//   });
// }


import { getProducts, type Product } from '../data/products';
import DOMPurify from 'dompurify';
import ecoCarbonImage from '../images/eco-carbon-dua-varian.png';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c] ?? c));

function cards(ps: Product[]): string {
  return ps.length
    ? ps.map(p => `
      <article class="catalog-card">
        <div class="catalog-image">
          ${p.image
            ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`
            : '<span class="catalog-image-placeholder">♨</span>'
          }
          <span>${esc(p.category)}</span>
        </div>

        <div class="catalog-card-content">
          <h3>${esc(p.name)}</h3>
          <div class="product-rich-content">
            ${DOMPurify.sanitize(p.description)}
          </div>
          <a href="#kontak" class="catalog-link">
            Tanyakan Produk <span>→</span>
          </a>
        </div>
      </article>
    `).join('')
    : '<p>Belum ada produk yang ditampilkan.</p>';
}

export async function Catalog(): Promise<string> {
  let ps: Product[] = [];
  let err = '';

  try {
    ps = await getProducts();
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    err = 'Informasi produk belum dapat dimuat. Silakan coba beberapa saat lagi.';
  }

  return `
    <section class="catalog-hero">
      <div class="catalog-hero-content">
        <span class="eyebrow">KATALOG MEKARBRIQ</span>
        <h1>
          Kenali produk
          <span>briket biocarbon kami.</span>
        </h1>
        <p>
          Temukan informasi produk briket biocarbon dari
          Kelompok Tani Ternak Mekar Sari 1.
        </p>
      </div>

      <div class="catalog-hero-decoration">
        <img
          src="${ecoCarbonImage}"
          alt="Dua varian produk ECO-CARBON: Original kotoran sapi dan Blend ampas kopi serta sekam padi"
        >
      </div>
    </section>

    <section class="catalog-content">
      <div class="catalog-heading">
        <div>
          <span class="eyebrow">PRODUK KAMI</span>
          <h2>Produk <span>Unggulan</span></h2>
        </div>
        <p>Jelajahi informasi produk yang tersedia.</p>
      </div>

      <div class="catalog-grid">
        ${err ? esc(err) : cards(ps)}
      </div>
    </section>

    <section class="catalog-benefits">
      <div>
        <span class="eyebrow">INFORMASI PRODUK</span>
        <h2>Kenali produk sebelum <span>memesan.</span></h2>
        <p>
          Hubungi pengelola untuk mendapatkan informasi
          ketersediaan, harga, dan detail produk.
        </p>
      </div>

      <div class="benefit-points">
        <div>01 <span>Informasi produk</span></div>
        <div>02 <span>Konfirmasi ketersediaan melalui WhatsApp</span></div>
        <div>03 <span>Pesan</span></div>
      </div>
    </section>

    <section class="catalog-contact" id="kontak">
      <div>
        <span class="eyebrow">TERTARIK DENGAN PRODUK KAMI?</span>
        <h2>Hubungi MEKARBRIQ</h2>
        <p>
          Dapatkan informasi lebih lanjut mengenai produk.
        </p>
      </div>

      <a href="https://wa.me/" class="btn-primary">
        Hubungi via WhatsApp →
      </a>
    </section>
  `;
}
