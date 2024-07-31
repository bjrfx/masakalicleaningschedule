import Nav from 'react-bootstrap/Nav';

function Tabs() {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/weeklyCleaningData">Weekly Cleaning Data</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href='/dailyCheckListData'>Daily Checklist Data</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Tabs;