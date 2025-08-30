const { useState, useEffect, createContext, useContext } = React;

const ContactContext = createContext();

const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    id: null,
  });
  const [contactToDelete, setContactToDelete] = useState(null);

  const saveContact = () => {
    if (!newContact.name || !newContact.phone) return;

    if (newContact.id) {
      setContacts(
        contacts.map((contact) =>
          contact.id === newContact.id ? newContact : contact
        )
      );
    } else {
      const contactWithId = {
        ...newContact,
        id: Date.now(),
      };

      setContacts([...contacts, contactWithId]);
    }
    setNewContact({
      name: "",
      email: "",
      phone: "",
      address: "",
      id: null,
    });

    const modal = bootstrap.Modal.getInstance(document.getElementById("modal"));
    modal.hide();
  };

  const deleteContact = () => {
    setContacts(contacts.filter((contact) => contact.id !== contactToDelete));
    setContactToDelete(null);
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("deleteModal")
    );
    modal.hide();
  };

  const editContact = (contact) => {
    setNewContact({ ...contact });
    const modal = new bootstrap.Modal(document.getElementById("modal"));
    modal.show();
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setNewContact((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        saveContact,
        handleInputChange,
        newContact,
        editContact,
        setContactToDelete,
        deleteContact,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

const ContactCard = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{contact.name}</h5>
        <p className="card-text">Teléfono: {contact.phone}</p>
        {contact.email && <p className="card-text">Email: {contact.email}</p>}
        {contact.address && (
          <p className="card-text">Dirección: {contact.address}</p>
        )}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => onEdit(contact)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#deleteModal"
            onClick={() => onDelete(contact.id)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const Agenda = () => {
  const {
    contacts,
    saveContact,
    handleInputChange,
    newContact,
    editContact,
    setContactToDelete,
    deleteContact,
  } = useContext(ContactContext);

  return (
    <div className="agenda">
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-success button m-3"
          data-bs-toggle="modal"
          data-bs-target="#modal"
          onClick={() =>
            setNewContact({
              name: "",
              email: "",
              phone: "",
              address: "",
              id: null,
            })
          }
        >
          Añadir contacto
        </button>
      </div>

      <div className="container mt-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={editContact}
            onDelete={setContactToDelete}
          />
        ))}
      </div>

      <div
        className="modal fade"
        id="modal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {newContact.id ? "Editar contacto" : "Añadir un nuevo contacto"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label for="exampleInputName1" className="form-label">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={newContact.name}
                    onChange={handleInputChange}
                    aria-describedby="nameHelp"
                  />
                </div>
                <div className="mb-3">
                  <label for="exampleInputEmail1" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={newContact.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label for="exampleInputPhone1" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={newContact.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label for="exampleInputAddress1" className="form-label">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={newContact.address}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveContact}
              >
                {newContact.id ? "Actualizar contacto" : "Guardar contacto"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteModalLabel">
                Confirmar eliminación
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              ¿Estás seguro que deseas eliminar este contacto?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={deleteContact}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <ContactProvider>
    <Agenda />
  </ContactProvider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
