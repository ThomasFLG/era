import * as LimeSurvey from "./index.js";
import dotenv from 'dotenv';
dotenv.config;
const url = process.env.LIME_URL;
const username = process.env.LIME_USERNAME;
const password = process.env.LIME_PASSWORD;

testParticipants();

async function testParticipants () {
    console.log("__TEST_PARTICIPANTS__")
    const surveyID = 468261;
    const sessionKey = await LimeSurvey.getSessionKey(url,username,password);
    if (!sessionKey) {
        console.log("Erreur : Impossible d'obtenir la session key.");
        return;
    }
    const listeParticipants = await LimeSurvey.getParticipants(sessionKey,url,surveyID);
    console.log(`Les participants du formulaire ${surveyID} sont : `,listeParticipants);
    const listeParticipantsNoInvitation = await LimeSurvey.getParticipantsNoInvites(sessionKey,url,surveyID);
    console.log("Parmis eux, ceux qui n'ont pas eu de mail d'invitation sont : ",listeParticipantsNoInvitation);
}

async function testEmail() {
    console.log("__TEST_EMAIL__")
    const surveyID = 468261;
    const sessionKey = await LimeSurvey.getSessionKey(url,username,password);
    if (!sessionKey) {
        console.log("Erreur : Impossible d'obtenir la session key.");
        return;
    }
    console.log("Ma clé de session est : ",sessionKey);
    const email = await LimeSurvey.sendInvitation(sessionKey,url,surveyID);
    console.log("L'Email est-il envoyé ? ",email);
}

async function testSurvey () {
    console.log("__TEST_SURVEY__")

    const sessionKey = await LimeSurvey.getSessionKey(url,username,password);
    if (!sessionKey) {
        console.log("Erreur : Impossible d'obtenir la session key.");
        return;
    }
    console.log("Ma clé de session est : ",sessionKey);
    const surveys = await LimeSurvey.allSurvey(url, sessionKey);
    console.log("Liste des questionnaires : ",surveys);
    const surveyID = 468261;
    const survey = await LimeSurvey.survey(sessionKey,url,surveyID);
    console.log(`Voici les informations de mon questionnaire ${surveyID}`,survey);
}

async function testDate() {
    console.log("__TEST_DATE__")

    const sessionKey = await LimeSurvey.getSessionKey(url,username,password);
    if (!sessionKey) {
        console.log("Erreur : Impossible d'obtenir la session key.");
        return;
    }
    console.log("Ma clé de session est : ",sessionKey);

    const newSessionKey = await LimeSurvey.isCorrect(sessionKey,url,username,password);
    console.log("Clé valide : ",newSessionKey);

    const surveyID = 468261;
    const activation = await LimeSurvey.activateSurvey(sessionKey,url,surveyID);
    console.log("Le formulaire est-il activé ? ",activation);
    // Tester la récupération de la date de début (startdate)
    const startDate = await LimeSurvey.getStartDate(sessionKey,surveyID);
    console.log(`La date de début du questionnaire ${surveyID} est :`, startDate);

    // Tester la récupération de la date d'expiration (expires)
    const expires = await LimeSurvey.getExpiresDate(sessionKey,surveyID);
    console.log(`La date d'expiration du questionnaire ${surveyID} est :`, expires);

    // Tester la mise à jour de la date de début
    const newStartDate = generateRandomDate();
    console.log(`Mise à jour de la date de début du questionnaire ${surveyID} de ${startDate} vers ${newStartDate}...`);
    const setStartResult = await LimeSurvey.setStartDate(sessionKey, surveyID, newStartDate);
    console.log("Mise à jour de la date de début réussie ? :", setStartResult);

    // Tester la mise à jour de la date d'expiration (expires)
    const newExpiresDate = generateRandomDate(); // On peut aussi générer une date aléatoire pour expiration
    console.log(`Mise à jour de la date d'expiration du questionnaire ${surveyID} de ${expires} vers ${newExpiresDate}...`);
    const updateExpiresResult = await LimeSurvey.setExpiresDate(sessionKey,surveyID,newExpiresDate);
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
    const seconds = randomDate.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}