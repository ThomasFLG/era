import axios from 'axios';

/**
 * Fonction pour récupérer la session_key de LimeSurvey
 * @param {string} url - URL de l'API RemoteControl 2 de LimeSurvey
 * @param {string} username - Login admin Limesurvey
 * @param {string} password - Password admin limesurvey
 * @returns {string} La session_key si la requête réussit
 */
export async function getSessionKey(url, username, password) {
    try {
        const response = await axios.post(url,{
            jsonrpc: '2.0',
            method: 'get_session_key',
            params: [username,password],
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