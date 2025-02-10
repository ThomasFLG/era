import axios from 'axios';

export async function getParticipantsNoInvitation(sessionKey,surveyId,url) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'list_participants',
            params: [
                sessionKey, 
                surveyId, 
                0, // Début de la pagination
                1000, // Limite de résultats
                false, // unused (non utilisé)
                false, // attributes (optionnel)
                { sent: 'N' } // Conditions : sent est vide
            ],
            id: 6,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data.result || [];
    } catch (error) {
        console.error('Erreur API :', error.message);
        return [];
    }
}


/**
 * Fonction obtenir les participants d'un formulaire et leur mail
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {string[]} Un tableau contenant les adresses e-mail des participants
**/
export async function getParticipants(sessionKey,surveyId,url) {
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
