export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

const STORAGE_KEY = 'mekarbriq_products';

const initialProducts: Product[] = [
  {
    id: 'produk-01',
    name: 'Briket Biocarbon Padat',
    category: 'PRODUK 01',
    image: '/images/briket-padat.jpg',
    description: 'Informasi mengenai karakteristik dan penggunaan produk briket biocarbon.'
  },
  {
    id: 'produk-02',
    name: 'Briket Biocarbon Berlubang',
    category: 'PRODUK 02',
    image: '/images/briket-berlubang.jpg',
    description: 'Informasi mengenai karakteristik dan penggunaan produk briket biocarbon.'
  }
];

export function getProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return initialProducts;
    }

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed as Product[] : initialProducts;
  } catch {
    return initialProducts;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(
  product: Omit<Product, 'id'>
): Product[] {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `produk-${Date.now()}`
  };

  const updated = [...products, newProduct];
  saveProducts(updated);
  return updated;
}

export function updateProduct(
  id: string,
  changes: Omit<Product, 'id'>
): Product[] {
  const updated = getProducts().map(product =>
    product.id === id ? { ...product, ...changes } : product
  );

  saveProducts(updated);
  return updated;
}

export function deleteProduct(id: string): Product[] {
  const updated = getProducts().filter(product => product.id !== id);
  saveProducts(updated);
  return updated;
}
