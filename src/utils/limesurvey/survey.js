import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); //charge les variables du fichier .env

export const url = process.env.LIME_URL;
export const username = process.env.LIME_USERNAME;
export const password = process.env.LIME_PASSWORD;


/**
 * Fonction pour récupérer tous les formulaires (enquêtes) avec toutes les informations
 * @param {string} sessionKey - La clé de session obtenue
 * @param {string} urlListSurvey - L'URL de l'API LimeSurvey pour la liste des sondages
 * @returns {Array} Liste des enquêtes avec leurs informations
 */
export async function allSurvey(url, sessionKey) {
    try {
        console.log("URL : ",url);
        const response = await axios.post(url,{
            jsonrpc: '2.0',
            method: 'list_surveys',
            params: [sessionKey,null],
            id: 2,
        },
            {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.data.result) {
            return response.data.result;
        } else {
            console.error('Erreur API :',response.data.error);
        }
    } catch (error) {
        console.log("Erreur : ",error);
    }
}

/**
 * Fonction pour récupérer les informations du formulaire que l'on souhaite
 * @param {string} sessionKey - La clé de session obtenue
 * @param {string} urlListSurvey - L'URL de l'API LimeSurvey pour la liste des sondages
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {Array} Liste des enquêtes avec leurs informations
 */
export async function survey(sessionKey, url, surveyId) {
    try {
        const response = await axios.post(url,{
            jsonrpc: '2.0',
            method: 'get_survey_properties',
            params: [sessionKey,surveyId],
            id: 3,
        },
            {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.data.result) {
            return response.data.result
        } else {
            console.error('Erreur API :',response.data.error);
        }
    } catch (error) {
        if (error.response) {
            // Erreur côté serveur, avec une réponse HTTP
            console.error("Erreur HTTP :", error.response.status);
            console.error("Détails :", error.response.data);
        } else if (error.request) {
            // Requête envoyée mais pas de réponse reçue
            console.error("Aucune réponse du serveur :", error.request);
        } else {
            // Erreur lors de la configuration de la requête
            console.error("Erreur de configuration :", error.message);
        }
    }
}

/**
 * Fonction pour activer un questionnaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {boolean} Indique si l'activation a été effectuée avec succès
 */
export async function activateSurvey(sessionKey, url, surveyId) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'activate_survey',
            params: [sessionKey, surveyId],
            id: 7,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data.result) {
            console.log(`Le questionnaire ${surveyId} a été activé avec succès.`);
            return true;
        } else {
            console.error(`Erreur lors de l'activation du questionnaire :`, response.data.error);
            return false;
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error.message);
        return false;
    }
}