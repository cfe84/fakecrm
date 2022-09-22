const fs = require("fs");
const path = require("path");

module.exports = function Store(filepath) {
  let persons = {};

  if (fs.existsSync(filepath)) {
    persons = JSON.parse(fs.readFileSync(filepath));
  }

  return {
    getPersons: function() {
      return Object.values(persons);
    },
    getPerson: function(id) {
      return persons[id];
    },
    upsertPerson: function(person) {
      persons[person.id] = person;
      fs.writeFileSync(filepath, JSON.stringify(persons));
    },
    deletePerson: function(personId) {
      delete persons[personId];
      fs.writeFileSync(filepath, JSON.stringify(persons));
    }
  }
}