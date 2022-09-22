const express = require("express");
const Store = require("./store");
const app = express();
app.use(express.json());
const port = 3000;

const store = Store("store.json");

app.use(express.static('client/dist'));
app.use(express.json());

app.listen(port, () => {
  console.log('Server is running at http://localhost:' + port);
});

app.get("/api/persons", (req, res) => {
  res.statusCode = 200;
  res.json(store.getPersons());
  res.end();
})

app.get("/api/persons/:id", (req, res) => {
  const person = store.getPerson(req.params["id"])
  if (person) {
    res.statusCode = 200;
    res.json(person);
  } else {
    res.statusCode = 404;
  }
  res.end();
})

app.post("/api/persons", (req, res) => {
  const person = req.body;
  store.upsertPerson(person);
  res.statusCode = 200;
  res.end();
});