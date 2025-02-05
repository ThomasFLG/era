"use client";

import { useEffect, useState } from "react";

interface Survey {
  sid: string;
  surveyls_title: string;
  startdate: string | null;
  expires: string | null;
}

export default function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const isToday = (dateStr: string | null): boolean => {
    if (!dateStr) return false;

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const surveyDate = new Date(dateStr);
    const surveyDateString = surveyDate.toISOString().split("T")[0];

    return todayString === surveyDateString;
  };


  const getParticipantsNoInvitation = async (surveyID: string) => {
    try {
      const response = await fetch(`/api/route?action=getParticipantsNoInvitation&surveyID=${surveyID}`);

      const data = await response.json();

      if (data.emails) {
        console.log(`Participants sans invitation pour le questionnaire ${surveyID} :`, data.emails);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des participants sans invitations");
    }
  };


  useEffect(() => {
    fetch("/api/route?action=allSurvey")
      .then((res) => res.json())
      .then((data) => {
        console.log("Données API :", data);
        if (Array.isArray(data.surveys)) {
          setSurveys(data.surveys);

          data.surveys.forEach((survey: Survey) => {
            if (isToday(survey.startdate)) {
              getParticipantsNoInvitation(survey.sid);
            }
          });

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

  const setStartDate = async (surveyID: string, newStartDate: string) => {
    if (!newStartDate) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/route?action=setStartDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyID, newStartDate: newStartDate.replace("T", " ") + ":00",
          action: "setStartDate"
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log(`Date d'activation mise à jour pour le questionnaire ${surveyID}`);
        setSurveys((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey.sid === surveyID ? { ...survey, startdate: newStartDate } : survey
          )
        );
      } else {
        setError(data.error || "Erreur inconnue lors de la mise à jour");
      }
    } catch (err) {
      setError("Erreur API lors de la requête");
      console.error("Erreur API :", err);
    } finally {
      setLoading(false);
    }
  };

  const setExpiresDate = async (surveyID: string, newExpiresDate: string) => {
    if (!newExpiresDate) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/route?action=setExpiresDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyID, newExpiresDate: newExpiresDate.replace("T", " ") + ":00",
          action: "setExpiresDate"
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log(`Date d'activation mise à jour pour le questionnaire ${surveyID}`);
        setSurveys((prevSurveys) =>
          prevSurveys.map((survey) =>
            survey.sid === surveyID ? { ...survey, startdate: newExpiresDate } : survey
          )
        );
      } else {
        setError(data.error || "Erreur inconnue lors de la mise à jour");
      }
    } catch (err) {
      setError("Erreur API lors de la requête");
      console.error("Erreur API :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Définir les dates d'activation et d'expiration</h1>
      <p>Sur cette page, on peut définir pour chaque questionnaire LimeSurvey IFRASS des dates d'activation et d'expiration.</p>
      <p>Lorsque la date d'activation d'un formulaire est atteinte, cela envoie automatiquement un mail d'invitation à tous les participants.</p>
      <p>Si aucune réponse n'est reçue après une semaine, un rappel automatique est envoyé.</p>
      <p>La date d'expiration clôture automatiquement l'accès au formulaire LimeSurvey.</p>

      {surveys.length > 0 ? (
        <table className="table-style">
          <thead>
            <tr>
              <th>ID</th>
              <th>Titre</th>
              <th>Date activation questionnaire</th>
              <th>Date expiration questionnaire</th>
              <th>Aujourd'hui ?</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr key={survey.sid}>
                <td>{survey.sid}</td>
                <td>{survey.surveyls_title}</td>
                <td>
                  <input
                    type="datetime-local"
                    value={survey.startdate ?? ""}
                    onChange={(e) => setStartDate(survey.sid, e.target.value)}
                    disabled={loading}
                  />
                </td>
                <td>
                  <input
                  type="datetime-local"
                  value={survey.expires ?? ""}
                  onChange={(e) => setExpiresDate(survey.sid,e.target.value)}
                />
                </td>
                <td>
                  {isToday(survey.startdate) ? (
                    <span className="status-active">
                      Oui
                    </span>
                  ) : (
                    <span className="status-inactive">
                      Non
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Chargement des questionnaires ... </p>
      )}
    </div>
  );
}
