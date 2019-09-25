const Clarifai = require("clarifai");
const app = new Clarifai.App({
  apiKey: "d164d6efb07e4dc9888c99b681ea1926"
});

const imageApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(response => {
      res.json(response);
    })
    .catch(err => res.status(400).json("No response"));
};
const imageHandler = db => (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => {
      res.status(400).json("Unable to get entries");
    });
};

module.exports = {
  imageHandler: imageHandler,
  imageApiCall: imageApiCall
};
