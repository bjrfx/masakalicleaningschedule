import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Logo from '../../assets/Logo.png';

function NavigationBar({ toggleTheme, theme }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <img src={Logo} alt="Masakali Logo" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dailyCheckList">Daily Checklist Form</Nav.Link>
            <Nav.Link href="/weeklyCleaningForm">Weekly Cleaning Form</Nav.Link>
            <NavDropdown title="Data" id="basic-nav-dropdown">
              <NavDropdown.Item href="/weeklyCleaningData">Weekly Cleaning Data</NavDropdown.Item>
              <NavDropdown.Item href="/dailyCheckListData">Daily Checklist Data</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          {/* <Button variant="outline-light" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;