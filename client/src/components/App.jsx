import { DefaultButton, DetailsList, Label, List, PrimaryButton, Separator, Stack, Text, TextField } from '@fluentui/react';
import React from 'react';
import { useState, useMemo } from 'react';
import client from '../client';

function CreatePerson(props) {
  const person = props.person;
  const [name, setName] = useState(person.name || "");
  const [email, setEmail] = useState(person.email || "");
  const [phone, setPhone] = useState(person.phone || "");
  const id = useMemo(() => person.id || "p-" + Math.floor(Math.random() * 100000000).toString());

  const save = () => {
    client.savePersonAsync({id, name, email, phone}).then(() => props.onBack())
  }

  return <div>
    <Text variant='xLarge'>Edit a person</Text>
    <Label>Id: {id}</Label>
    <TextField label="Name" onChange={(_, v) => setName(v)} value={name}></TextField>
    <TextField label="Email" onChange={(_, v) => setEmail(v)} value={email}></TextField>
    <TextField label="Phone" onChange={(_, v) => setPhone(v)} value={phone}></TextField>
    <PrimaryButton onClick={save}>Save</PrimaryButton>
    <DefaultButton onClick={props.onBack}>Cancel</DefaultButton>
  </div>
}

function ViewPerson(props) {
  const person = props.person;

  return <div>
    <Text variant='xLarge'>{person.name}</Text>
    <Label>Id: <Text>{person.id}</Text></Label>
    <Label>Name: <Text>{person.name}</Text></Label>
    <Label>Email: <Text>{person.email}</Text></Label>
    <Label>Phone: <Text>{person.phone}</Text></Label>
    <PrimaryButton onClick={props.onEdit}>Edit</PrimaryButton>
    <DefaultButton onClick={props.onBack}>Cancel</DefaultButton>
  </div>
}

function PersonList(props) {
  const columns = [
    { key: "name", name: "Name", fieldName: "name", maxWidth: 125}, 
    { key: "email", name: "Email", fieldName: "email", maxWidth: 125}, 
    { key: "phone", name: "Phone", fieldName: "phone", maxWidth: 125}, 
  ]
  return <div>
    <Text variant='xLarge'>People</Text>
      <DetailsList
        items={props.persons}
        columns={columns}
        onItemInvoked={(i => props.onView(i))}
        getKey={(i => i.id)}
      ></DetailsList>
    <Separator></Separator>
    <PrimaryButton onClick={props.onCreate}>Create</PrimaryButton>
  </div>;
}

function parseQueryParams() {
  const qp = window.location.search;
  if (!qp) {
    return {};
  }
  const splat = qp.substring(1).split("&");
  const res = {};
  splat.forEach(sp => {
    const middle = sp.indexOf("=");
    res[sp.substring(0, middle)] = sp.substring(middle + 1);
  })
  return res;
}

function App() {
  const [persons, setPersons] = React.useState([]);
  const [state, setState] = React.useState("list");
  const [person, setPerson] = React.useState(undefined);

  const refresh = React.useCallback(() => {
    client.getPersonsAsync().then(persons => {
      setPersons(persons)
    });
  });

  React.useEffect(() => {
    refresh()
    const idFromQueryParams = parseQueryParams()["id"];
    if (idFromQueryParams) {
      client.getPersonAsync(idFromQueryParams).then(p => {
        console.log(p);
        setPerson(p);
        setState("view");
      })
    }
  }, []);

  return (<>
      {state === "list" && <PersonList 
        persons={persons} 
        onCreate={() =>{ setPerson({}) ; setState("create");}}
        onView={(person) =>{ setPerson(person) ; setState("view");}}
        ></PersonList>}
      {state === "view" && <ViewPerson
        person={person}
        onEdit={() => setState("create")}
        onBack={() => setState("list")}
      ></ViewPerson>}
      {state === "create" && <CreatePerson 
        person={person}
        onBack={() => {
          refresh();
          setState("list");
        }}></CreatePerson>}
    </>
  );
}


export default App;