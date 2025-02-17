import axios from 'axios';

/**
 * Fonction pour récupérer tous les formulaires (enquêtes) avec toutes les informations
 * @param {string} sessionKey - Cle API limesurvey
 * @param {string} url - URL de l'API RemoteControl 2 de LimeSurvey
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
 * @param {string} sessionKey - Cle API limesurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @param {string} url - URL de l'API RemoteControl 2 de LimeSurvey
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
 * @param {string} sessionKey - Cle API limesurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @param {string} url - URL de l'API RemoteControl 2 de LimeSurvey
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

/**
 * Récupère le statut d'un questionnaire LimeSurvey
 * @param {string} sessionKey - Clé de session API LimeSurvey
 * @param {number} surveyId - Identifiant du questionnaire (SID)
 * @param {string} url - URL de l'API LimeSurvey
 * @returns {Promise<string>} - Statut du questionnaire : "activé", "désactivé" ou "expiré"
 */
export async function getSurveyStatus(sessionKey, surveyId, url) {
    try {
        // Récupérer la date d'expiration
        const expiresDate = await getExpiresDate(sessionKey, surveyId, url);

        // Récupérer le statut d'activation
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'get_survey_properties',
            params: [sessionKey, surveyId, ['active']],
            id: 5,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const isActive = response.data.result.active === 'Y';
        const today = new Date();

        if (!isActive) {
            return 'désactivé';
        } else if (expiresDate && new Date(expiresDate) < today) {
            return 'expiré';
        } else {
            return 'activé';
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du statut du questionnaire :', error.message);
        throw error;
    }
}

/**
 * Fonction pour copier un formulaire LimeSurvey en se basant sur un formulaire existant
 *
 * @param {string} url - URL de l'API RemoteControl 2 de LimeSurvey
 * @param {string} sessionKey - Clé de session API LimeSurvey
 * @param {number} originalSurveyId - ID du formulaire source à copier
 * @param {string} newSurveyName - Nom du nouveau formulaire
 * @returns {Promise<Object>} En cas de succès: objet contenant { newsid: nouveauID }. En cas d'erreur: objet d'erreur
 */
export async function copySurvey(url, sessionKey, originalSurveyId, newSurveyName) {
    try {
        // Appel de la méthode copy_survey de l'API
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'copy_survey',
            params: [sessionKey, originalSurveyId, newSurveyName],
            id: 1,
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        // Traitement de la réponse
        if (response.data && response.data.result) {
            // Retourne le nouvel ID du formulaire dans response.data.result
            return response.data.result;
        } else if (response.data && response.data.error) {
            console.error("Erreur de l'API : ", response.data.error);
            return response.data.error;
        }
    } catch (error) {
        console.error("Erreur lors de la configuration de la requête : ", error.message);
        return null;
    }
}

/**
 * Supprimer un questionnaire.
 *
 * @param {string} url - URL de l'API RemoteControl 2 de LimeSurvey
 * @param {string} sessionKey - Clé de session API LimeSurvey
 * @param {number} surveyId - L'ID du questionnaire à supprimer
 * @returns {Promise<Object>} En cas de succès: réponse de l'API. En cas d'erreur: objet d'erreur.
 */
export async function deleteSurvey(url, sessionKey, surveyId) {
  try {
    const response = await axios.post(url, {
      jsonrpc: '2.0',
      method: 'delete_survey',
      params: [sessionKey, surveyId],
      id: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.data && response.data.result) {
      // Retourne le résultat de l'opération (par exemple un booléen ou un message)
      return response.data.result;
    } else if (response.data && response.data.error) {
      console.error("Erreur de l'API : ", response.data.error);
      return response.data.error;
    }
  } catch (error) {
    if (error.response) {
      console.error("Erreur HTTP : ", error.response.status);
      console.error("Détails de l'erreur : ", error.response.data);
    } else if (error.request) {
      console.error("Aucune réponse reçue : ", error.request);
    } else {
      console.error("Erreur lors de la configuration de la requête : ", error.message);
    }
    return null;
  }
}