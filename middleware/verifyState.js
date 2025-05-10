// middleware/verifyState.js
const statesData = require('../models/statesData.json');

const verifyState = (req, res, next) => {
  const input = req.params.state;
  if (!input) {
    return res
      .status(404)
      .json({ message: 'State abbreviation is required' });
  }

  const code = input.toUpperCase();
  const found = statesData.find(s => s.code === code);
  if (!found) {
    return res
      .status(404)
      .json({ message: 'Invalid state abbreviation parameter' });
  }

  req.code = code;
  req.fullStateData = found;
  next();
};

module.exports = verifyState;
