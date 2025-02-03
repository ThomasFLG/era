import * as limesurvey from "./limesurvey.js";
import dotenv from 'dotenv';
dotenv.config;
const url = process.env.LIME_URL;
const username = process.env.LIME_USERNAME;
const password = process.env.LIME_PASSWORD;

async function test() {
    console.log("Test : ", await limesurvey.getParticipantsNoInvitation(url,855558));
    console.log("Test 2 : ", await limesurvey.getSessionKey(url,username,password));
}

test();