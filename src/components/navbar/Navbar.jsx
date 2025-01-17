import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
// import Button from 'react-bootstrap/Button';
import Logo from '../../assets/Logo.png';
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/" className="d-flex align-items-center">
                    <img src={Logo} alt="Masakali Logo" className="logo" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link as={Link} to='/'>Home</Nav.Link>
                        <Nav.Link as={Link} to='/assignTask'>Assign Task</Nav.Link>
                        {/* <NavDropdown title="Form" id='basic-nav-dropdown' >
                            <Nav.Link style={{ color: 'black' }} as={Link} to='/dailyCheckList' >Daily Checklist Form</Nav.Link>
                            <Nav.Link style={{ color: 'black' }} as={Link} to='/weeklyCleaningForm' >Weekly Cleaning Form</Nav.Link>
                        </NavDropdown> */}
                        <NavDropdown title="Data" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to='/weeklyCleaningData'>Weekly Cleaning Data</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to='/dailyCheckListData' >Daily Checklist Data</NavDropdown.Item>
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