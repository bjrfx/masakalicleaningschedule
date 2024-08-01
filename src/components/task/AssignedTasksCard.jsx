import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { db } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

const AssignedTasksCard = ({ taskName, assignees = [], isWeekly, id, onTaskUpdate }) => {

  const handleDeleteTask = async () => {
    try {
      await deleteDoc(doc(db, isWeekly ? 'assigned_weekly_tasks' : 'assigned_daily_tasks', id));
      onTaskUpdate(); // Update the UI after deletion
      alert(`${taskName} has been removed.`);
    } catch (e) {
      console.error('Error deleting task: ', e);
    }
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <Card.Body>
        <Card.Title>{taskName}</Card.Title>
        <Card.Text>
          Assigned to: {assignees.length > 0 ? assignees.join(', ') : 'No assignees'}
        </Card.Text>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="danger" onClick={handleDeleteTask}>
            Incomplete
          </Button>
          <Button variant="success" onClick={handleDeleteTask}>
            Mark as Completed
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AssignedTasksCard;