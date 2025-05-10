const State = require('../models/States');
const statesData = require('../models/statesData.json');

// GET /states/
const getAllStates = async (req, res) => {
  let filteredStates = statesData;
  const contig = req.query.contig;

  if (contig === 'true') {
    filteredStates = filteredStates.filter(
      s => s.code !== 'AK' && s.code !== 'HI'
    );
  } else if (contig === 'false') {
    filteredStates = filteredStates.filter(
      s => s.code === 'AK' || s.code === 'HI'
    );
  }

  const mongoStates = await State.find();
  const merged = filteredStates.map(s => {
    const m = mongoStates.find(m => m.stateCode === s.code);
    return m ? { ...s, funfacts: m.funfacts } : s;
  });

  res.json(merged);
};

// GET /states/:state
const getState = async (req, res) => {
  const stateData = { ...req.fullStateData };
  const mongo = await State.findOne({ stateCode: req.code });
  if (mongo?.funfacts?.length) {
    stateData.funfacts = mongo.funfacts;
  }
  res.json(stateData);
};

// GET /states/:state/funfact
const getFunFact = async (req, res) => {
  const { code, fullStateData } = req;
  const fullName = fullStateData.state;
  const mongo = await State.findOne({ stateCode: code });

  if (!mongo?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${fullName}` });
  }

  const idx = Math.floor(Math.random() * mongo.funfacts.length);
  res.json({ funfact: mongo.funfacts[idx] });
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
  res.json({ state, population: population.toLocaleString('en-US') });
};

// GET /states/:state/admission
const getAdmission = (req, res) => {
  const { state, admission_date } = req.fullStateData;
  res.json({ state, admitted: admission_date });
};

// POST /states/:state/funfact
const createFunFact = async (req, res) => {
  const { code } = req;
  const { funfacts } = req.body;

  if (!funfacts) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }
  if (!Array.isArray(funfacts)) {
    return res
      .status(400)
      .json({ message: 'State fun facts value must be an array' });
  }

  let doc = await State.findOne({ stateCode: code });
  if (doc) {
    doc.funfacts = doc.funfacts.concat(funfacts);
  } else {
    doc = new State({ stateCode: code, funfacts });
  }

  const result = await doc.save();
  res.status(201).json(result);
};

// PATCH /states/:state/funfact
const updateFunFact = async (req, res) => {
  const { code, fullStateData } = req;
  const fullName = fullStateData.state;
  const { index, funfact } = req.body;

  if (index === undefined) {
    return res
      .status(400)
      .json({ message: 'State fun fact index value required' });
  }
  if (!funfact) {
    return res.status(400).json({ message: 'State fun fact value required' });
  }

  const doc = await State.findOne({ stateCode: code });
  if (!doc?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${fullName}` });
  }
  if (index < 1 || index > doc.funfacts.length) {
    return res
      .status(404)
      .json({ message: `No Fun Fact found at that index for ${fullName}` });
  }

  doc.funfacts[index - 1] = funfact;
  await doc.save();
  res.json(doc);
};

// DELETE /states/:state/funfact
const deleteFunFact = async (req, res) => {
  const { code, fullStateData } = req;
  const fullName = fullStateData.state;
  const { index } = req.body;

  if (index === undefined) {
    return res
      .status(400)
      .json({ message: 'State fun fact index value required' });
  }

  const doc = await State.findOne({ stateCode: code });
  if (!doc?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${fullName}` });
  }
  if (index < 1 || index > doc.funfacts.length) {
    return res
      .status(404)
      .json({ message: `No Fun Fact found at that index for ${fullName}` });
  }

  doc.funfacts.splice(index - 1, 1);
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
