const State       = require('../models/States');
const statesData  = require('../models/statesData.json');

// GET /states/
const getAllStates = async (req, res) => {
  try {
    let filteredStates = statesData;
    const contig = req.query.contig;
    if (contig === 'true') {
      filteredStates = filteredStates.filter(s => s.code !== 'AK' && s.code !== 'HI');
    } else if (contig === 'false') {
      filteredStates = filteredStates.filter(s => s.code === 'AK' || s.code === 'HI');
    }

    const mongoStates = await State.find();
    const mergedStates = filteredStates.map(st => {
      const found = mongoStates.find(m => m.stateCode === st.code);
      return found ? { ...st, funfacts: found.funfacts } : st;
    });

    res.json(mergedStates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /states/:state
const getState = async (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const stateData = statesData.find(s => s.code === code);
    if (!stateData) return res.status(404).json({ message: 'State not found' });

    const mongoState = await State.findOne({ stateCode: code });
    if (mongoState?.funfacts?.length) {
      stateData.funfacts = mongoState.funfacts;
    }

    res.json(stateData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /states/:state/funfact
const getFunFact = async (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const mongoState = await State.findOne({ stateCode: code });

    if (!mongoState || !mongoState.funfacts?.length) {
      return res.status(404).json({ message: `No Fun Facts found for ${code}` });
    }

    const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
    res.json({ funfact: mongoState.funfacts[randomIndex] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /states/:state/capital
const getCapital = (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === code);
    if (!state) return res.status(404).json({ message: 'State not found' });

    res.json({ state: state.state, capital: state.capital_city });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /states/:state/nickname
const getNickname = (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === code);
    if (!state) return res.status(404).json({ message: 'State not found' });

    res.json({ state: state.state, nickname: state.nickname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /states/:state/population
const getPopulation = (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === code);
    if (!state) return res.status(404).json({ message: 'State not found' });

    res.json({ state: state.state, population: state.population });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /states/:state/admission
const getAdmission = (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const state = statesData.find(s => s.code === code);
    if (!state) return res.status(404).json({ message: 'State not found' });

    res.json({ state: state.state, admitted: state.admission_date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST /states/:state/funfact
const createFunFact = async (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const { funfacts } = req.body;

    if (!funfacts) 
      return res.status(400).json({ message: 'State fun facts value required' });
    if (!Array.isArray(funfacts)) 
      return res.status(400).json({ message: 'State fun facts value must be an array' });

    const state = await State.findOne({ stateCode: code });
    if (!state) 
      return res.status(404).json({ message: 'State not found' });

    state.funfacts = state.funfacts ? state.funfacts.concat(funfacts) : funfacts;
    const result = await state.save();

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// PATCH /states/:state/funfact
const updateFunFact = async (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const { index, funfact } = req.body;

    if (index === undefined) 
      return res.status(400).json({ message: 'State fun fact index value required' });
    if (!funfact) 
      return res.status(400).json({ message: 'State fun fact value required' });
    if (!Number.isInteger(index) || index < 1) 
      return res.status(400).json({ message: 'Index must be a positive integer' });

    const state = await State.findOne({ stateCode: code });
    if (!state || !state.funfacts?.length || state.funfacts.length < index) {
      return res.status(404)
                .json({ message: `No Fun Fact found at that index for ${code}` });
    }

    state.funfacts[index - 1] = funfact;
    await state.save();
    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE /states/:state/funfact
const deleteFunFact = async (req, res) => {
  try {
    const code = req.params.state.toUpperCase();
    const { index } = req.body;

    if (index === undefined) 
      return res.status(400).json({ message: 'State fun fact index value required' });
    if (!Number.isInteger(index) || index < 1) 
      return res.status(400).json({ message: 'Index must be a positive integer' });

    const state = await State.findOne({ stateCode: code });
    if (!state || !state.funfacts?.length || state.funfacts.length < index) {
      return res.status(404)
                .json({ message: `No Fun Fact found at that index for ${code}` });
    }

    state.funfacts.splice(index - 1, 1);
    await state.save();
    res.json(state);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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
