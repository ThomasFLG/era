import * as LimeSurvey from "../../../utils/limesurvey/index.js";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const action = searchParams.get("action");
        const surveyID = searchParams.get("surveyID");

        console.log("Requete API avec action : ",action);

        if (action === "getSessionKey") {
            const sessionKey = await LimeSurvey.getSessionKey(
                LimeSurvey.url,
                LimeSurvey.username,
                LimeSurvey.password
            );
            return Response.json({ sessionKey }, { status: 200});
        } 
        
        if (action === "allSurvey") {
            const surveys = await LimeSurvey.allSurvey(LimeSurvey.url);
            
            if (!Array.isArray(surveys)) {
                throw new Error("Le format de la réponse n'est pas un tableau.");
            }

            return Response.json({ surveys }, { status: 200});

        }

        if (action === "getParticipantsNoInvitation") {
            const emails = await LimeSurvey.getParticipantsNoInvitation(LimeSurvey.url,surveyID);

            return Response.json({ emails }, { status: 200});
        }

    } catch (error) {
        console.error("Erreur dans l'API : ", error);
        return Response.json({ error: error.message || "Erreur inconnue" }, { status: 500 });
    }
}

export async function POST(req) {
    const { surveyID, newStartDate, action, newExpiresDate } = await req.json();

    try {
        if (!surveyID || !action) {
            return Response.json({ error: "Parametres manquants" }, { status: 400});
        }

        if (action === "updateStartDate") {
            const result = await LimeSurvey.updateStartDate(surveyID,newStartDate);

            if (result.success) {
                return Response.json( { success: true}, { status: 200});
            } else {
                return Response.json( { error: result.error }, { status: 500});
            }
        } else if (action === "updateExpiresDate") {
            const result = await LimeSurvey.updateExpiresDate(surveyID,newExpiresDate);

            if (result.success) {
                return Response.json( { sucess: true}, { status: 200});
            } else {
                return Response.json( { error: result.error }, { status: 500});
            }
        } else {
            return Response.json( { success: false}, {status:400} );
        }

    
    } catch (error) {
        return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
}