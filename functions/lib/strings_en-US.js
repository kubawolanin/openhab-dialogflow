/* eslint quote-props: ["error", "always"] */
/* eslint quotes: ["error", "double"] */

// eslint-disable-next-line quotes
const deepFreeze = require('deep-freeze');

const item = {
  "get": [
    "%(item)s is %(state)s"
  ],
  "set": [
    "Ok.",
    "Done.",
    "Setting %(item)s to $(state)s"
  ],
  "notfound": {
    "get": [
      "Sorry, I couldn't find an item called $(item)s"
    ],
    "set": [
      "Sorry, I couldn't find an item called $(item)s"
    ]
  }
};

const general = {
  "or": "or",
  /** Used to give responses for no inputs */
  "noInputs": [
    "I didn't hear that.",
    "If you're still there, say that again.",
    "We can stop here. See you soon."
  ],
  "suggestions": {
    /** Google Assistant will respond to more confirmation variants than just these suggestions */
    "confirmation": [
      "Sure",
      "No thanks"
    ]
  },
  "acknowledgers": [
    "OK",
    "Sure",
    "Alright",
    "You got it",
    "There you go",
    "Got it"
  ]
};

// Use deepFreeze to make the constant objects immutable so they are not unintentionally modified
module.exports = deepFreeze({
  item,
  general
});