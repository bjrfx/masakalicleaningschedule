import React, { useState, Fragment } from 'react';
import { Card, Container, Button, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { dailyChecklist } from '../data/data';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DailyCheckList = () => {
  const [formState, setFormState] = useState(
    dailyChecklist.reduce((acc, item) => {
      acc[item] = false;
      return acc;
    }, {})
  );
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const navigate = useNavigate();

  const handleCheckboxChange = (item) => {
    setFormState((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timestamp = serverTimestamp();
    try {
      await addDoc(collection(db, 'daily'), {
        ...formState,
        name: name,
        timestamp,
      });
      setSubmittedName(name);
      setSubmittedDate(new Date().toLocaleDateString());
      setShowModal(true);
      // Reset form after submission
      setFormState(
        dailyChecklist.reduce((acc, item) => {
          acc[item] = false;
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
              <Form.Check
                inline
                label={item}
                name="group1"
                type="checkbox"
                id={`checkbox-${index}`}
                key={index}
                checked={formState[item]}
                onChange={() => handleCheckboxChange(item)}
                style={{ margin: '10px' }}
              />
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