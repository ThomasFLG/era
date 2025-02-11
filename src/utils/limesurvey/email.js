import axios from 'axios';
import {getParticipantsNoInvitation} from "./participants.js";


/**
 * Envoi d'e-mail à tous les participants d'un questionnaire
 * @param {string} sessionKey Cle API limesurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @param {string} url URL de l'API RemoteControl 2 de LimeSurvey
 * @returns {boolean} Indique si la fonction a envoyé le mail
 */
export async function sendInvitation(sessionKey,surveyId,url) {
    try {
        
        // Les paramètres nécessaires pour l'API
        const response = await axios.post(url, {
            // Méthode API pour envoyer l'email
            jsonrpc: '2.0',
            method: 'invite_participants',
            params: [
                sessionKey,// Clé de session pour authentifier l'appel
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

/**
 * Envoi d'e-mail aux participants d'un questionnaire qui n'en ont jamais reçu
 * @param {string} sessionKey Cle API limesurvey
 * @param {number} surveyId - L'identifiant du questionnaire (SID)
 * @param {string} url URL de l'API RemoteControl 2 de LimeSurvey
 * @returns {number} Renvoie le nombre d'invitation envoyées
 */
export async function sendInvitationToPendingParticipants(sessionKey,surveyId,url) {
    try {
        // Récupérer les participants sans invitation
        const participants = await getParticipantsNoInvitation(sessionKey, surveyId,url);

        if (!Array.isArray(participants) || participants.status === 0) {
            if (participants.status === 'No survey participants found.') {
                console.log(`🎯 Tous les participants du questionnaire ${surveyId} ont déjà reçu une invitation.`);
            } else {
                console.log(`❌ Aucun participant sans invitation pour le questionnaire ${surveyId}`);
            }
            return 0;  // Retourner 0 si aucun participant n'est trouvé
        }
        

        // Extraire les emails des participants
        const tokenIds = participants
        .filter(participant => participant.tid)  // Vérifie que l'email existe dans participant_info
        .map(participant => participant.tid);

        if (tokenIds.length === 0) {
            console.log(`Aucun token valide trouvé pour l'envoi d'invitations au questionnaire ${surveyId}`);
            return 0;
        }

        // Envoyer les invitations uniquement aux emails récupérés
        const response = await axios.post(url, {
            jsonrpc: '2.0',
            method: 'invite_participants',
            params: [
                sessionKey, 
                surveyId, 
                tokenIds,     // Tableau des token IDs pour lesquels envoyer l'invitation
                true          // bEmail : envoyer l'e-mail
            ],
            id: 8,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.result) {
            console.log(`Emails envoyés avec succès pour le questionnaire ${surveyId}`);
            return tokenIds.length;
        } else {
            console.error(`Erreur lors de l'envoi des invitations pour le questionnaire ${surveyId}:`, response.data.error);
            return 0;
        }
    } catch (error) {
        console.error(`Erreur lors de l'envoi des invitations pour le questionnaire ${surveyId}:`, error);
        return 0;
    }
}