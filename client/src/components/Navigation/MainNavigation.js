import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

import { AuthContext } from '../../context/auth-context';

const MainNavigation = props => {
  const context = useContext(AuthContext);

  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Navbar.Brand href='/' className='p-2'>
        L O D I
      </Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse className='p-2'>
        <Nav className='mr-auto'>
          <NavLink className='nav-link' to='/events'>
            Events
          </NavLink>
        </Nav>
        <Nav>
          {!context.token && (
            <NavLink className='nav-link' to='/auth'>
              Login / Signup
            </NavLink>
          )}
        </Nav>
        {context.token && (
          <div
            className='d-flex justify-content-between'
            style={{ minWidth: '13.75rem' }}
          >
            <div className='mt-3 text-light d-flex align-items-center'>
              {context.userEmail}
            </div>
            <button
              type='button'
              className='btn btn-outline-light mt-3'
              onClick={context.logout}
            >
              Logout
            </button>
          </div>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MainNavigation;
