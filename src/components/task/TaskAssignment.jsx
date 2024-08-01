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

  // Assignees with emails
  const options = [
    { label: "Ashok", value: "Ashok", email: "kiran.bjrfx1@gmail.com" },
    { label: "Ramu", value: "Ramu", email: "phanikiran1234@gmail.com" },
    { label: "Ashini Kumar", value: "Ashini Kumar", email: "kiran.bjrfx@gmail.com" },
    { label: "Marwan", value: "Marwan", email: "kiran.bandarupalli@live.com" },
    { label: "Venkat", value: "Venkat", email: "imkiran@icloud.com" },
    { label: "Imran", value: "Imran", email: "kiran.bjrfx1@gmail.com" }
  ];

  const handleSelectChange = (task, selected) => {
    setAssignedTasks((prevState) => ({
      ...prevState,
      [task]: {
        assignees: selected,
      },
    }));
  };

  const sendEmail = async (recipients, taskName) => {
    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipients, taskName, recipientNames: recipients.map(r => options.find(o => o.email === r)?.label) }),
      });

      if (response.ok) {
        console.log('Email sent successfully');
      } else {
        console.error('Error sending email:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSubmittedTasks = Object.keys(assignedTasks)
      .filter(task => assignedTasks[task].assignees.length > 0)
      .map(task => ({
        taskName: task,
        assignees: assignedTasks[task].assignees.map(assignee => assignee.value),
        emails: assignedTasks[task].assignees.map(assignee => options.find(opt => opt.value === assignee.value)?.email),
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
        await sendEmail(task.emails, task.taskName);  // Send email to the assignees
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