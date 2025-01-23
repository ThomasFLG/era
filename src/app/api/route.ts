import { NextRequest, NextResponse } from "next/server";
import { allSurvey, getSessionKey, url, username, password } from '@/app/utils/limesurvey';

console.log(url);

// src/app/api/hello/route.ts
export async function GET(req: NextRequest) {
    const { searchParams } = new URL (req.url);
    const action = searchParams.get("action"); //Récupère le paramètre action dans l'URL

    if (action === "getSessionKey") {
        const sessionKey = await getSessionKey(url,username,password);
        return NextResponse.json( {sessionKey} );
    }

    if (action === "allSurvey") {
        const surveys = await allSurvey(url);
        return NextResponse.json({ message: surveys });
    }

    return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
  