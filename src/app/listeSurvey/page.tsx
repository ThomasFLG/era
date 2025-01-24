"use client";

import { useEffect, useState } from "react";

interface Survey {
  sid: string;
  surveyls_title: string;
}

export default function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  useEffect(() => {
    fetch("/api/route?action=allSurvey")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données API :", data);

        if (Array.isArray(data.surveys)) {
          setSurveys(data.surveys);
        } else {
          console.error("Format inattendu :", data);
          setSurveys([]);
        }
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setSurveys([]);
      });
  }, []);

  return (
    <div>
      <h1>Liste des Questionnaires</h1>
      {surveys.length > 0 ? (
        <ul>
          {surveys.map((survey) => (
            <li key={survey.sid}>{survey.surveyls_title}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun questionnaire disponible.</p>
      )}
    </div>
  );
}
