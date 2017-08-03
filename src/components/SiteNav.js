import React, {Component} from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default class SiteNav extends Component {
  render() {
    return (
      <Navbar fixedTop collapseOnSelect fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer to="/">
              <a>Crosswords</a>
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/new">
              <NavItem eventKey={1}>New</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}