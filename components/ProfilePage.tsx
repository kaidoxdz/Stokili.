import React, { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { User } from '../types';

const ProfilePage: React.FC = () => {
    const { user, settings, updateUser, updateSettings } = useInventory();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>(user);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const [category, key] = name.split('.');
        
        if (category === 'notifications' && (key === 'lowStock' || key === 'weeklySummary')) {
             updateSettings({
                ...settings,
                notifications: {
                    ...settings.notifications,
                    [key]: checked,
                },
            });
        }
    };
    
    const handleThemeChange = (theme: 'light' | 'dark') => {
        updateSettings({ theme });
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <form onSubmit={handleSave}>
                    <div className="flex items-start space-x-6">
                        <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full" />
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Informations du profil</h2>
                                {!isEditing && (
                                    <button type="button" onClick={() => setIsEditing(true)} className="text-indigo-600 dark:text-indigo-400 hover:underline">Modifier</button>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</label>
                                    {isEditing ? (
                                        <input type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className={inputClasses} />
                                    ) : (
                                        <p className="text-lg">{user.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Adresse e-mail</label>
                                    {isEditing ? (
                                        <input type="email" name="email" value={formData.email || ''} onChange={handleFormChange} className={inputClasses} />
                                    ) : (
                                        <p className="text-lg">{user.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Rôle</label>
                                    <p className="text-lg">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isEditing && (
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Annuler</button>
                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Enregistrer</button>
                        </div>
                    )}
                </form>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Paramètres</h2>
                <div className="space-y-6">
                   <div>
                        <h3 className="text-lg font-medium">Thème</h3>
                        <div className="mt-2 flex items-center space-x-4">
                            <button onClick={() => handleThemeChange('light')} className={`px-4 py-2 rounded-md ${settings.theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Clair</button>
                            <button onClick={() => handleThemeChange('dark')} className={`px-4 py-2 rounded-md ${settings.theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Sombre</button>
                        </div>
                   </div>
                   <div>
                        <h3 className="text-lg font-medium">Notifications</h3>
                        <div className="mt-2 space-y-2">
                             <label className="flex items-center">
                                <input type="checkbox" name="notifications.lowStock" checked={settings.notifications.lowStock} onChange={handleSettingsChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2">Recevoir une alerte pour les stocks faibles</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" name="notifications.weeklySummary" checked={settings.notifications.weeklySummary} onChange={handleSettingsChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                <span className="ml-2">Recevoir un résumé hebdomadaire par e-mail</span>
                            </label>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;