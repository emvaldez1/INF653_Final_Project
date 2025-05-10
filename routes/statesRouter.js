const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const verifyState = require('../middleware/verifyState');

// All States or filtered by query
router.route('/')
  .get(statesController.getAllStates);

// Single state by abbreviation
router.route('/:state')
  .get(verifyState, statesController.getState);

// Fun fact (random)
router.route('/:state/funfact')
  .get(verifyState, statesController.getFunFact)
  .post(verifyState, statesController.createFunFact)
  .patch(verifyState, statesController.updateFunFact)
  .delete(verifyState, statesController.deleteFunFact);

// Capital
router.route('/:state/capital')
  .get(verifyState, statesController.getCapital);

// Nickname
router.route('/:state/nickname')
  .get(verifyState, statesController.getNickname);

// Population
router.route('/:state/population')
  .get(verifyState, statesController.getPopulation);

// Admission date
router.route('/:state/admission')
  .get(verifyState, statesController.getAdmission);

