import axios from 'axios';
import dotenv from 'dotenv';
import * as LimeSurvey from '../utils/limesurvey/index.js';
dotenv.config(); // Charger les variables d'environnement en premier

// Ensuite, exportation des variables
const url = process.env.LIME_URL;
const username = process.env.LIME_USERNAME;
const password = process.env.LIME_PASSWORD;

const sessionKey = await LimeSurvey.getSessionKey(url,username,password);



async function handleDailyInvitations() {
    try {
        // 1. Récupérer tous les formulaires
        const allSurveys = await LimeSurvey.allSurvey(sessionKey,url);
        
        if (!allSurveys || allSurveys.length === 0) {
            console.log("❌ Aucun formulaire trouvé");
            return;
        }

        // Date d'aujourd'hui pour comparaison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let noStartDateCount = 0;
        let processedSurveys = 0;
        let totalInvitationsSent = 0;

        console.log(`📄 Nombre de formulaires récupérés : ${allSurveys?.length || 0}`);
        console.log("\n🔄 Début du traitement des invitations...");

        // 2. Parcourir chaque formulaire
        for (const survey of allSurveys) {
            try {
                const surveyId = survey.sid;

                if (!surveyId) {
                    console.error("❌ Erreur : surveyId est undefined !");
                    continue;
                }

                // 3. Récupérer la startdate
                const startDateStr = await LimeSurvey.getStartDate(sessionKey,surveyId,url);
                
                if (!startDateStr) {
                    noStartDateCount++;
                    continue;
                }

                // 4. Comparer les dates
                const startDate = new Date(startDateStr);
                startDate.setHours(0, 0, 0, 0);
                
                if (startDate.getTime() === today.getTime()) {
                    console.log(`Date de début aujourd'hui pour le formulaire ${surveyId}`);
                    processedSurveys++;

                    // 5. Activer le formulaire si nécessaire
                    const surveyInfo = await LimeSurvey.survey(sessionKey,surveyId,url);
                    if (surveyInfo?.active !== 'Y') {
                        await LimeSurvey.activateSurvey(sessionKey,surveyId,url);
                    }

                    // 6. Envoyer les invitations
                    const invitationsSent = await LimeSurvey.sendInvitationToPendingParticipants(sessionKey,surveyId,url);
                    totalInvitationsSent += invitationsSent; // Incrémenter le total
                
                }
            } catch (error) {
                console.error(`⚠️ Erreur sur le formulaire ${survey.sid} :`, error.message);
            }
        }

        // ✅ Résumé final
        console.log(`\n📊 Résumé du traitement :`);
        console.log(`- 📄 Formulaires analysés : ${allSurveys.length}`);
        console.log(`- ⏳ Formulaires sans date de début : ${noStartDateCount}`);
        console.log(`- ✅ Formulaires traités aujourd'hui : ${processedSurveys}`);
        console.log(`- 📧 Invitations envoyées au total : ${totalInvitationsSent}`);
        
    } catch (error) {
        console.error("❌ Erreur générale :", error.message);
    }
}

// Exécution du script
handleDailyInvitations()
    .then(() => console.log("\n✅ Traitement terminé"))
    .catch(err => console.error("❌ Erreur critique :", err));