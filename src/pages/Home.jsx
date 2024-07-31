import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import AccordianItems from '../components/accordian/AccordianItems';
import { Link } from 'react-router-dom';

const Home = () => {
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
              <Button variant="primary" as={Link} to="/weeklyCleaningForm" style={{margin: '20px'}}>Get Started with Weekly Cleaning</Button>
              <Button variant="secondary" as={Link} to="/dailyCheckList" className="ml-2">Get Started with Daily Checklist</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <AccordianItems />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;