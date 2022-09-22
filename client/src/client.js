import sendQueryAsync from "./sendQuery"

const client = {
  getPersonsAsync: async () => {
    const persons = await sendQueryAsync("persons");
    return JSON.parse(persons);
  },
  getPersonAsync: async (id) => {
    const person = await sendQueryAsync("persons/" + id);
    return JSON.parse(person);
  },
  savePersonAsync: async (person) => {
    await sendQueryAsync("persons", "POST", person);
  }
}

export default client;