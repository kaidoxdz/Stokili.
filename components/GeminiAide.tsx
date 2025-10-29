
import React, { useState } from 'react';
import Spinner from './ui/Spinner';
import { useInventory } from '../hooks/useInventory';
import { generateProductDescription, getStockForecast, getOrdersSummary } from '../services/geminiService';

type AiTask = 'description' | 'forecast' | 'summary';

const GeminiAide: React.FC = () => {
    const [activeTask, setActiveTask] = useState<AiTask>('description');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    
    // Form state for product description
    const [productName, setProductName] = useState('');
    const [keywords, setKeywords] = useState('');

    const { products, orders } = useInventory();

    const handleTaskExecution = async () => {
        setIsLoading(true);
        setResult('');
        try {
            let response = '';
            switch (activeTask) {
                case 'description':
                    if (productName.trim() && keywords.trim()) {
                        response = await generateProductDescription(productName, keywords);
                    } else {
                        response = "Veuillez entrer un nom de produit et des mots-clés.";
                    }
                    break;
                case 'forecast':
                    response = await getStockForecast(products, orders);
                    break;
                case 'summary':
                    response = await getOrdersSummary(orders);
                    break;
            }
            setResult(response);
        } catch (error) {
            console.error('AI Task failed:', error);
            setResult("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderForm = () => {
        switch (activeTask) {
            case 'description':
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nom du Produit</label>
                            <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ex: T-shirt en coton bio" />
                        </div>
                        <div>
                            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Mots-clés (séparés par des virgules)</label>
                            <input type="text" id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Ex: confortable, durable, écologique" />
                        </div>
                    </div>
                );
            case 'forecast':
                return <p className="text-gray-600">Cliquez sur "Exécuter" pour analyser le stock actuel et les ventes récentes afin d'identifier les produits qui risquent d'être en rupture de stock.</p>;
            case 'summary':
                return <p className="text-gray-600">Cliquez sur "Exécuter" pour obtenir un résumé de vos commandes récentes, incluant le revenu total et les tendances.</p>;
            default: return null;
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Gemini Aide</h2>
                <p className="text-gray-600 mt-2">Votre assistant intelligent pour optimiser votre e-commerce.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-center border-b border-gray-200 mb-6">
                    <button onClick={() => setActiveTask('description')} className={`px-4 py-2 font-medium text-sm ${activeTask === 'description' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Générer Description</button>
                    <button onClick={() => setActiveTask('forecast')} className={`px-4 py-2 font-medium text-sm ${activeTask === 'forecast' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Prévision de Stock</button>
                    <button onClick={() => setActiveTask('summary')} className={`px-4 py-2 font-medium text-sm ${activeTask === 'summary' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Résumé des Commandes</button>
                </div>

                <div className="min-h-[150px]">
                    {renderForm()}
                </div>

                <div className="mt-6 text-center">
                    <button onClick={handleTaskExecution} disabled={isLoading} className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition w-full sm:w-auto disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center mx-auto">
                        {isLoading ? <Spinner size="sm" /> : 'Exécuter la tâche'}
                    </button>
                </div>
            </div>

            {(isLoading || result) && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Résultat</h3>
                    {isLoading && (
                        <div className="flex justify-center items-center py-8">
                           <Spinner />
                        </div>
                    )}
                    {result && (
                        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
                            {result}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GeminiAide;
