import axios from 'axios';

/**
 * Fonction pour récupérer tous les formulaires (enquêtes) avec toutes les informations
 * @param {string} sessionKey Cle API limesurvey
 * @returns {Array} Liste des enquêtes avec leurs informations
 */
export async function allSurvey(sessionKey,url) {
    try {
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
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {Array} Liste des enquêtes avec leurs informations
 */
export async function survey(sessionKey,surveyId,url) {
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
        console.error("Erreur dans allSurvey :", error.message);
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
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {boolean} Indique si l'activation a été effectuée avec succès
 */
export async function activateSurvey(sessionKey,surveyId,url) {
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