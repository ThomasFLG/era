import test from "node:test";
import * as LimeSurvey from "./index.js";
import dotenv from 'dotenv';
dotenv.config();
const url = process.env.LIME_URL;
const username = process.env.LIME_USERNAME;
const password = process.env.LIME_PASSWORD;
const sessionKey = await LimeSurvey.getSessionKey(url,username,password);

let surveyId = 318675;

testSurvey();

async function testParticipants () {
    console.log("__TEST_PARTICIPANTS__")
    const listeParticipants = await LimeSurvey.getParticipants(sessionKey,surveyId,url);
    console.log(`Les participants du formulaire ${surveyId} sont : `,listeParticipants);
    const listeParticipantsNoInvitation = await LimeSurvey.getParticipantsNoInvitation(sessionKey,surveyId,url);
    console.log("Parmis eux, ceux qui n'ont pas eu de mail d'invitation sont : ",listeParticipantsNoInvitation);
    const nbreToken = await LimeSurvey.setToken(sessionKey,surveyId,url);
    console.log("Nombre de participants dont le token a été généré : ",nbreToken);
    const nonResponders =  await LimeSurvey.getNonResponders(url,sessionKey,surveyId);
    console.log("Participants qui n'ont pas répondu au questionnaire : ",nonResponders);
}

async function testEmail() {
    console.log("__TEST_EMAIL__")
    console.log("Ma clé de session est : ",sessionKey);
    const email = await LimeSurvey.sendInvitationToPendingParticipants(sessionKey,surveyId,url);
    console.log("Nombre d'invitations envoyées à ceux qui n'en ont pas eu ",email);
    const listNonResponders =  await LimeSurvey.getNonResponders(url,sessionKey,surveyId);
    console.log("Participants qui n'ont pas répondu au questionnaire : ",listNonResponders);
    const reminder = await LimeSurvey.sendReminderToNonResponders(url,sessionKey,surveyId,0,2, listNonResponders);
    console.log("Les rappels ont ils été envoyés pour les personnes qui n'ont pas répondu aux invitations ? ",reminder);
}

async function testSurvey() {
    console.log("__TEST_SURVEY__")
    console.log("Ma clé de session est : ",sessionKey);
    const surveys = await LimeSurvey.allSurvey(sessionKey,url);
    console.log("Liste des questionnaires : ",surveys);
    const actif = await LimeSurvey.activateSurvey(sessionKey,surveyId,url);
    console.log(`Le questionnaire ${surveyId} a t'il été activé ?`,actif);
    const survey = await LimeSurvey.survey(sessionKey,surveyId,url);
    console.log(`Voici les informations de mon questionnaire ${surveyId}`,survey);
    const copy = await LimeSurvey.copySurvey(url,sessionKey,surveyId,"Copie ERA_TEST");
    console.log("Le questionnaire a t'il est copié ? ",copy);
}

async function testDate() {
    console.log("__TEST_DATE__")
    console.log("Ma clé de session est : ",sessionKey);

    const activation = await LimeSurvey.activateSurvey(sessionKey,surveyId,url);
    console.log("Le formulaire est-il activé ? ",activation);
    // Tester la récupération de la date de début (startdate)
    const startDate = await LimeSurvey.getStartDate(sessionKey,surveyId,url);
    console.log(`La date de début du questionnaire ${surveyId} est :`, startDate);

    // Tester la récupération de la date d'expiration (expires)
    const expires = await LimeSurvey.getExpiresDate(sessionKey,surveyId,url);
    console.log(`La date d'expiration du questionnaire ${surveyId} est :`, expires);

    // Tester la mise à jour de la date de début
    const newDate = generateRandomDate();
    console.log(`Mise à jour de la date de début du questionnaire ${surveyId} de ${startDate} vers ${newStartDate}...`);
    const setStartResult = await LimeSurvey.setStartDate(sessionKey, surveyId, newDate, url);
    console.log("Mise à jour de la date de début réussie ? :", setStartResult);

    // Tester la mise à jour de la date d'expiration (expires)
    const newExpiresDate = generateRandomDate(); // On peut aussi générer une date aléatoire pour expiration
    console.log(`Mise à jour de la date d'expiration du questionnaire ${surveyId} de ${expires} vers ${newExpiresDate}...`);
    const updateExpiresResult = await LimeSurvey.setExpiresDate(sessionKey,surveyId,newExpiresDate,url);
    console.log("Mise à jour de la date d'expiration réussie ? :", updateExpiresResult);
}

function generateRandomDate() {
    const start = new Date(); // La date actuelle
    const end = new Date();
    end.setDate(start.getDate() + 30); // Ajouter 30 jours à la date actuelle pour définir la limite

    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())); // Générer une date aléatoire entre start et end

    // Formater la date en 'YYYY-MM-DD HH:mm:ss'
    const year = randomDate.getFullYear();
    const month = (randomDate.getMonth() + 1).toString().padStart(2, '0');
    const day = randomDate.getDate().toString().padStart(2, '0');
    const hours = randomDate.getHours().toString().padStart(2, '0');
    const minutes = randomDate.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}