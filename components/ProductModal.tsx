import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'> | Product) => void;
  productToEdit?: Product | null;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [product, setProduct] = useState<Omit<Product, 'id' | 'imageUrl'> & { imageUrl: string }>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock: 0,
    imageUrl: '',
  });

  useEffect(() => {
    if (isOpen) {
        if (productToEdit) {
            setProduct(productToEdit);
        } else {
            setProduct({
                name: '',
                sku: '',
                category: '',
                price: 0,
                stock: 0,
                imageUrl: `https://picsum.photos/seed/${Date.now()}/400/400`,
            });
        }
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{productToEdit ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" name="name" id="name" value={product.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" name="sku" id="sku" value={product.sku} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
                <input type="text" name="category" id="category" value={product.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix (DZD)</label>
                <input type="number" name="price" id="price" value={product.price} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" step="0.01" min="0" required />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" id="stock" value={product.stock} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" step="1" min="0" required />
              </div>
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL de l'image</label>
              <input type="url" name="imageUrl" id="imageUrl" value={product.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;