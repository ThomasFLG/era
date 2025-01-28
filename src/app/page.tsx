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
      <h1>Définir les dates d'activation et d'expiration</h1>
      <p>Sur cette page, on peut définir pour chaque questionnaire LimeSurvey IFRASS des dates d'activation et d'expiration.
Lorsque la date d'activation d'un formulaire est atteinte, cela envoi automatiquement un mail d'invitation à tous les participants.</p>
<p>De plus, si le mail ne reçoit aucune réponse au bout de une semaine, un nouveau mail de rappel automatique est envoyé.</p>
<p>Enfin, la date d'expiration du formulaire définie cloture automatiquement l'accès au formulaire LimeSurvey pour les étudiants</p>
      {surveys.length > 0 ? (
        <table className="table-style">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Date activation questionnaire</th>
              <th>Date expiration questionnaire</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr key={survey.sid}>
                <td>{survey.sid}</td>
                <td>{survey.surveyls_title}</td>
                <td><input type="date"></input></td>
                <td><input type="date"></input></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun questionnaire disponible.</p>
      )}
    </div>
  );
}
