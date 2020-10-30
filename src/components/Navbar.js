import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from "reactstrap";
import { NavLink } from "react-router-dom";

const CustomNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar className="navbar" light expand="md">
        <NavbarBrand href="/">Eklavya</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink
                to={"/topicfilter"}
                className="nav-link"
                activeClassName="nav-link--active"
                onClick={toggle}
              >
                Topic Sheets
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to={"/completedsheets"}
                className="nav-link"
                activeClassName="nav-link--active"
                onClick={toggle}
              >
                Completed Sheets
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to={"/testfilter"}
                className="nav-link"
                activeClassName="nav-link--active"
                onClick={toggle}
              >
                Test Papers
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to={"/completedtestpapers"}
                className="nav-link"
                activeClassName="nav-link--active"
                onClick={toggle}
              >
                Completed Tests
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to={"/logout"}
                className="nav-link"
                activeClassName="nav-link--active"
                onClick={toggle}
              >
                Logout
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavbar;
