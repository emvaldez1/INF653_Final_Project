const express     = require('express');
const router      = express.Router();
const verifyState = require('../middleware/verifyState');
const State       = require('../models/State');
const statesData  = require('../models/statesData.json');

// Format a number with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ——— Population ———
// GET /states/:state/population
router.get('/:state/population', verifyState, (req, res) => {
  const { state, population } = req.fullStateData;
  res.json({ state, population: formatNumber(population) });
});

// ——— Fun Fact (random) ———
// GET /states/:state/funfact
router.get('/:state/funfact', verifyState, async (req, res) => {
  const { code, fullStateData } = req;
  const dbState = await State.findOne({ stateCode: code });
  if (!dbState?.funfacts?.length) {
    return res.json({ message: `No Fun Facts found for ${fullStateData.state}` });
  }

  const idx = Math.floor(Math.random() * dbState.funfacts.length);
  res.json({ funfact: dbState.funfacts[idx] });
});

// ——— Create Fun Fact(s) ———
// POST /states/:state/funfact
router.post('/:state/funfact', verifyState, async (req, res) => {
  const { code } = req;
  const { funfacts } = req.body;

  if (!funfacts) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }
  if (!Array.isArray(funfacts)) {
    return res.status(400).json({ message: 'State fun facts value must be an array' });
  }

  let dbState = await State.findOne({ stateCode: code });
  if (!dbState) dbState = new State({ stateCode: code, funfacts: [] });
  dbState.funfacts.push(...funfacts);
  await dbState.save();

  res.status(201).json(dbState);
});

// ——— Update a Fun Fact ———
// PATCH /states/:state/funfact
router.patch('/:state/funfact', verifyState, async (req, res) => {
  const { code, fullStateData } = req;
  const { index, funfact } = req.body;

  if (index === undefined) {
    return res.status(400).json({ message: 'State fun fact index value required' });
  }
  if (!funfact) {
    return res.status(400).json({ message: 'State fun fact value required' });
  }

  const dbState = await State.findOne({ stateCode: code });
  if (!dbState?.funfacts?.length) {
    return res.json({ message: `No Fun Facts found for ${fullStateData.state}` });
  }
  if (index < 1 || index > dbState.funfacts.length) {
    return res.json({ message: `No Fun Fact found at that index for ${fullStateData.state}` });
  }

  dbState.funfacts[index - 1] = funfact;
  await dbState.save();
  res.json(dbState);
});

// ——— Delete a Fun Fact ———
// DELETE /states/:state/funfact
router.delete('/:state/funfact', verifyState, async (req, res) => {
  const { code, fullStateData } = req;
  const { index } = req.body;

  if (index === undefined) {
    return res.status(400).json({ message: 'State fun fact index value required' });
  }

  const dbState = await State.findOne({ stateCode: code });
  if (!dbState?.funfacts?.length) {
    return res.json({ message: `No Fun Facts found for ${fullStateData.state}` });
  }
  if (index < 1 || index > dbState.funfacts.length) {
    return res.json({ message: `No Fun Fact found at that index for ${fullStateData.state}` });
  }

  dbState.funfacts.splice(index - 1, 1);
  await dbState.save();
  res.json(dbState);
});

module.exports = router;
