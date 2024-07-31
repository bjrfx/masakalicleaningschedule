import React, { useState, Fragment } from 'react';
import { Card, Container, Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { dailyChecklist } from '../data/data';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";

const DailyCheckList = () => {
  const [formState, setFormState] = useState(
    dailyChecklist.reduce((acc, item) => {
      acc[item] = { checked: false, selectedNames: [] };
      return acc;
    }, {})
  );
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const navigate = useNavigate();

  const options = [
    { label: "Venkat", value: "Venkat" },
    { label: "Ramu", value: "Ramu" },
    { label: "Ashok", value: "Ashok" },
    { label: "Ashini Kumar", value: "Ashini Kumar" },
    { label: "Marwan", value: "Marwan" },
    { label: "Imran", value: "Imran" }
  ];

  const handleCheckboxChange = (item) => {
    setFormState((prevState) => ({
      ...prevState,
      [item]: {
        ...prevState[item],
        checked: !prevState[item].checked,
      },
    }));
  };

  const handleSelectChange = (item, selected) => {
    setFormState((prevState) => ({
      ...prevState,
      [item]: {
        ...prevState[item],
        selectedNames: selected,
      },
    }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = serverTimestamp();
    try {
      const formData = Object.keys(formState).reduce((acc, key) => {
        acc[key] = {
          checked: formState[key].checked,
          selectedNames: formState[key].selectedNames.map((option) => option.value),
        };
        return acc;
      }, {});

      await addDoc(collection(db, 'daily'), {
        ...formData,
        name: name,
        timestamp,
      });
      setSubmittedName(name);
      setSubmittedDate(new Date().toLocaleDateString());
      setShowModal(true);
      // Reset form after submission
      setFormState(
        dailyChecklist.reduce((acc, item) => {
          acc[item] = { checked: false, selectedNames: [] };
          return acc;
        }, {})
      );
      setName('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/dailyCheckListData');
  };

  return (
    <Fragment>
      <h1 style={{ textAlign: 'center', marginTop: '5%', marginBottom: '5%', textDecoration: 'underline' }}>
        Daily Checklist
      </h1>
      <Container>
        <Card style={{ padding: '10px' }}>
          <Form onSubmit={handleSubmit}>
            {dailyChecklist.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Form.Check
                  inline
                  label={item}
                  name="group1"
                  type="checkbox"
                  id={`checkbox-${index}`}
                  checked={formState[item].checked}
                  onChange={() => handleCheckboxChange(item)}
                  style={{ marginRight: '10px' }}
                />
                <MultiSelect
                  options={options}
                  value={formState[item].selectedNames}
                  onChange={(selected) => handleSelectChange(item, selected)}
                  labelledBy="Select"
                  hasSelectAll={false}
                  overrideStrings={{
                    selectSomeItems: "Select Names",
                    allItemsAreSelected: "All Selected",
                  }}
                />
              </div>
            ))}
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={handleNameChange} />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
              Submit
            </Button>
          </Form>
        </Card>
      </Container>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Submitted by {submittedName}
          <br />
          Date: {submittedDate}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default DailyCheckList;