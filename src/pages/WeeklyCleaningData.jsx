import React, { useState, useEffect, Fragment } from 'react';
import { Card, Container, Table, Form, FormControl, InputGroup } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Tabs from '../components/Tabs/Tabs';
import { days, cleaningDays } from '../data/data';

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
    (entry.name && entry.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.timestamp && new Date(entry.timestamp.seconds * 1000).toLocaleDateString().includes(searchTerm))
  );

  return (
    <Fragment>
      <Tabs />
      <h1 style={{ textAlign: 'center', marginTop: '5%', textDecoration: 'underline' }}>Weekly Cleaning Data</h1>
      <Container>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search by name or date"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>
        {filteredData.map((entry) => (
          <Card key={entry.id} style={{ marginBottom: '20px' }}>
            <Card.Header className="d-flex justify-content-between">
              <span>Weekly Cleaning Schedule | {entry.timestamp ? new Date(entry.timestamp.seconds * 1000).toLocaleDateString() : 'No Date'}</span>
              <span>Submitted by: {entry.name}</span>
            </Card.Header>
            <Card.Body>
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
                        <Form.Check
                          type="checkbox"
                          checked={entry[day]?.status === 'done'}
                          readOnly
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Comment</td>
                    {days.map((day, index) => (
                      <td key={index}>
                        {entry[day]?.comment || ''}
                      </td>
                    ))}
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