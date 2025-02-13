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
  // Etat existants
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSurveyId, setEditingSurveyId] = useState<string | null>(null);

  // Nouveaux états pour la création d'un questionnaire par copie
  const [showNewSurveyForm, setShowNewSurveyForm] = useState(false);
  const [newSurveySourceId, setNewSurveySourceId] = useState("");
  const [newSurveyName, setNewSurveyName] = useState("");
  const [newSurveyLoading, setNewSurveyLoading] = useState(false);

  // Fonction de chargement des questionnaires
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

  useEffect(() => {
    loadSurveys();
  }, []);

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
        setEditingSurveyId(null);
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

  // Fonction de création d'un nouveau questionnaire par copie
  const handleCreateNewSurvey = async () => {
    if (!newSurveySourceId || !newSurveyName) {
      alert("Veuillez renseigner l'ID du formulaire à copier et le nouveau nom.");
      return;
    }
    setNewSurveyLoading(true);
    try {
      const response = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "copySurvey",
          surveyId: newSurveySourceId,
          newSurveyName: newSurveyName,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Nouveau questionnaire créé avec succès");
        // Optionnel : recharger la liste des questionnaires
        loadSurveys();
      } else {
        alert("Erreur lors de la création: " + (data.error || "Erreur inconnue"));
      }
    } catch (error) {
      console.error("Erreur lors de la création du questionnaire", error);
      alert("Erreur lors de la création du questionnaire");
    } finally {
      setNewSurveyLoading(false);
      setShowNewSurveyForm(false);
      setNewSurveySourceId("");
      setNewSurveyName("");
    }
  };

  return (
    <div className="survey-container">
      <h1>Bienvenue sur ERA ! L'interface de gestion des questionnaires LimeSurvey de l'école IFRASS</h1>

      <div className="description">
        <p>
          Cette plateforme vous permet de gérer facilement les dates d'activation et d'expiration des questionnaires, ainsi que de suivre leur statut en temps réel. Voici les principales fonctionnalités disponibles :
        </p>

        <h2>Gestion des dates :</h2>
        <ul>
          <li>Définissez ou modifiez les dates d'activation et d'expiration pour chaque questionnaire.</li>
          <li>Un système de confirmation et de déverrouillage par ligne évite les modifications accidentelles.</li>
        </ul>

        <h2>Envoi automatique d'e-mails :</h2>
        <ul>
          <li>Lorsque la date d'activation correspond à la date du jour, un e-mail d'invitation est automatiquement envoyé à tous les participants n'ayant pas encore reçu de mail.</li>
          <li>Si aucune réponse n'est reçue après une semaine, un rappel automatique est envoyé.</li>
        </ul>

        <h2>Visualisation en temps réel :</h2>
        <ul>
          <li>Consultez le statut de chaque questionnaire (activé/désactivé).</li>
          <li>Identifiez rapidement les questionnaires dont la date d'activation correspond à aujourd'hui.</li>
        </ul>

        <h2>Sécurité et contrôle :</h2>
        <ul>
          <li>Modification des dates protégée par une confirmation explicite.</li>
          <li>Un seul questionnaire modifiable à la fois pour éviter les erreurs.</li>
        </ul>

        <p>
          Cette interface a été conçue pour automatiser la gestion des questionnaires tout en garantissant une utilisation sécurisée et efficace. Pour toute question ou assistance, n'hésitez pas à contacter l'équipe technique.
        </p>
      </div>

      {/* Section Nouveau questionnaire */}
      <div className="new-survey-section">
        {!showNewSurveyForm && (
          <button onClick={() => setShowNewSurveyForm(true)} disabled={loading || newSurveyLoading} className="button-style">
            Nouveau questionnaire
          </button>
        )}
        {showNewSurveyForm && (
          <div className="new-survey-form">
            <h2>Créer un nouveau questionnaire</h2>
            <div>
              <label>Formulaire à copier (ID) :</label>
              <input
                type="text"
                value={newSurveySourceId}
                onChange={(e) => setNewSurveySourceId(e.target.value)}
                placeholder="ID du formulaire source"
              />
            </div>
            <div>
              <label>Nouveau nom :</label>
              <input
                type="text"
                value={newSurveyName}
                onChange={(e) => setNewSurveyName(e.target.value)}
                placeholder="Nom du nouveau questionnaire"
              />
            </div>
            <button onClick={handleCreateNewSurvey} disabled={newSurveyLoading}>
              Créer questionnaire
            </button>
            <button onClick={() => setShowNewSurveyForm(false)} disabled={newSurveyLoading}>
              Annuler
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {surveys.length > 0 ? (
        <SurveyTable 
          surveys={surveys}
          loading={loading}
          onDateChange={handleDateUpdate}
          editingSurveyId={editingSurveyId}
          setEditingSurveyId={setEditingSurveyId}
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
  onDateChange,
  editingSurveyId,
  setEditingSurveyId
}: { 
  surveys: Survey[];
  loading: boolean;
  onDateChange: (action: "setStartDate" | "setExpiresDate", surveyId: string, date: string) => void;
  editingSurveyId: string | null;
  setEditingSurveyId: (id: string | null) => void;
}) => (
  <table className="table-style">
    <thead>
      <tr>
        <th>Action</th>
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
          isEditing={editingSurveyId === survey.sid}
          setEditingSurveyId={setEditingSurveyId}
        />
      ))}
    </tbody>
  </table>
);

// 5. Sous-composant Ligne -------------------------------------------------------------
const SurveyRow = ({
  survey,
  loading,
  onDateChange,
  isEditing,
  setEditingSurveyId
}: {
  survey: Survey;
  loading: boolean;
  onDateChange: (action: "setStartDate" | "setExpiresDate", surveyId: string, date: string) => void;
  isEditing: boolean;
  setEditingSurveyId: (id: string | null) => void;
}) => {
  const handleEditConfirmation = () => {
    const wantsToEdit = window.confirm(
      "Êtes-vous sûr de vouloir modifier les dates de ce questionnaire ?\n" +
      "Toute modification sera appliquée immédiatement."
    );
    
    if (wantsToEdit) {
      setEditingSurveyId(survey.sid);
    }
  };

  return (
    <tr>
      <td>
        {!isEditing && (
          <button onClick={handleEditConfirmation} disabled={loading}>
            🔧 Modifier
          </button>
        )}
        {isEditing && (
          <button onClick={() => setEditingSurveyId(null)} disabled={loading}>
            🔒 Verrouiller
          </button>
        )}
      </td>
      <td>{survey.sid}</td>
      <td>{survey.surveyls_title}</td>
      <td>
        <StatusBadge active={survey.active} />
      </td>
      <td>
        <DateInput
          value={survey.startdate}
          onChange={(date) => onDateChange("setStartDate", survey.sid, date)}
          disabled={!isEditing || loading}
        />
      </td>
      <td>
        <DateInput
          value={survey.expires}
          onChange={(date) => onDateChange("setExpiresDate", survey.sid, date)}
          disabled={!isEditing || loading}
        />
      </td>
      <td>
        <TodayIndicator date={survey.startdate} />
      </td>
    </tr>
  );
};

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