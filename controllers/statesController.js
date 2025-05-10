const State = require('../models/States');
const statesData = require('../models/statesData.json');

// GET /states?contig=
const getAllStates = async (req, res) => {
  let filtered = statesData;
  if (req.query.contig === 'true') {
    filtered = filtered.filter(s => s.code !== 'AK' && s.code !== 'HI');
  } else if (req.query.contig === 'false') {
    filtered = filtered.filter(s => s.code === 'AK' || s.code === 'HI');
  }

  const mongo = await State.find();
  const merged = filtered.map(s => {
    const m = mongo.find(x => x.stateCode === s.code);
    return m
      ? { ...s, funfacts: m.funfacts }
      : s;
  });

  res.json(merged);
};

// GET /states/:state
const getState = async (req, res) => {
  const base = { ...req.fullStateData };
  const mongoState = await State.findOne({ stateCode: req.code });
  if (mongoState?.funfacts?.length) {
    base.funfacts = mongoState.funfacts;
  }
  res.json(base);
};

// GET /states/:state/funfact
const getFunFact = async (req, res) => {
  const mongoState = await State.findOne({ stateCode: req.code });
  if (!mongoState?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${req.fullStateData.state}` });
  }
  const idx = Math.floor(Math.random() * mongoState.funfacts.length);
  res.json({ funfact: mongoState.funfacts[idx] });
};

// POST /states/:state/funfact
const createFunFact = async (req, res) => {
  const { funfacts } = req.body;
  if (!funfacts) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }
  if (!Array.isArray(funfacts)) {
    return res
      .status(400)
      .json({ message: 'State fun facts value must be an array' });
  }

  let state = await State.findOne({ stateCode: req.code });
  if (!state) {
    state = new State({ stateCode: req.code, funfacts });
  } else {
    state.funfacts = state.funfacts.concat(funfacts);
  }

  const result = await state.save();
  res.status(201).json(result);
};

// PATCH /states/:state/funfact
const updateFunFact = async (req, res) => {
  const { index, funfact } = req.body;
  if (index === undefined) {
    return res
      .status(400)
      .json({ message: 'State fun fact index value required' });
  }
  if (!funfact) {
    return res
      .status(400)
      .json({ message: 'State fun fact value required' });
  }

  const state = await State.findOne({ stateCode: req.code });
  if (!state?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${req.fullStateData.state}` });
  }
  if (index < 1 || index > state.funfacts.length) {
    return res
      .status(404)
      .json({
        message: `No Fun Fact found at that index for ${req.fullStateData.state}`
      });
  }

  state.funfacts[index - 1] = funfact;
  await state.save();
  res.json(state);
};

// DELETE /states/:state/funfact
const deleteFunFact = async (req, res) => {
  const { index } = req.body;
  if (index === undefined) {
    return res
      .status(400)
      .json({ message: 'State fun fact index value required' });
  }

  const state = await State.findOne({ stateCode: req.code });
  if (!state?.funfacts?.length) {
    return res
      .status(404)
      .json({ message: `No Fun Facts found for ${req.fullStateData.state}` });
  }
  if (index < 1 || index > state.funfacts.length) {
    return res
      .status(404)
      .json({
        message: `No Fun Fact found at that index for ${req.fullStateData.state}`
      });
  }

  state.funfacts.splice(index - 1, 1);
  await state.save();
  res.json(state);
};

// GET /states/:state/capital
const getCapital = (req, res) => {
  res.json({
    state: req.fullStateData.state,
    capital: req.fullStateData.capital_city
  });
};

// GET /states/:state/nickname
const getNickname = (req, res) => {
  res.json({
    state: req.fullStateData.state,
    nickname: req.fullStateData.nickname
  });
};

// GET /states/:state/population
const getPopulation = (req, res) => {
  res.json({
    state: req.fullStateData.state,
    population: req.fullStateData.population.toLocaleString()
  });
};

// GET /states/:state/admission
const getAdmission = (req, res) => {
  res.json({
    state: req.fullStateData.state,
    admitted: req.fullStateData.admission_date
  });
};

module.exports = {
  getAllStates,
  getState,
  getFunFact,
  createFunFact,
  updateFunFact,
  deleteFunFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission
};
