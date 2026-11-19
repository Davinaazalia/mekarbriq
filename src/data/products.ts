// export interface Product {
//   id: string;
//   name: string;
//   category: string;
//   image: string;
//   description: string;
// }

// const STORAGE_KEY = 'mekarbriq_products';

// const initialProducts: Product[] = [
//   {
//     id: 'produk-01',
//     name: 'Briket Biocarbon Padat',
//     category: 'PRODUK 01',
//     image: '/images/briket-padat.jpg',
//     description: 'Informasi mengenai karakteristik dan penggunaan produk briket biocarbon.'
//   },
//   {
//     id: 'produk-02',
//     name: 'Briket Biocarbon Berlubang',
//     category: 'PRODUK 02',
//     image: '/images/briket-berlubang.jpg',
//     description: 'Informasi mengenai karakteristik dan penggunaan produk briket biocarbon.'
//   }
// ];

// export function getProducts(): Product[] {
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved === null) {
//       return initialProducts;
//     }

//     const parsed: unknown = JSON.parse(saved);
//     return Array.isArray(parsed) ? parsed as Product[] : initialProducts;
//   } catch {
//     return initialProducts;
//   }
// }

// export function saveProducts(products: Product[]): void {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
// }

// export function addProduct(
//   product: Omit<Product, 'id'>
// ): Product[] {
//   const products = getProducts();
//   const newProduct: Product = {
//     ...product,
//     id: `produk-${Date.now()}`
//   };

//   const updated = [...products, newProduct];
//   saveProducts(updated);
//   return updated;
// }

// export function updateProduct(
//   id: string,
//   changes: Omit<Product, 'id'>
// ): Product[] {
//   const updated = getProducts().map(product =>
//     product.id === id ? { ...product, ...changes } : product
//   );

//   saveProducts(updated);
//   return updated;
// }

// export function deleteProduct(id: string): Product[] {
//   const updated = getProducts().filter(product => product.id !== id);
//   saveProducts(updated);
//   return updated;
// }

import { supabase } from '../lib/supabase';
export interface Product { id: string; name: string; category: string; image: string; description: string; }
type ProductInput = Omit<Product, 'id'>;
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('id,name,category,image_url,description').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r: any) => ({ id: String(r.id), name: r.name ?? '', category: r.category ?? '', image: r.image_url ?? '', description: r.description ?? '' }));
}
export async function addProduct(p: ProductInput): Promise<void> {
  const { error } = await supabase.from('products').insert({ name:p.name, category:p.category, image_url:p.image, description:p.description });
  if (error) throw error;
}
export async function updateProduct(id:string,p:ProductInput):Promise<void> {
  const { error } = await supabase.from('products').update({ name:p.name, category:p.category, image_url:p.image, description:p.description }).eq('id',id);
  if (error) throw error;
}
export async function deleteProduct(id:string):Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id',id); if(error) throw error;
}
export async function uploadProductImage(file:File):Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar.');
  if (file.size > 5*1024*1024) throw new Error('Ukuran gambar maksimal 5 MB.');
  const ext=file.name.split('.').pop()?.toLowerCase() || 'jpg'; const name=`${crypto.randomUUID()}.${ext}`;
  const { error }=await supabase.storage.from('product-image').upload(name,file,{cacheControl:'3600',upsert:false,contentType:file.type});
  if(error) throw error;
  return supabase.storage.from('product-image').getPublicUrl(name).data.publicUrl;
}
