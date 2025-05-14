const State      = require('../models/States');
const statesData = require('../models/statesData.json');

// GET /states/
const getAllStates = async (req, res) => {
  let filtered = statesData;
  const contig = req.query.contig;

  if (contig === 'true') {
    filtered = filtered.filter(s => s.code !== 'AK' && s.code !== 'HI');
  } else if (contig === 'false') {
    filtered = filtered.filter(s => s.code === 'AK' || s.code === 'HI');
  }

  const mongo = await State.find();
  const merged = filtered.map(s => {
    const doc = mongo.find(m => m.stateCode === s.code);
    return doc ? { ...s, funfacts: doc.funfacts } : s;
  });

  res.json(merged);
};

// GET /states/:state
const getState = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const base  = { ...req.fullStateData }; 
  const mongo = await State.findOne({ stateCode: code });
  if (mongo?.funfacts?.length) base.funfacts = mongo.funfacts;
  res.json(base);
};

// GET /states/:state/funfact
const getFunFact = async (req, res) => {
  const code      = req.params.state.toUpperCase();
  const stateName = req.fullStateData.state;
  const doc       = await State.findOne({ stateCode: code });

  if (!doc?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${stateName}` });
  }

  const idx = Math.floor(Math.random() * doc.funfacts.length);
  res.json({ funfact: doc.funfacts[idx] });
};

// GET /states/:state/capital
const getCapital = (req, res) => {
  const { state, capital_city } = req.fullStateData;
  res.json({ state, capital: capital_city });
};

// GET /states/:state/nickname
const getNickname = (req, res) => {
  const { state, nickname } = req.fullStateData;
  res.json({ state, nickname });
};

// GET /states/:state/population
const getPopulation = (req, res) => {
  const { state, population } = req.fullStateData;
  res.json({
    state,
    population: population.toLocaleString('en-US')
  });
};

// GET /states/:state/admission
const getAdmission = (req, res) => {
  const { state, admission_date } = req.fullStateData;
  res.json({ state, admitted: admission_date });
};

// POST /states/:state/funfact
const createFunFact = async (req, res) => {
  const code     = req.params.state.toUpperCase();
  const { funfacts } = req.body;

  if (!funfacts) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }
  if (!Array.isArray(funfacts)) {
    return res.status(400).json({ message: 'State fun facts value must be an array' });
  }

  const doc = await State.findOneAndUpdate(
    { stateCode: code },
    { $push: { funfacts: { $each: funfacts } } },
    { new: true }
  );
  if (!doc) {
    return res.status(404).json({ message: 'State not found' });
  }
  res.status(201).json(doc);
};

// PATCH /states/:state/funfact
const updateFunFact = async (req, res) => {
  const code      = req.params.state.toUpperCase();
  const idx       = parseInt(req.body.index, 10);
  const funfact   = req.body.funfact;
  const stateName = req.fullStateData.state;

  if (isNaN(idx) || idx < 1) {
    return res.status(400).json({ message: 'State fun fact index value required' });
  }
  if (!funfact) {
    return res.status(400).json({ message: 'State fun fact value required' });
  }

  const doc = await State.findOne({ stateCode: code });
  if (!doc?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${stateName}` });
  }
  if (idx > doc.funfacts.length) {
    return res
      .status(404)
      .json({ message: `No Fun Fact found at that index for ${stateName}` });
  }

  doc.funfacts[idx - 1] = funfact;
  await doc.save();
  res.json(doc);
};

// DELETE /states/:state/funfact
const deleteFunFact = async (req, res) => {
  const code      = req.params.state.toUpperCase();
  const idx       = parseInt(req.body.index, 10);
  const stateName = req.fullStateData.state;

  if (isNaN(idx) || idx < 1) {
    return res.status(400).json({ message: 'State fun fact index value required' });
  }

  const doc = await State.findOne({ stateCode: code });
  if (!doc?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${stateName}` });
  }
  if (idx > doc.funfacts.length) {
    return res
      .status(404)
      .json({ message: `No Fun Fact found at that index for ${stateName}` });
  }

  doc.funfacts.splice(idx - 1, 1);
  await doc.save();
  res.json(doc);
};

module.exports = {
  getAllStates,
  getState,
  getFunFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  createFunFact,
  updateFunFact,
  deleteFunFact
};
