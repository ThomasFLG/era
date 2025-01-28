import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config(); //charge les variables du fichier .env

 export const url = process.env.LIME_URL;
 export const username = process.env.LIME_USERNAME;
 export const password = process.env.LIME_PASSWORD;
 console.log(url,username,password);

 getSessionKey(url,username,password);

/**
 * Fonction pour récupérer la session_key de LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {string} utilisateur - Le nom d'utilisateur LimeSurvey
 * @param {string} motDePasse - Le mot de passe LimeSurvey
 * @returns {string} La session_key si la requête réussit
 */
async function getSessionKey(url,utilisateur,motDePasse) {
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
            const sessionKey = response.data.result;  // Récupération du session_key
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
 * @param {string} sessionKey - La sessionKey ou PHPSESSID
 * @returns {string} Une clé de session valide
 */
async function isCorrect(sessionKey,url,utilisateur,motDePasse) {
    if (sessionKey && sessionKey.length > 0) {
        console.log("La sessionKey fournie est valide")
        return sessionKey
    }
    console.log("La sessionKey fournie est incorrecte ou absente. Génération d'une nouvelle sessionKey.");
    return await getSessionKey(url, utilisateur, motDePasse);
}

/**
 * Fonction pour récupérer tous les formulaires (enquêtes) avec toutes les informations
 * @param {string} sessionKey - La clé de session obtenue
 * @param {string} urlListSurvey - L'URL de l'API LimeSurvey pour la liste des sondages
 * @returns {Array} Liste des enquêtes avec leurs informations
 */
async function allSurvey(url) {
    const sessionKey = await getSessionKey(url,username,password);
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
            console.log("Resultat : : ",response.data.result);
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
async function survey(sessionKey, url, surveyId) {
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
 * Fonction pour mettre à jour la date d'activation d'un questionnaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @param {string} newDate - La nouvelle date de début au format 'YYYY-MM-DD HH:mm:ss'
 * @returns {boolean} Indique si la mise à jour a été effectuée avec succès
 */
async function getStartDate(sessionKey, url, surveyId) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'get_survey_properties',
            params: [sessionKey, surveyId],
            id: 4,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.data.result) {
            // Récupérer la startDate de la réponse
            const startDate = response.data.result.startdate;
            return startDate;
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
async function setStartDate(sessionKey,url,idSurvey,newDate) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'set_survey_properties',
            params: [sessionKey, idSurvey, { startdate: newDate }],
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
 * Fonction obtenir les participants d'un formulaire et leur mail
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {string[]} Un tableau contenant les adresses e-mail des participants
**/
async function getParticipants(sessionKey, url, surveyId) {
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
            console.log(`Participants du questionnaire ${surveyId} :`, response.data.result);
            return response.data.result.map(p => p.participant_info.email); // Récupère uniquement les e-mails
        } else {
            console.error('Erreur lors de la récupération des participants :', response.data.error);
            return [];
        }
    } catch (error) {
        console.error('Erreur lors de la requête :', error.message);
        return [];
    }
}

/**
 * Fonction pour activer un questionnaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {boolean} Indique si l'activation a été effectuée avec succès
 */
async function activateSurvey(sessionKey, url, surveyId) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'activate_survey',
            params: [sessionKey, surveyId],
            id: 8,
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


/**
 * Envoi d'e-mail aux participants du questionnaire
 * Cette fonction ne peut envoyer une invitation qu'une seule fois pour chaque participant
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {string} url - L'URL de l'API LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @returns {boolean} Renvoie si la fonction a envoyé le mail
 */
async function sendEmail(sessionKey, url, surveyId) {
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
            id: 7,                  // ID de la requête (peut être un identifiant unique pour chaque requête)
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



async function checkStartDate(sessionKey, url, surveyId) {
    const startDate = await getStartDate(sessionKey, url, surveyId);
    const startDateObj = new Date(startDate);
    const currentDate = new Date();

    const timeToWait = startDateObj - currentDate;

    if (timeToWait <= 0) {
        console.log('Envoi immédiat des invitations...');
        sendEmail(sessionKey,url,surveyId);
    } else {
        console.log(`Envoi programmé dans ${timeToWait / 1000} secondes.`);
        setTimeout(async () => {
            await sendInvitations(url, sessionKey, surveyId);
            const emails = await getParticipants(sessionKey, url, surveyId);
            await sendEmail(emails, 'Invitation à votre questionnaire', 'Votre questionnaire est maintenant disponible.');
        }, timeToWait);
    }
}

export {getSessionKey, isCorrect, survey, allSurvey, getStartDate, setStartDate, getParticipants, activateSurvey, sendEmail, checkStartDate};