import React, { useState } from 'react';
import { Container, Table, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { days, cleaningDays } from '../data/data';

const WeeklyCleaningForm = () => {
  const [formData, setFormData] = useState(
    days.reduce((acc, day) => {
      acc[day] = { task: '', status: '', comment: '' };
      return acc;
    }, {})
  );
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (day, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [field]: value,
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
      await addDoc(collection(db, 'weekly'), {
        ...formData,
        name,
        timestamp,
      });
      setSubmittedName(name);
      setSubmittedDate(new Date().toLocaleDateString());
      setShowModal(true);
      // Reset form after submission
      setFormData(
        days.reduce((acc, day) => {
          acc[day] = { task: '', status: '', comment: '' };
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
    navigate('/weeklyCleaningData');
  };

  return (
    <Container>
      <h1 style={{ textAlign: 'center', marginTop: '5%', textDecoration: 'underline' }}>Weekly Cleaning Form</h1>
      <Form onSubmit={handleSubmit}>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              {days.map((day, index) => (
                <th key={index}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Task</td>
              {days.map((day, index) => (
                <td key={index}>
                  {index < cleaningDays.length ? cleaningDays[index] : ''}
                </td>
              ))}
            </tr>
            <tr>
              <td>Status</td>
              {days.map((day, index) => (
                <td key={index}>
                  <Form.Control
                    as="select"
                    value={formData[day].status}
                    onChange={(e) => handleInputChange(day, 'status', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="done">Done</option>
                    <option value="not yet">Not Yet</option>
                  </Form.Control>
                </td>
              ))}
            </tr>
            <tr>
              <td>Comment</td>
              {days.map((day, index) => (
                <td key={index}>
                  <Form.Control
                    type="text"
                    value={formData[day].comment}
                    onChange={(e) => handleInputChange(day, 'comment', e.target.value)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
        <Form.Group controlId="formName">
          <Form.Label>Submitted by</Form.Label>
          <Form.Control type="text" value={name} onChange={handleNameChange} />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
          Submit
        </Button>
      </Form>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Submitted by: {submittedName}</p>
          <p className="text-right">Date: {submittedDate}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default WeeklyCleaningForm;