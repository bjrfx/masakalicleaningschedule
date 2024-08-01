import React, { useState, useEffect, Fragment } from 'react';
import { Card, Container, Table, Form, FormControl, InputGroup } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Tabs from '../components/Tabs/Tabs';

const DailyCheckListData = () => {
  const [dailyData, setDailyData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'daily'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort data by timestamp in descending order
      data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      setDailyData(data);
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = dailyData.filter(entry =>
    (entry.taskName && entry.taskName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.timestamp && new Date(entry.timestamp.seconds * 1000).toLocaleDateString().includes(searchTerm))
  );

  return (
    <Fragment>
      <Tabs />
      <h1 style={{ textAlign: 'center', marginTop: '5%', textDecoration: 'underline' }}>Daily Checklist</h1>
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
              <span>Date: {new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</span>
              <span>Assigned to: {entry.assignees ? entry.assignees.join(', ') : 'N/A'}</span>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{entry.taskName}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={entry.completed || false}
                        readOnly
                      />
                    </td>
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

export default DailyCheckListData;