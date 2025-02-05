import axios from 'axios';
import dotenv from 'dotenv';
import * as LimeSurvey from "./index.js";
dotenv.config(); //charge les variables du fichier .env

export const url = process.env.LIME_URL;
export const username = process.env.LIME_USERNAME;
export const password = process.env.LIME_PASSWORD;

/**
 * Fonction pour récupérer la session_key de LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {string} utilisateur - Le nom d'utilisateur LimeSurvey
 * @param {string} motDePasse - Le mot de passe LimeSurvey
 * @returns {string} La session_key si la requête réussit
 */
export async function getSessionKey(url,utilisateur,motDePasse) {
    try {
        const response = await axios.post(url,{
            jsonrpc: '2.0',
            method: 'get_session_key',
            params: [utilisateur,motDePasse],
            id: 1,
        },
            {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.data.result) {
            const sessionKey = response.data.result;  // Récupération session_key
            return sessionKey;
        }
        
    } catch (error) {
        if (error.response) {
            // Si le serveur a répondu avec une erreur HTTP
            console.error("Erreur HTTP : ", error.response ? error.response.status : error.message);
            console.error("Détails de l'erreur : ", error.response ? error.response.data : error);
            console.error("En-têtes de la réponse : ", error.response.headers);
        } else if (error.request) {
            // Si la requête a été faite mais aucune réponse reçue
            console.error("Aucune réponse reçue : ", error.request);
            console.log("URL de la requête : ", error.request._url);
            console.log("Données envoyées : ", error.request._data);
            // Paramètres de la requête
            if (error.request._headers) {
                console.log("En-têtes de la requête : ", error.request._headers);
            }

            // Timeout
            if (error.code === 'ECONNABORTED') {
                console.error("La requête a échoué en raison d'un délai d'attente dépassé");
            }

        } else {
            // Erreur survenue lors de la configuration de la requête
            console.error("Erreur lors de la configuration de la requête : ", error.message);
        }
    }
}


/**
 * Fonction pour savoir si la clé dession est correcte
 * @param {string} sessionKey - La sessionKey
 * @returns {string} Une clé de session valide
 */
export async function isCorrect(sessionKey,url,utilisateur,motDePasse) {
    if (sessionKey && sessionKey.length > 0) {
        console.log("La sessionKey fournie est valide")
        return sessionKey
    }
    console.log("La sessionKey fournie est incorrecte ou absente. Génération d'une nouvelle sessionKey.");
    return await getSessionKey(url, utilisateur, motDePasse);
}