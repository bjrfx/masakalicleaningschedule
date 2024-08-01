import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { db } from '../../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AssignedTasksCard = ({ taskName, assignees, isWeekly, id }) => {
  const handleMarkAsCompleted = async () => {
    try {
      await updateDoc(doc(db, isWeekly ? 'weekly_tasks' : 'daily_tasks', id), {
        completed: true,
      });
    } catch (e) {
      console.error('Error marking task as completed: ', e);
    }
  };

  const handleMarkAsIncomplete = async () => {
    try {
      await updateDoc(doc(db, isWeekly ? 'weekly_tasks' : 'daily_tasks', id), {
        completed: false,
      });
    } catch (e) {
      console.error('Error marking task as incomplete: ', e);
    }
  };

  const handleCancelTask = async () => {
    try {
      await deleteDoc(doc(db, isWeekly ? 'weekly_tasks' : 'daily_tasks', id));
    } catch (e) {
      console.error('Error canceling task: ', e);
    }
  };

  return (
    <Card style={{ marginBottom: '20px' }}>
      <Card.Body>
        <Card.Title>{taskName}</Card.Title>
        <Card.Text>
          Assigned to: {assignees.join(', ')}
        </Card.Text>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="danger" onClick={handleMarkAsIncomplete}>
            Mark as Incomplete
          </Button>
          <Button variant="success" onClick={handleMarkAsCompleted}>
            Mark as Completed
          </Button>
          <Button variant="secondary" onClick={handleCancelTask}>
            Cancel Task
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AssignedTasksCard;