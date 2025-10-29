import React, { useState, useEffect } from 'react';
import { Order, OrderItem, OrderStatus } from '../types';
import { useInventory } from '../hooks/useInventory';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Omit<Order, 'id' | 'total'> | Order) => void;
  orderToEdit?: Order | null;
}

const emptyOrder: Omit<Order, 'id' | 'total'> = {
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    status: OrderStatus.Pending,
    items: [],
};

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSave, orderToEdit }) => {
  const { products, getProductById } = useInventory();
  const [orderData, setOrderData] = useState<Omit<Order, 'id' | 'total'> | Order>(emptyOrder);
  const [newItem, setNewItem] = useState<{productId: string, quantity: number}>({ productId: '', quantity: 1 });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
        if (orderToEdit) {
            // Ensure date is in YYYY-MM-DD format for the input
            const formattedOrder = {...orderToEdit, date: new Date(orderToEdit.date).toISOString().split('T')[0]};
            setOrderData(formattedOrder);
        } else {
            setOrderData(emptyOrder);
        }
    }
  }, [orderToEdit, isOpen]);

  useEffect(() => {
    const newTotal = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [orderData.items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({...prev, [name]: name === 'quantity' ? parseInt(value) : value }));
  }

  const handleAddItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) return;
    const product = getProductById(newItem.productId);
    if (!product) return;

    const existingItemIndex = orderData.items.findIndex(item => item.productId === newItem.productId);
    
    let newItems: OrderItem[];
    if (existingItemIndex > -1) {
        // Update quantity if item already exists
        newItems = orderData.items.map((item, index) => 
            index === existingItemIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
    } else {
        // Add new item
        newItems = [...orderData.items, {
            productId: product.id,
            quantity: newItem.quantity,
            price: product.price, // Lock in price at time of adding
        }];
    }

    setOrderData(prev => ({...prev, items: newItems }));
    setNewItem({ productId: '', quantity: 1 }); // Reset form
  };
  
  const handleRemoveItem = (productId: string) => {
    setOrderData(prev => ({...prev, items: prev.items.filter(item => item.productId !== productId)}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(orderData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{orderToEdit ? `Modifier la commande #${orderToEdit.id}` : 'Ajouter une commande'}</h3>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Nom du Client</label>
                <input type="text" name="customerName" id="customerName" value={orderData.customerName} onChange={handleChange} className="mt-1 block w-full input" required />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" id="date" value={orderData.date} onChange={handleChange} className="mt-1 block w-full input" required />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
                <select name="status" id="status" value={orderData.status} onChange={handleChange} className="mt-1 block w-full input" required>
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold mb-2">Articles</h4>
              <div className="space-y-2 mb-4">
                {orderData.items.map(item => {
                    const product = getProductById(item.productId);
                    return (
                        <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div>
                               <p className="font-medium">{product?.name || 'Produit Supprimé'}</p>
                               <p className="text-sm text-gray-500">{item.quantity} &times; {item.price.toFixed(2)} DZD</p>
                            </div>
                            <div className="flex items-center space-x-4">
                               <p className="font-semibold">{(item.quantity * item.price).toFixed(2)} DZD</p>
                               <button type="button" onClick={() => handleRemoveItem(item.productId)} className="text-red-500 hover:text-red-700" title="Supprimer l'article">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                               </button>
                            </div>
                        </div>
                    );
                })}
                 {orderData.items.length === 0 && <p className="text-gray-500 text-center py-4">Aucun article dans la commande.</p>}
              </div>

              <div className="flex items-end gap-2 p-2 border rounded-md">
                <div className="flex-1">
                  <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Produit</label>
                  <select name="productId" value={newItem.productId} onChange={handleItemChange} className="mt-1 block w-full input">
                      <option value="" disabled>Sélectionner un produit</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.stock} en stock)</option>)}
                  </select>
                </div>
                <div className="w-24">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantité</label>
                  <input type="number" name="quantity" value={newItem.quantity} onChange={handleItemChange} className="mt-1 block w-full input" min="1" />
                </div>
                <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 h-10">Ajouter</button>
              </div>
            </div>
            
            <div className="text-right text-2xl font-bold mt-4">
                Total: {total.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' })}
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

export default OrderModal;