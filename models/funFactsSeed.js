require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./States');

const funFacts = [
  {
    stateCode: 'KS',
    funfacts: [
      "Kansas has more tornadoes per square mile than any other U.S. state.",
      "Dodge City is the windiest city in the United States.",
      "Kansas was the first state to prohibit alcohol in 1881."
    ]
  },
  {
    stateCode: 'MO',
    funfacts: [
      "St. Louis is home to the world’s tallest arch.",
      "The ice cream cone was invented at the 1904 World’s Fair in Missouri.",
      "Missouri has more than 6,000 known caves."
    ]
  },
  {
    stateCode: 'OK',
    funfacts: [
      "Oklahoma has the largest population of Native Americans in the U.S.",
      "The parking meter was invented in Oklahoma City.",
      "Oklahoma has more man-made lakes than any other state."
    ]
  },
  {
    stateCode: 'NE',
    funfacts: [
      "Nebraska is the only state with a unicameral (one-house) legislature.",
      "Kool-Aid was invented in Hastings, Nebraska.",
      "The largest mammoth fossil was found in Lincoln County, Nebraska."
    ]
  },
  {
    stateCode: 'CO',
    funfacts: [
      "Colorado has the highest average elevation of any state.",
      "The world's largest flat-top mountain is in Colorado (Grand Mesa).",
      "Colorado is the only state to turn down the Olympics."
    ]
  }
];

const seedFunFacts = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('Connected to MongoDB');

    for (const state of funFacts) {
      await State.findOneAndUpdate(
        { stateCode: state.stateCode },
        { stateCode: state.stateCode, funfacts: state.funfacts },
        { upsert: true }
      );
    }

    console.log('Fun facts seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding fun facts:', err);
    process.exit(1);
  }
};

seedFunFacts();

