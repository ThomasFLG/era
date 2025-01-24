import * as LimeSurvey from "../../../utils/services/limesurvey.js";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const action = searchParams.get("action");

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
            console.log("Surveys récupérés:", surveys);
            
            if (!Array.isArray(surveys)) {
                throw new Error("Le format de la réponse n'est pas un tableau.");
            }

            return Response.json({ surveys }, { status: 200});
        }

        return Response.json({ error: "Action inconnue" });

    } catch (error) {
        console.error("Erreur dans l'API :", error);
        return Response.json({error}, {status: 500});
    }
}