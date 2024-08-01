import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, CloseButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';

const Home = () => {
    const [dailyTasks, setDailyTasks] = useState([]);
    const [weeklyTasks, setWeeklyTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const dailySnapshot = await getDocs(collection(db, 'daily_tasks'));
            const weeklySnapshot = await getDocs(collection(db, 'weekly_tasks'));

            const dailyData = dailySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const weeklyData = weeklySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setDailyTasks(dailyData);
            setWeeklyTasks(weeklyData);
        };

        fetchTasks();
    }, []);

    const handleMarkAsCompleted = async (task, isWeekly) => {
        const collectionName = isWeekly ? 'weekly_tasks' : 'daily_tasks';

        // Add the task to the relevant completed collection
        const completedCollection = isWeekly ? 'weekly' : 'daily';
        await addDoc(collection(db, completedCollection), {
            taskName: task.taskName,
            assignees: task.assignees,
            timestamp: new Date(),
            completed: true,
        });

        // Remove the task from the tasks collection (to hide the card)
        await deleteDoc(doc(db, collectionName, task.id));

        // Refresh the tasks
        setDailyTasks(prev => prev.filter(t => t.id !== task.id));
        setWeeklyTasks(prev => prev.filter(t => t.id !== task.id));
    };

    const handleMarkAsIncomplete = async (task, isWeekly) => {
        const collectionName = isWeekly ? 'weekly_tasks' : 'daily_tasks';

        // Add the task to the relevant completed collection with completed status as false
        const incompleteCollection = isWeekly ? 'weekly' : 'daily';
        await addDoc(collection(db, incompleteCollection), {
            taskName: task.taskName,
            assignees: task.assignees,
            timestamp: new Date(),
            completed: false,
        });

        // Remove the task from the tasks collection (to hide the card)
        await deleteDoc(doc(db, collectionName, task.id));

        // Refresh the tasks
        setDailyTasks(prev => prev.filter(t => t.id !== task.id));
        setWeeklyTasks(prev => prev.filter(t => t.id !== task.id));
    };

    const handleCancelTask = async (task, isWeekly) => {
        const collectionName = isWeekly ? 'weekly_tasks' : 'daily_tasks';

        // Remove the task from the tasks collection (to hide the card)
        await deleteDoc(doc(db, collectionName, task.id));

        // Refresh the tasks
        setDailyTasks(prev => prev.filter(t => t.id !== task.id));
        setWeeklyTasks(prev => prev.filter(t => t.id !== task.id));
    };

    return (
        <Container style={{ marginTop: '5%', marginBottom: '5%' }}>
            <Row className="mb-4">
                <Col>
                    <Card className="text-center">
                        <Card.Header>Welcome to Masakali Hygiene Tracker</Card.Header>
                        <Card.Body>
                            <Card.Title>Organize Your Cleaning Tasks Efficiently</Card.Title>
                            <Card.Text>
                                This application helps you manage daily and weekly cleaning tasks with ease. Navigate through the tabs to submit and view your cleaning schedules.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Card style={{marginBottom: '5%'}}>
                <Card.Header>
                    <h2>Assigned Daily Tasks</h2>
                </Card.Header>
                <Row>
                    {dailyTasks.map(task => (
                        <Col key={task.id} md={4} className="mb-4" style={{margin: '2%'}}>
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${task.id}`}>Cancel Task</Tooltip>}
                                    >
                                        <CloseButton onClick={() => handleCancelTask(task, false)} />
                                    </OverlayTrigger>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>{task.taskName}</Card.Title>
                                    <Card.Text>Assigned to: {task.assignees.join(', ')}</Card.Text>
                                    <Button variant="danger" onClick={() => handleMarkAsIncomplete(task, false)}>Mark as Incomplete</Button>
                                    <Button variant="success" onClick={() => handleMarkAsCompleted(task, false)} style={{ marginLeft: '10px' }}>Mark as Completed</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
            <Card>
                <Card.Header> <h2>Assigned Weekly Tasks</h2></Card.Header>
                <Row>
                    {weeklyTasks.map(task => (
                        <Col key={task.id} md={4} className="mb-4" style={{margin: '2%'}}>
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-${task.id}`}>Cancel Task</Tooltip>}
                                    >
                                        <CloseButton onClick={() => handleCancelTask(task, true)} />
                                    </OverlayTrigger>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>{task.taskName}</Card.Title>
                                    <Card.Text>Assigned to: {task.assignees.join(', ')}</Card.Text>
                                    <Button variant="danger" onClick={() => handleMarkAsIncomplete(task, true)}>Mark as Incomplete</Button>
                                    <Button variant="success" onClick={() => handleMarkAsCompleted(task, true)} style={{ marginLeft: '10px'}}>Mark as Completed</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </Container>
    );
};

export default Home;