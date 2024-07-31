import Accordion from 'react-bootstrap/Accordion';
import DailyCheckListData from '../../pages/DailyCheckListData';
import WeeklyCleaningData from '../../pages/WeeklyCleaningData';

function AccordianItems() {
  return (
    <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Daily Checklist Data</Accordion.Header>
        <Accordion.Body>
          <DailyCheckListData />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Weekly Cleaning Data</Accordion.Header>
        <Accordion.Body>
          <WeeklyCleaningData />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordianItems;