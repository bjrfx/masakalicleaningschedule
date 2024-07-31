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
    entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(entry.timestamp.seconds * 1000).toLocaleDateString().includes(searchTerm)
  );

  return (
    <Fragment>
      <Tabs />
      <h1 style={{ textAlign: 'center', marginTop: '5%', textDecoration: 'underline' }}>Daily Checklist</h1>
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
              <span>Date: {new Date(entry.timestamp.seconds * 1000).toLocaleDateString()}</span>
              <span>Submitted by: {entry.name}</span>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Names</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(entry)
                    .filter(key => key !== 'id' && key !== 'name' && key !== 'timestamp')
                    .map((key, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{key}</td>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={entry[key]?.checked || false}
                            readOnly
                          />
                        </td>
                        <td>
                          {entry[key]?.selectedNames?.join(', ') || 'N/A'}
                        </td>
                      </tr>
                    ))}
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