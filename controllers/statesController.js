const State = require('../models/States');
const statesData = require('../models/statesData.json');

// GET /states/
const getAllStates = async (req, res) => {
  let filteredStates = statesData;

  const contig = req.query.contig;
  if (contig === 'true') {
    filteredStates = filteredStates.filter(state => state.code !== 'AK' && state.code !== 'HI');
  } else if (contig === 'false') {
    filteredStates = filteredStates.filter(state => state.code === 'AK' || state.code === 'HI');
  }

  const mongoStates = await State.find();

  const mergedStates = filteredStates.map(state => {
    const found = mongoStates.find(m => m.stateCode === state.code);
    return found ? { ...state, funfacts: found.funfacts } : state;
  });

  res.json(mergedStates);
};

// GET /states/:state
const getState = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const stateData = statesData.find(st => st.code === code);
  if (!stateData) return res.status(404).json({ message: 'State not found' });

  const mongoState = await State.findOne({ stateCode: code });
  if (mongoState?.funfacts?.length) {
    stateData.funfacts = mongoState.funfacts;
  }

  res.json(stateData);
};

// GET /states/:state/funfact
const getFunFact = async (req, res) => {
  const code = req.params.state.toUpperCase();
  const mongoState = await State.findOne({ stateCode: code });

  if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
    return res.status(404).json({ message: 'No Fun Facts found for ' + code });
  }

  const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
  res.json({ funfact: mongoState.funfacts[randomIndex] });
};

// GET /states/:state/capital
const getCapital = (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = statesData.find(st => st.code === code);

  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({ state: state.state, capital: state.capital_city });
};

// GET /states/:state/nickname
const getNickname = (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = statesData.find(st => st.code === code);

  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({ state: state.state, nickname: state.nickname });
};

// GET /states/:state/population
const getPopulation = (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = statesData.find(st => st.code === code);

  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({ state: state.state, population: state.population });
};

// GET /states/:state/admission
const getAdmission = (req, res) => {
  const code = req.params.state.toUpperCase();
  const state = statesData.find(st => st.code === code);

  if (!state) return res.status(404).json({ message: 'State not found' });

  res.json({ state: state.state, admitted: state.admission_date });
};

// POST /states/:state/funfact
const createFunFact = async (req, res) => {
    const stateCode = req.params.state.toUpperCase();
    const { funfacts } = req.body;
  
    if (!funfacts) {
      return res.status(400).json({ message: 'State fun facts value required' });
    }
  
    if (!Array.isArray(funfacts)) {
      return res.status(400).json({ message: 'State fun facts value must be an array' });
    }
  
    const state = await State.findOne({ stateCode: stateCode });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
  
    state.funfacts = state.funfacts ? state.funfacts.concat(funfacts) : funfacts;
  
    const result = await state.save();
    res.status(201).json(result);
  };  
  
  // PATCH /states/:state/funfact
  const updateFunFact = async (req, res) => {
    const code = req.params.state.toUpperCase();
    const { index, funfact } = req.body;
  
    if (!index) return res.status(400).json({ message: 'State fun fact index value required' });
    if (!funfact) return res.status(400).json({ message: 'State fun fact value required' });
  
    const state = await State.findOne({ stateCode: code });
    if (!state || !Array.isArray(state.funfacts) || state.funfacts.length < index) {
      return res.status(404).json({ message: 'No Fun Fact found at that index for ' + code });
    }
  
    state.funfacts[index - 1] = funfact;
    await state.save();
  
    res.json(state);
  };
  
  // DELETE /states/:state/funfact
  const deleteFunFact = async (req, res) => {
    const code = req.params.state.toUpperCase();
    const { index } = req.body;
  
    if (!index) return res.status(400).json({ message: 'State fun fact index value required' });
  
    const state = await State.findOne({ stateCode: code });
    if (!state || !Array.isArray(state.funfacts) || state.funfacts.length < index) {
      return res.status(404).json({ message: 'No Fun Fact found at that index for ' + code });
    }
  
    state.funfacts.splice(index - 1, 1);
    await state.save();
  
    res.json(state);
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