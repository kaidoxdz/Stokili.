import { GoogleGenAI } from "@google/genai";
import { Product, Order } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateProductDescription = async (productName: string, keywords: string): Promise<string> => {
  try {
    const prompt = `Rédige une description de produit marketing convaincante pour un site e-commerce. La description doit être optimisée pour le SEO, mettre en avant les bénéfices pour le client, et inclure des listes à puces pour les caractéristiques clés.

    Nom du produit: ${productName}
    Mots-clés: ${keywords}

    Structure ta réponse comme suit:
    - Un paragraphe d'introduction accrocheur.
    - Une liste à puces des caractéristiques et avantages.
    - Un paragraphe de conclusion qui incite à l'achat.

    Rédige en français. Retourne uniquement la description, sans texte additionnel.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Désolé, une erreur est survenue lors de la génération de la description.";
  }
};


export const getStockForecast = async (products: Product[], orders: Order[]): Promise<string> => {
    try {
        const productData = products.map(p => `- ${p.name} (Stock: ${p.stock})`).join('\n');
        
        const recentOrders = orders.filter(o => new Date(o.date) > new Date(new Date().setDate(new Date().getDate() - 30)));
        const orderData = recentOrders.map(o => 
            `Commande ${o.id}: ${o.items.map(item => `${item.quantity} x ProduitID ${item.productId}`).join(', ')}`
        ).join('\n');

        const prompt = `En tant qu'analyste expert en chaîne d'approvisionnement e-commerce, analyse les données suivantes.
        Identifie les 3 produits les plus susceptibles d'être en rupture de stock au cours du mois prochain en te basant sur le stock actuel et les ventes récentes.
        Pour chaque produit, explique brièvement pourquoi en une phrase.

        Données produits (Stock actuel):
        ${productData}

        Données commandes (Ventes des 30 derniers jours):
        ${orderData}

        Fournis ta réponse sous forme de liste à puces.
        Retourne uniquement la liste, sans texte d'introduction ou de conclusion.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error getting stock forecast:", error);
        return "Désolé, une erreur est survenue lors de l'analyse des prévisions de stock.";
    }
};


export const getOrdersSummary = async (orders: Order[]): Promise<string> => {
    try {
        const orderData = orders.map(o => 
            `ID: ${o.id}, Date: ${o.date}, Status: ${o.status}, Total: ${o.total.toFixed(2)} DZD, Client: ${o.customerName}`
        ).join('\n');

        const prompt = `En tant qu'assistant e-commerce, résume les données de commandes suivantes. 
        Mets en évidence le nombre total de commandes, le revenu total, et le statut le plus fréquent des commandes.
        Sois concis et professionnel.

        Données commandes:
        ${orderData}

        Réponds en français sous forme de liste à puces.
        Retourne uniquement la liste, sans texte d'introduction ou de conclusion.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error getting orders summary:", error);
        return "Désolé, une erreur est survenue lors de la génération du résumé des commandes.";
    }
};