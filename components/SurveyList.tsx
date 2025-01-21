"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SurveyList = () => {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        // Appel à l'API pour récupérer la liste des enquêtes
        const response = await axios.get('../app/api/limesurvey.js');
        
        // Vérification si des enquêtes ont été renvoyées
        if (response.data.message && response.data.message.length > 0) {
          setMessage(response.data.message);
        } else {
          console.log("Aucun formulaire trouvé");
        }
      } catch (err) {
        // Gestion des erreurs
        console.error(err);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div>
      <h1>Liste des enquêtes</h1>
      {message}
    </div>
  );
};

export default SurveyList;
