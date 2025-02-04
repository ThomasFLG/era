import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config(); //charge les variables du fichier .env

export const url = process.env.LIME_URL;
export const username = process.env.LIME_USERNAME;
export const password = process.env.LIME_PASSWORD;

/**
 * Envoi d'e-mail aux participants du questionnaire
 * Cette fonction ne peut envoyer une invitation qu'une seule fois pour chaque participant
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {boolean} Renvoie si la fonction a envoyé le mail
 */
export async function sendInvitation(sessionKey, url, surveyId) {
    try {
        
        // Les paramètres nécessaires pour l'API
        const response = await axios.post(url, {
            // Méthode API pour envoyer l'email
            jsonrpc: '2.0',
            method: 'invite_participants',
            params: [
                sessionKey,           // Clé de session pour authentifier l'appel
                surveyId,             // ID du questionnaire pour lequel les mails seront envoyés
                [],
            ],
            id: 8,                  // ID de la requête (peut être un identifiant unique pour chaque requête)
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        // Vérification de la réponse
        if (response.data.result) {
            console.log('Email envoyé avec succès !');
        } else {
            console.error('Erreur lors de l\'envoi de l\'email:', response.data.error);
        }

        return response.data;
    }
    catch (error) {
        if (error.response) {
            // La réponse du serveur a échoué, donc on peut loguer l'erreur détaillée
            console.error('Détails de l\'erreur côté serveur:', error.response.data);
            console.error('Status de la réponse:', error.response.status);
        } else if (error.request) {
            // La requête a été faite mais aucune réponse n'a été reçue
            console.error('Aucune réponse reçue du serveur:', error.request);
        } else {
            // Quelque chose a causé un problème dans la configuration de la requête
            console.error('Erreur lors de la configuration de la requête:', error.message);
        }
    }
}