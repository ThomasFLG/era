import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config(); //charge les variables du fichier .env

export const url = process.env.LIME_URL;
export const username = process.env.LIME_USERNAME;
export const password = process.env.LIME_PASSWORD;

/**
 * Fonction pour obtenir les emails des participants n'ayant pas reçu d'invitation
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {string[]} Un tableau contenant les adresses e-mail des participants sans invitation envoyée
**/
export async function getUninvitedParticipants(sessionKey, url, surveyId) {
    try {
        const participants = await getParticipants(sessionKey, url, surveyId);
        
        if (participants) {
            // Pour chaque participant, on vérifie s'il a reçu l'invitation
            participants.forEach(p => {
                const email = p.participant_info ? p.participant_info.email : null;
                const emailStatus = p.emailstatus || 'not sent'; // Si emailStatus est manquant, on le considère comme 'not sent'
                
                console.log(`${email}: ${emailStatus.trim().toLowerCase() === 'ok' ? 'Invitation reçue' : 'Pas d\'invitation reçue'}`);
            });
        } else {
            console.error('Erreur lors de la récupération des participants');
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error.message);
    }
}


/**
 * Fonction obtenir les participants d'un formulaire et leur mail
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {string[]} Un tableau contenant les adresses e-mail des participants
**/
export async function getParticipants(sessionKey, url, surveyId) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'list_participants',
            params: [sessionKey, surveyId, 0, 1000],
            id: 6,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data.result) {
            return response.data.result
        } else {
            console.error('Erreur lors de la récupération des participants :', response.data.error);
            return [];
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error.message);
        return [];
    }
}
