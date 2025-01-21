import c from 'args';

import * as LimeSurveyAPI from '../api/limesurvey.js';

import dotenv from 'dotenv';
dotenv.config(); //charge les variables du fichier .env

// Test
const surveyId = 992658;

async function test (){
    try {
        const sessionKey = await LimeSurveyAPI.getSessionKey(process.env.LIME_URL,process.env.LIME_USERNAME,process.env.LIME_PASSWORD);
        console.log("La sessionKey est : ",sessionKey);

        const newKey = await LimeSurveyAPI.isCorrect(sessionKey);
        console.log("La clée vérifiée est : ",newKey);

        const formulaires = await LimeSurveyAPI.allSurvey(newKey,process.env.LIME_URL);
        console.log("La liste des formulaires : ",formulaires);

    } catch (error) {
        console.error('Impossible de récupérer les données du sondage : ', error.message);
    }
}
test();

async function executeAll () {
    try {
        const sessionKey = await LimeSurveyAPI.getSessionKey(process.env.LIME_URL,process.env.LIME_USERNAME,process.env.LIME_PASSWORD);
        console.log("La sessionKey est : ",sessionKey);

        const newKey = await LimeSurveyAPI.isCorrect(sessionKey);
        console.log("La clée vérifiée est : ",newKey);

        const dataAllSurvey = await LimeSurveyAPI.allSurvey(newKey, process.env.LIME_URL, surveyId);
        console.log("Les données de tous les questionnaires : ",dataAllSurvey);

        const dataSurvey = await survey(newKey, LimeSurveyAPI.process.env.LIME_URL, surveyId);
        console.log("Les données du questionnaire ",surveyId," sont ", dataSurvey);

        const modification = await LimeSurveyAPI.setDateStart(newKey, process.env.LIME_URL, surveyId, newStartDate);
        console.log("Est-ce que la date de début de formulaire a été modifiée ? ",modification);

        const tableMailParticipant = await LimeSurveyAPI.getParticipants(newKey,process.env.LIME_URL,surveyId);
        console.log("Les mails des participants du formulaire ",surveyId," sont : ",tableMailParticipant);

        const startDate = await LimeSurveyAPI.getStartDate(newKey,process.env.LIME_URL,surveyId);
        console.log("La date de départ du formulaire ",surveyId," est le ",startDate);

        const envoi = await LimeSurveyAPI.sendInvitations(process.env.LIME_URL,newKey,surveyId);
        console.log("Est-ce que l'invitation a été envoyée ? ",envoi);

        const activer = await LimeSurveyAPI.activateSurvey(newKey,process.env.LIME_URL,surveyId);
        console.log("Le questionnaire ",surveyId," a été activé");

        const information = await LimeSurveyAPI.survey(newKey,process.env.LIME_URL,surveyId);
        console.log("Informations du questionnaire : ",information);

        const modif = await LimeSurveyAPI.setDateStart(newKey,process.env.LIME_URL,surveyId, "2025-01-15 14:40:47");

        const send = await LimeSurveyAPI.checkStartDate(sessionKey,process.env.LIME_URL,surveyId);
        console.log("Est-ce que les invitations ont été envoyées ? ",send);


    } catch (error) {
        console.error('Impossible de récupérer les données du sondage : ', error.message);
    }
}