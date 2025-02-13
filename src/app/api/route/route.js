import * as LimeSurvey from "../../../utils/limesurvey/index.js";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.LIME_URL;
const username = process.env.LIME_USERNAME;
const password = process.env.LIME_PASSWORD;


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const surveyId = searchParams.get("surveyId");

    const currentSessionKey = await LimeSurvey.getSessionKey(url,username,password);

    switch (action) {
      case "allSurvey":
        const surveys = await LimeSurvey.allSurvey(currentSessionKey, url);
        return Response.json({ surveys }, { status: 200 });

      case "getParticipantsNoInvitation":
        if (!surveyId) throw new Error("surveyId manquant");
        const emails = await LimeSurvey.getParticipantsNoInvitation(url, surveyId);
        return Response.json({ emails }, { status: 200 });

      case "getSurveyStatus":
        if (!surveyId) throw new Error("surveyId manquant");
        const status = await LimeSurvey.getSurveyStatus(currentSessionKey, surveyId, url);
        return Response.json({ status }, { status: 200 });

      default:
        return Response.json({ error: "Action non supportée" }, { status: 400 });
    }

  } catch (error) {
    console.error("Erreur API GET:", error);
    return Response.json(
      { error: error.message || "Erreur serveur" },
      { status: error.message?.includes("manquant") ? 400 : 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => { throw new Error("Body JSON invalide") });
    const { action, surveyId, newStartDate, newExpiresDate, newSurveyName } = body;
    if (!action || !surveyId) throw new Error("Paramètres manquants");

    const currentSessionKey = await LimeSurvey.getSessionKey(url,username,password);

    switch (action) {
      case "setStartDate":
        await LimeSurvey.setStartDate(currentSessionKey, surveyId, newStartDate, url);
        return Response.json({ success: true });

      case "setExpiresDate":
        await LimeSurvey.setExpiresDate(currentSessionKey, surveyId, newExpiresDate, url);
        return Response.json({ success: true });

      case "sendInvitation":
        await LimeSurvey.sendInvitation(currentSessionKey, surveyId, url);
        return Response.json({ success: true });
      
      case "copySurvey":
        await LimeSurvey.copySurvey(url,currentSessionKey, surveyId, newSurveyName);
        return Response.json({ success: true });

      default:
        return Response.json({ error: "Action non supportée" }, { status: 400 });
    }

  } catch (error) {
    console.error("Erreur API POST:", error);
    return Response.json(
      { error: error.message || "Erreur serveur" },
      { status: error.message?.includes("JSON") ? 400 : 500 }
    );
  }
}