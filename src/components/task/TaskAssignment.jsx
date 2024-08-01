import React, { useState } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { MultiSelect } from "react-multi-select-component";
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const TaskAssignment = ({ tasks, taskName, isWeekly }) => {
  const [assignedTasks, setAssignedTasks] = useState(
    tasks.reduce((acc, task) => {
      acc[task] = { assignees: [] };
      return acc;
    }, {})
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const options = [
    { label: "Venkat", value: "Venkat" },
    { label: "Ramu", value: "Ramu" },
    { label: "Ashok", value: "Ashok" },
    { label: "Ashini Kumar", value: "Ashini Kumar" },
    { label: "Marwan", value: "Marwan" },
    { label: "Imran", value: "Imran" }
  ];

  const handleSelectChange = (task, selected) => {
    setAssignedTasks((prevState) => ({
      ...prevState,
      [task]: {
        assignees: selected,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSubmittedTasks = Object.keys(assignedTasks).filter(task => assignedTasks[task].assignees.length > 0).map(task => ({
      taskName: task,
      assignees: assignedTasks[task].assignees.map(assignee => assignee.value),
      isWeekly,
      completed: false,
      timestamp: serverTimestamp(),
    }));

    if (newSubmittedTasks.length === 0) {
      setModalMessage('Please assign at least one task to someone.');
      setShowModal(true);
      return;
    }

    try {
      const collectionName = isWeekly ? 'weekly_tasks' : 'daily_tasks';
      for (const task of newSubmittedTasks) {
        await addDoc(collection(db, collectionName), task);
      }
      setModalMessage('Task Assigned');
      setShowModal(true);
    } catch (e) {
      console.error('Error adding document: ', e);
      setModalMessage('Error assigning tasks. Please try again.');
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <Container style={{ marginTop: '5%' }}>
      <h1 style={{ textAlign: 'center', textDecoration: 'underline' }}>{taskName}</h1>
      <Form onSubmit={handleSubmit}>
        {tasks.map((task, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Form.Label style={{ marginRight: '10px', minWidth: '150px' }}>{task}</Form.Label>
            <MultiSelect
              options={options}
              value={assignedTasks[task].assignees}
              onChange={(selected) => handleSelectChange(task, selected)}
              labelledBy="Select Assignees"
              hasSelectAll={false}
              overrideStrings={{
                selectSomeItems: "Select Assignees",
                allItemsAreSelected: "All Selected",
              }}
            />
          </div>
        ))}
        <Button variant="primary" type="submit">
          Assign Tasks
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Task Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskAssignment;