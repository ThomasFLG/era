// limesurvey.js (Backend)

import { getAllSurveys, createSurvey, getSurveyById } from '@/utils/limesurvey'; // Exemples de fonctions

export default function handler(req, res) {
  const { action } = req.query;

  switch (action) {
    case 'allSurvey':
      getAllSurveys(res);
      break;
    case 'createSurvey':
      createSurvey(req, res);
      break;
    case 'getSurvey':
      getSurveyById(req, res);
      break;
    default:
      res.status(400).json({ message: 'Action inconnue' });
  }
}
