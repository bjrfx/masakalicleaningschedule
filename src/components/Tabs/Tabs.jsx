import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
function Tabs() {
  return (
    <Nav variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link as={Link} to='/weeklyCleaningData'>Weekly Cleaning Data</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to='/dailyCheckListData'>Daily Checklist Data</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Tabs;