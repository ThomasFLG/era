import axios from 'axios';

/**
 * Obtenir les informations des participants d'un questionnaire
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @param {string} url - L'URL de l'API LimeSurvey
 * @returns {string[]} Un tableau de participants
*/
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

/**
 * Connaitre les participants d'un questionnaire qui n'ont pas reçu d'invitation
 * @param {string} sessionKey - La clé de session LimeSurvey
 * @param {number} surveyId - L'URL de l'API LimeSurvey
 * @param {string} url - L'identifiant du questionnaire (SID)
 * @returns {string []} - Un tableau de participants
 */
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
 * Génère un token aléatoire de longueur spécifiée.
 * @param {number} length - Longueur du token à générer.
 * @returns {string} - Token généré.
 */
function generateToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

/**
 * Met à jour les participants sans token en leur attribuant un token généré.
 * @param {string} sessionKey - Clé de session LimeSurvey.
 * @param {number} surveyId - Identifiant de l'enquête.
 * @param {string} url - URL de l'API LimeSurvey.
 * @returns {number} Nombre de tokens générés
 */
export async function setToken(sessionKey, surveyId, url) {
    let nbreToken = 0;

    try {
        const participantsWithoutToken = await getParticipantsWithoutToken(sessionKey, surveyId, url);

        if (participantsWithoutToken.length === 0) {
            console.log("Tous les participants ont déjà un token.");
            return 0;
        }

        for (const participant of participantsWithoutToken) {
            const newToken = generateToken(15);
            console.log(`Attribution du token ${newToken} à l'utilisateur ${participant.tid}`);

            const response = await axios.post(url, {
                jsonrpc: '2.0',
                method: 'set_participant_properties',
                params: [
                    sessionKey,
                    surveyId,
                    participant.tid, // On passe directement le tid
                    { token: newToken } // Et on fournit l'objet de mise à jour
                ],
                id: 3,
            });
            

            if (response.data.result) {
                console.log("Token mis à jour avec succès pour le participant", participant.tid);
                nbreToken++;
            } else {
                console.error('Erreur lors de la mise à jour :', response.data.error);
            }
        }

        return nbreToken;
    } catch (error) {
        console.error('Erreur lors de la requête :', error.message);
        return 0;
    }
}

/**
 * Connaitre les participants qui n'ont pas  de code générés
 * @param {string} sessionKey - Clé de session LimeSurvey.
 * @param {number} surveyId - Identifiant de l'enquête.
 * @param {string} url - URL de l'API LimeSurvey.
 * @returns Un tableau de participants
 */
async function getParticipantsWithoutToken(sessionKey, surveyId, url) {
    try {
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'list_participants',
            params: [
                sessionKey, 
                surveyId, 
                0, // iStart
                1000, // iLimit
                false, // bUnused
                ['token'], // aAttributes: demande explicitement le token
                {} // aConditions (vide)
            ],
            id: 1,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.result) {
            return response.data.result.filter(participant => !participant.token);
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
 * Récupère la liste des participants qui n'ont pas complété le questionnaire.
 *
 * L'API retourne pour chaque participant un objet comportant un champ "completed"
 * (correspondant à "Complété ?"). Selon la configuration et les versions,
 * ce champ peut contenir une date (lorsque le participant a terminé) ou être vide,
 * voire contenir "N" pour indiquer qu'il n'a pas complété.
 *
 * @param {string} url - URL de l'API RemoteControl2 de LimeSurvey.
 * @param {string} sessionKey - Clé de session obtenue via get_session_key.
 * @param {number} surveyID - Identifiant du questionnaire.
 * @returns {Promise<Array>} Tableau des participants non répondants.
 */
export async function getNonResponders(url, sessionKey, surveyID) {
  try {
    const response = await axios.post(
      url,
      {
        jsonrpc: '2.0',
        method: 'list_participants',
        params: [sessionKey, surveyID, 0, 100, false, ["token", "completed", "sent", "remindersent", "participant_info", "validfrom", "validuntil", "usesleft"]],
        id: 1,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (response.data.result && Array.isArray(response.data.result)) {
        const nonResponders = response.data.result.filter(participant => {
            return !participant.completed || participant.completed === "" || participant.completed === "N";
          });
      return nonResponders;
    } else {
      console.error("Aucun résultat ou format inattendu.");
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des participants :", error);
    return [];
  }
}