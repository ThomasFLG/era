"use client";

import { useState } from "react";

export default function SurveyForm() {
    const [surveyId, setSurveyId] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!surveyId) {
            setMessage("Veuillez entrer un ID de questionnaire.");
            return;
        }

        setLoading(true);
        setMessage("Envoi en cours...");

        // Simule un envoi d'e-mail
        setTimeout(() => {
            setMessage("Emails envoyés avec succès !");
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="p-5 max-w-md mx-auto border rounded shadow">
            <h1 className="text-xl font-bold mb-3">Envoyer des emails</h1>
            
            <input
                type="text"
                placeholder="ID du questionnaire"
                value={surveyId}
                onChange={(e) => setSurveyId(e.target.value)}
                className="border p-2 w-full mb-3"
            />

            <button
                onClick={handleSubmit}
                className={`p-2 w-full rounded text-white ${
                    loading ? "bg-gray-400" : "bg-blue-500"
                }`}
                disabled={loading}
            >
                {loading ? "Envoi..." : "Envoyer"}
            </button>

            {message && <p className="mt-3 text-center">{message}</p>}
        </div>
    );
}
