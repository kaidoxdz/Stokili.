
import React from 'react';
import { useInventory } from '../hooks/useInventory';
import Card from './ui/Card';
import { OrderStatus } from '../types';

const Dashboard: React.FC = () => {
    const { products, orders } = useInventory();

    const totalRevenue = orders
        .filter(order => order.status !== OrderStatus.Cancelled)
        .reduce((sum, order) => sum + order.total, 0);

    const productsLowOnStock = products.filter(p => p.stock < 20).length;

    const recentOrders = orders.slice(0, 5);

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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    title="Revenu Total"
                    value={totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' })}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 0h6m-6 0H9" /></svg>}
                    colorClass="bg-green-500"
                />
                 <Card 
                    title="Commandes"
                    value={orders.length}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>}
                    colorClass="bg-blue-500"
                />
                 <Card 
                    title="Produits"
                    value={products.length}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M7.5 14.25V5.25A2.25 2.25 0 0 1 9.75 3h4.5A2.25 2.25 0 0 1 16.5 5.25v9M7.5 14.25h-1.5" /></svg>}
                    colorClass="bg-indigo-500"
                />
                 <Card 
                    title="Stock Faible"
                    value={productsLowOnStock}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
                    colorClass="bg-yellow-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Commandes Récentes</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                           <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.total.toLocaleString('fr-FR', { style: 'currency', currency: 'DZD' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Produits à surveiller (Stock Faible)</h3>
                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {products.filter(p => p.stock < 20).slice(0, 5).map(product => (
                                     <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-600">{product.stock}</td>
                                    </tr>
                                ))}
                                {products.filter(p => p.stock < 20).length === 0 && (
                                    <tr>
                                        <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">Aucun produit avec un stock faible.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
