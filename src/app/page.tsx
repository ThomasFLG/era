"use client";

import { useEffect, useState } from "react";

// 1. Interface et type -----------------------------------------------------------------
interface Survey {
  sid: string;
  surveyls_title: string;
  active: string;
  startdate: string | null;
  expires: string | null;
}

// 2. Fonctions utilitaires ------------------------------------------------------------
const isToday = (dateStr: string | null): boolean => {
  if (!dateStr) return false;
  const today = new Date().toISOString().split("T")[0];
  const surveyDate = new Date(dateStr).toISOString().split("T")[0];
  return today === surveyDate;
};

// 3. Composant principal ---------------------------------------------------------------
export default function SurveyList() {
  // 3a. Etat du composant
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3b. Effet de chargement initial
  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const response = await fetch("/api/route?action=allSurvey");
        const data = await response.json();
        
        if (Array.isArray(data.surveys)) {
          setSurveys(data.surveys);
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };

    loadSurveys();
  }, []);

  // 3c. Gestion des dates
  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    const pad = (num: number): string => String(num).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const handleDateUpdate = async (
    action: "setStartDate" | "setExpiresDate",
    surveyId: string,
    newDate: string
  ) => {
    if (!newDate) return;
    
    setLoading(true);
    setError(null);

    try {
      const formattedDate = formatDate(newDate);
      const bodyKey = action === "setStartDate" ? "newStartDate" : "newExpiresDate";
      const response = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          surveyId,
          [bodyKey]: formattedDate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSurveys(prev => prev.map(survey => 
          survey.sid === surveyId 
            ? { ...survey, [action === "setStartDate" ? "startdate" : "expires"]: newDate } 
            : survey
        ));
      } else {
        setError(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      setError("Erreur de connexion");
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3d. Rendu
  return (
    <div className="survey-container">
      <h1>Définir les dates d'activation et d'expiration</h1>
      
      <div className="description">
        <p>Sur cette page, on peut définir pour chaque questionnaire LimeSurvey IFRASS...</p>
        <p>Lorsque la date d'activation d'un formulaire correspond à la date d'aujourd'hui, cela envoie automatiquement un mail d'invitation à tous les participants qui n'avaient pas encore reçu de mail d'invitation.</p>
        <p>Si aucune réponse n'est reçue après une semaine, un rappel automatique est envoyé.</p>
        <p>La date d'expiration clôture automatiquement l'accès au formulaire LimeSurvey.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {surveys.length > 0 ? (
        <SurveyTable 
          surveys={surveys}
          loading={loading}
          onDateChange={handleDateUpdate}
        />
      ) : (
        <p>Chargement des questionnaires...</p>
      )}
    </div>
  );
}

// 4. Sous-composant Tableau -----------------------------------------------------------
const SurveyTable = ({ 
  surveys,
  loading,
  onDateChange
}: { 
  surveys: Survey[];
  loading: boolean;
  onDateChange: (action: "setStartDate" | "setExpiresDate", surveyId: string, date: string) => void;
}) => (
  <table className="table-style">
    <thead>
      <tr>
        <th>ID</th>
        <th>Titre</th>
        <th>Statut</th>
        <th>Date activation</th>
        <th>Date expiration</th>
        <th>Aujourd'hui ?</th>
      </tr>
    </thead>
    <tbody>
      {surveys.map((survey) => (
        <SurveyRow
          key={survey.sid}
          survey={survey}
          loading={loading}
          onDateChange={onDateChange}
        />
      ))}
    </tbody>
  </table>
);

// 5. Sous-composant Ligne -------------------------------------------------------------
const SurveyRow = ({
  survey,
  loading,
  onDateChange
}: {
  survey: Survey;
  loading: boolean;
  onDateChange: (action: "setStartDate" | "setExpiresDate", surveyId: string, date: string) => void;
}) => (
  <tr>
    <td>{survey.sid}</td>
    <td>{survey.surveyls_title}</td>
    <td>
      <StatusBadge active={survey.active} />
    </td>
    <td>
      <DateInput
        value={survey.startdate}
        onChange={(date) => onDateChange("setStartDate", survey.sid, date)}
        disabled={loading}
      />
    </td>
    <td>
      <DateInput
        value={survey.expires}
        onChange={(date) => onDateChange("setExpiresDate", survey.sid, date)}
        disabled={loading}
      />
    </td>
    <td>
      <TodayIndicator date={survey.startdate} />
    </td>
  </tr>
);

// 6. Sous-composants atomiques --------------------------------------------------------
const StatusBadge = ({ active }: { active: string }) => (
  active === "Y" 
    ? <span className="status-active">Activé</span>
    : <span className="status-inactive">Désactivé</span>
);

const DateInput = ({ value, onChange, disabled }: { 
  value: string | null;
  onChange: (date: string) => void;
  disabled: boolean;
}) => (
  <input
    type="datetime-local"
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
  />
);

const TodayIndicator = ({ date }: { date: string | null }) => (
  isToday(date)
    ? <span className="status-active">Oui</span>
    : <span className="status-inactive">Non</span>
);