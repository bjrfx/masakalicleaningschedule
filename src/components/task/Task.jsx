import React from 'react';
import TaskAssignment from './TaskAssignment';
import { Card, Container } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
const dailyTasks = [
  "Dishwash area cleaning",
  "Floor Cleaning when closing",
  "Cold storage room cleaning & arranging",
  "Garbage & dustbin cleaning",
  "Gas line & power supply turn off when closing",
  "Out side food clearance",
    "Spices lids closing",
    "Ranges, Tables & tabletops cleaning",
    "Drainage holes cleaning",
    "Fryer oil filter",
  // Add other daily tasks here
];

const weeklyTasks = [
  "Basement Cleaning & Tandoori vacuum",
  "Coal rooms cleaning",
  "Outside area cleaning",
    "Floor deep cleaning & shelf",
    "Hoods cleaning",
  // Add other weekly tasks here
];

const Task = () => (
  <Container>
    <Stack gap={4}> 
    <Card style={{margin: '5%', padding: '2%'}}>
    <TaskAssignment tasks={dailyTasks} taskName='Assign Daily Task' isWeekly={false} />
    </Card>
    <Card style={{margin: '5%', padding: '2%'}}>
    <TaskAssignment tasks={weeklyTasks} taskName='Assign Weekly Task' isWeekly={true} />
    </Card>
    </Stack>
  </Container>
);

export default Task;