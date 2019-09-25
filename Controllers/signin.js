const signinHandler = (bcrypt, db) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json("Unable to sign In");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const { hash, email } = data[0];
      const isValid = bcrypt.compareSync(password, hash);
      if (isValid) {
        return db("users")
          .select("*")
          .where("email", "=", email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => {
            res.status(400).json("Unable to get user");
          });
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch(err => {
      res.status(400).json("wrong credentials");
    });
};
module.exports = {
  signinHandler: signinHandler
};
