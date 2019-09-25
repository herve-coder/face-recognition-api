const saltRounds = 10;
const registerHandler = (bcrypt, db) => (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  if (!name || !email || !password) {
    return res.json("Unable to register");
  }
  db.transaction(trx => {
    trx("login")
      .transacting(trx)
      .insert({
        hash: hash,
        email: email
      })
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => {
    res.status(400).json("Unable to register");
  });
};

module.exports = {
  registerHandler: registerHandler
};
