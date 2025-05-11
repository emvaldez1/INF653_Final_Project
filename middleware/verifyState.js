const statesData = require('../models/statesData.json');

const verifyState = (req, res, next) => {
  const input = req.params.state;
  if (!input) {
    return res.status(400).json({ message: 'State abbreviation is required' });
  }

  const code = input.toUpperCase();
  const foundState = statesData.find(state => state.code === code);

  if (!foundState) {
    return res.status(400).json({ message: 'Invalid state abbreviation parameter' });
  }

  req.code = code;
  req.fullStateData = foundState; // optionally pass full data if needed in controllers
  next();
};

module.exports = verifyState;

