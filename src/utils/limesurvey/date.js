import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config(); //charge les variables du fichier .env

export const url = process.env.LIME_URL;
export const username = process.env.LIME_USERNAME;
export const password = process.env.LIME_PASSWORD;

/**
 * Fonction pour renvoyer la date d'activation d'un questionnaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {number} surveyID - L'identifiant du questionnaire (SID)
 * @returns {string|null} Retourne la startdate du formulaire ou null en cas d'erreur
 */
export async function getStartDate(sessionKey, surveyID) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'get_survey_properties',
            params: [sessionKey, surveyID],
            id: 4
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.result && response.data.result.startdate) {
            return response.data.result.startdate; // retourne la startdate si elle existe
        } else {
            console.error(`Erreur API : ${response.data.error}`);
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la requête : ", error.message);
        return null;
    }
}



/**
 * Fonction pour modifier la date d'activation du formulaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @param {date} newDate - La nouvelle date
 * @returns {boolean} Indique si la modification de la date a été faite
**/
export async function setStartDate(sessionKey,surveyID,newDate) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'set_survey_properties',
            params: [sessionKey, surveyID, { startdate: newDate }],
            id: 5,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data.result) {
            return true;
        }
        console.error('Erreur API :', response.data.error);
        return false;
    } catch (error) {
        if (error.response) {
            console.error("Erreur HTTP :", error.response.status);
            console.error("Détails :", error.response.data);
        } else if (error.request) {
            console.error("Aucune réponse du serveur :", error.request);
        } else {
            console.error("Erreur de configuration :", error.message);
        }
        return false;
    }
}

/**
 * Fonction pour renvoyer la date d'expiration d'un questionnaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyID - L'identifiant du questionnaire (SID)
 * @returns {datetime} Retourne expires du formulaire
 */
export async function getExpiresDate(sessionKey, surveyID) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'get_survey_properties',
            params: [sessionKey, surveyID],
            id: 4,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data.result) {
            // Récupérer la expires de la réponse
            const expiresDate = response.data.result.expires;
            return expiresDate;
        } else {
            console.error(`Erreur API : ${response.data.error}`);
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la requête : ", error.message);
        return null;
    }
}


/**
 * Fonction pour modifier la date d'expiration (expires) d'un questionnaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {int} surveyID - L'ID du questionnaire
 * @param {string} newExpiresDate - Nouvelle date d'expiration au format 'YYYY-MM-DD HH:MM:SS'
 */
export async function setExpiresDate(sessionKey, surveyID, newExpiresDate) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'set_survey_properties',
            params: [sessionKey, surveyID, { expires: newExpiresDate }],
            id: 10,
        }, {
            headers: {'Content-Type': 'application/json'}
        });

        if (response.data.result) {
            console.log(`Date d'expiration du questionnaire ${surveyID} mise à jour avec succès.`);
            return { success: true };
        } else {
            console.error('Erreur API :', response.data.error);
            return { success: false, error: response.data.error };
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la date d'expiration :", error);
        return { success: false, error: "Erreur lors de la requête API" };
    }
}