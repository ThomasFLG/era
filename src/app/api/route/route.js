import * as LimeSurvey from "../../../utils/limesurvey/index.js";
import dotenv from "dotenv";
dotenv.config(); // Charger les variables d'environnement en premier

// Ensuite, exportation des variables
const url = process.env.LIME_URL;
const username = process.env.LIME_USERNAME;
const password = process.env.LIME_PASSWORD;

const sessionKey = await LimeSurvey.getSessionKey(url,username,password);

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const action = searchParams.get("action");
        const surveyId = searchParams.get("surveyId");

        if (action === "getSessionKey") {
            const sessionKey = await LimeSurvey.getSessionKey(
                LimeSurvey.url,
                LimeSurvey.username,
                LimeSurvey.password
            );
            return Response.json({ sessionKey }, { status: 200});
        } 
        
        if (action === "allSurvey") {
            const surveys = await LimeSurvey.allSurvey(sessionKey,url);
            return Response.json({ surveys }, { status: 200});
        }

        if (action === "getParticipantsNoInvitation") {
            const emails = await LimeSurvey.getParticipantsNoInvitation(LimeSurvey.url, surveyId);
            return Response.json({ emails }, { status: 200});
        }

        if (action === "getSurveyStatus") {
            const status = await LimeSurvey.getSurveyStatus(sessionKey,surveyId,url);
            return Response.json({ status }, { status: 200});
        }

    } catch (error) {
        console.error("Erreur dans l'API : ", error);
        return Response.json({ error: error.message || "Erreur inconnue" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        let body;
        try {
            body = await req.json();
        } catch (error) {
            return Response.json({ error: "Requête JSON invalide" }, { status: 400 });
        }

        const { surveyId, newStartDate, action, newExpiresDate } = body || {};

        if (!surveyId || !action) {
            return Response.json({ error: "Paramètres manquants" }, { status: 400 });
        }

        if (action === "setStartDate") {
            const result = await LimeSurvey.setStartDate(sessionKey,surveyId,newStartDate,url);
            return result 
                ? Response.json({ success: true }, { status: 200 })
                : Response.json({ error: "Échec de la mise à jour" }, { status: 500 });
        }

        if (action === "setExpiresDate") {
            const result = await LimeSurvey.setExpiresDate(sessionKey,surveyId, newExpiresDate,url);
            return result
                ? Response.json({ success: true }, { status: 200 })
                : Response.json({ error: "Échec de la mise à jour" }, { status: 500 });
        }

        if (action === "sendInvitation") {
            const result = await LimeSurvey.sendInvitation(sessionKey,surveyId,url);
            return result
                ? Response.json({ success: true }, { status: 200 })
                : Response.json({ error: "Échec de l'envoi" }, { status: 500 });
        }

        return Response.json({ error: "Action non reconnue" }, { status: 400 });

    } catch (error) {
        console.error("Erreur serveur : ", error);
        return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
}