import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([
    // { name: "Arto Hellas", number: "040-123456", id: 1 },
    // { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    // { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    // { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const promise = axios.get("http://localhost:3003/api/contacts");

  console.log(promise);

  useEffect(() => {
    promise.then((response) => {
      console.log(response);
      setPersons(response.data);
    });
  }, []);

  const handleInputText = (e) => {
    console.log(e.target.value);
    const nameText = e.target.value;
    setNewName(nameText);
  };

  const handlePhoneNumber = (e) => {
    const number = e.target.value;
    setNewNumber(number);
  };

  const addContact = (e) => {
    e.preventDefault();
    const newContact = { name: newName, number: newNumber };

    const nameExists = persons.some((person) => person.name === newName);

    if (nameExists) {
      const existingContact = persons.filter((p) => p.name == newName);
      console.log(typeof existingContact[0].id);
      if (
        window.confirm(
          ` ${existingContact[0].name} is already in the list of contacts, do you want to change the number `
        )
      ) {
        axios
          .put(
            `http://localhost:3003/api/contacts/${existingContact[0].id}`,
            newContact
          )
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === existingContact[0].id ? response.data : person
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.error("Error updating contact:", error);
          });
      }
    } else if (newName === "") {
      alert("you must enter a name");
    } else if (newNumber === "") {
      alert("you must enter a valid number");
    } else {
      axios
        .post("http://localhost:3003/api/contacts", newContact)
        .then((response) => {
          // Use the response data to update state, ensuring the new contact includes an id
          alert("contact added");
          setPersons([...persons, response.data]);
          setNewName("");
          setNewNumber("");
        });
    }
  };

  const searchContacts = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredContacts = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteContact = (id) => {
    const person = persons.find((p) => p.id === id);
    console.log(person);
    if (window.confirm(`Are you sure you want to delete ${person.name}?`)) {
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          window.alert("Contact Deleted!");
        })
        .catch((error) => {
          window.alert("Failed to delete the contact");
          console.error(error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addContact}>
        <input onChange={searchContacts} value={searchQuery} />
        <div>
          name:
          <input onChange={handleInputText} value={newName} />
        </div>
        <div>
          number: <input onChange={handlePhoneNumber} value={newNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div style={{ margin: "20px" }}>
        {filteredContacts.length > 0
          ? filteredContacts.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid grey",
                  width: "25vw",
                  padding: "2rem",
                  margin: "15px",
                }}
              >
                <div>
                  <p>Name: {p.name}</p>
                  <p>Number: {p.number}</p>
                </div>
                <div>
                  <button onClick={() => deleteContact(p.id)}>Delete</button>
                </div>
              </div>
            ))
          : "No names in the phone book"}
      </div>
    </div>
  );
};

export default App;
