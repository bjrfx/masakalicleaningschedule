import React, { useState, useEffect, Fragment } from 'react';
import { Card, Container, Table, Form, FormControl, InputGroup } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Tabs from '../components/Tabs/Tabs';

const WeeklyCleaningData = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'weekly'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWeeklyData(data);
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = weeklyData.filter(entry =>
    (entry.taskName && entry.taskName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.timestamp && new Date(entry.timestamp.seconds * 1000).toLocaleDateString().includes(searchTerm))
  );

  return (
    <Fragment>
      <Tabs />
      <h1 style={{ textAlign: 'center', marginTop: '5%', textDecoration: 'underline' }}>Weekly Cleaning Data</h1>
      <Container>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search by task name or date"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
        {filteredData.map((entry) => (
          <Card key={entry.id} style={{ marginBottom: '20px' }}>
            <Card.Header className="d-flex justify-content-between">
              <span>Weekly Cleaning Schedule | {entry.timestamp ? new Date(entry.timestamp.seconds * 1000).toLocaleDateString() : 'No Date'}</span>
              <span>Assigned to: {entry.assignees ? entry.assignees.join(', ') : 'N/A'}</span>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{entry.taskName}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={entry.completed || false}
                        readOnly
                      />
                    </td>
                    <td>{entry.comment || 'No comment'}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </Fragment>
  );
};

export default WeeklyCleaningData;