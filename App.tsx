import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import { InventoryProvider } from './hooks/useInventory';

export type Page = 'dashboard' | 'products' | 'orders';

const pageTitles: Record<Page, string> = {
  dashboard: 'Tableau de bord',
  products: 'Produits',
  orders: 'Commandes',
};

const Header: React.FC<{
    currentPage: Page;
    toggleSidebar: () => void;
}> = ({ currentPage, toggleSidebar }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
             <div className="flex items-center">
                <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">{pageTitles[currentPage]}</h1>
            </div>
            {/* User profile section removed */}
          </header>
    );
}


const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <ProductList />;
      case 'orders': return <OrderList />;
      default: return <Dashboard />;
    }
  };
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Header currentPage={currentPage} toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-6 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
  );
};


const App: React.FC = () => {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
};

export default App;