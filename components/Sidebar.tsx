import React from 'react';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const NavItem: React.FC<{
  page: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  icon: React.ReactNode;
  label: string;
  isSidebarOpen: boolean;
}> = ({ page, currentPage, setCurrentPage, icon, label, isSidebarOpen }) => {
  const isActive = currentPage === page;
  return (
    <li
      onClick={() => setCurrentPage(page)}
      className={`
        flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200
        ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
        ${isSidebarOpen ? 'justify-start' : 'justify-center'}
      `}
    >
      {icon}
      <span className={`transition-all duration-300 ${isSidebarOpen ? 'ml-4 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, toggleSidebar }) => {
  const iconClasses = "w-6 h-6 flex-shrink-0";
  
  const navItems = [
    { page: 'dashboard' as Page, label: 'Tableau de bord', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg> },
    { page: 'products' as Page, label: 'Produits', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l.383-1.437M7.5 14.25V5.25A2.25 2.25 0 0 1 9.75 3h4.5A2.25 2.25 0 0 1 16.5 5.25v9M7.5 14.25h-1.5" /></svg> },
    { page: 'orders' as Page, label: 'Commandes', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={iconClasses}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg> },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-800 text-white flex flex-col transition-all duration-300 z-10 ${isOpen ? 'w-64' : 'w-20'}`}>
       <div className={`flex items-center p-4 border-b border-gray-700 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {isOpen && <span className="text-xl font-bold">Stokili Pro</span>}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M15.75 19.5 8.25 12l7.5-7.5" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
          </svg>
        </button>
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul>
          {navItems.map(item => (
             <NavItem key={item.page} {...item} currentPage={currentPage} setCurrentPage={setCurrentPage} isSidebarOpen={isOpen} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;