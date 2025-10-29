import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { OrderStatus, Order } from '../types';
import OrderModal from './OrderModal';
import ConfirmationModal from './ui/ConfirmationModal';

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Pending:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.Processing:
      return 'bg-blue-100 text-blue-800';
    case OrderStatus.Shipped:
      return 'bg-indigo-100 text-indigo-800';
    case OrderStatus.Delivered:
      return 'bg-green-100 text-green-800';
    case OrderStatus.Cancelled:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderList: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, addOrder, updateOrder } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  
  const handleOpenAddModal = () => {
    setOrderToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (order: Order) => {
    setOrderToEdit(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOrderToEdit(null);
  };

  const handleSaveOrder = (orderData: Omit<Order, 'id' | 'total'> | Order) => {
      if ('id' in orderData && orderData.id) {
          updateOrder(orderData as Order);
      } else {
          addOrder(orderData as Omit<Order, 'id' | 'total'>);
      }
      handleCloseModal();
  };
  
  const handleDeleteRequest = (order: Order) => {
      setOrderToDelete(order);
  }

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
      setOrderToDelete(null);
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Liste des Commandes</h2>
            <button onClick={handleOpenAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Ajouter une commande</span>
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`px-2 py-1 text-xs leading-5 font-semibold rounded-md border-transparent focus:ring-0 focus:border-transparent ${getStatusColor(order.status)}`}
                    >
                      {Object.values(OrderStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleOpenEditModal(order)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" title="Modifier">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                        </button>
                        <button onClick={() => handleDeleteRequest(order)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" title="Supprimer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveOrder}
        orderToEdit={orderToEdit}
      />
      <ConfirmationModal
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Supprimer la commande"
        message={
            <>
              <p>Êtes-vous sûr de vouloir supprimer la commande suivante ?</p>
              <p className="font-semibold mt-2">Commande #{orderToDelete?.id} pour {orderToDelete?.customerName}</p>
              <p className="text-sm text-red-600 mt-2">Cette action est irréversible.</p>
            </>
        }
      />
    </>
  );
};

export default OrderList;