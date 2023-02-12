import { useAuthenticationContext } from "@/context/AuthenticationContext";
import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const Header = () => {
  const { user, logout } = useAuthenticationContext();
  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Navbar.Brand href="/">PetsCare</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title={user?.name} id="nav-dropdown">
              <NavDropdown.Item>{user?.email}</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
