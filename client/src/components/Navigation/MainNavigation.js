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
          {context.token && (
            <NavLink className='nav-link' to='/bookings'>
              Bookings
            </NavLink>
          )}
        </Nav>
        <Nav>
          {!context.token && (
            <NavLink className='nav-link' to='/auth'>
              Login / Signup
            </NavLink>
          )}
        </Nav>
        {context.token && (
          <button
            type='button'
            className='btn btn-outline-light mt-3'
            onClick={context.logout}
          >
            Logout
          </button>
        )}
      </Navbar.Collapse>
    </Navbar>
    // <header className='main-navigation'>
    //   <div className='main-navigation__logo'>
    //     <h1>LODI</h1>
    //   </div>
    //   <nav className='main-navigation__items'>
    //     <ul>
    //       {!context.token && (
    //         <li>
    //           <NavLink to='/auth'>Login</NavLink>
    //         </li>
    //       )}
    //       <li>
    //         <NavLink to='/events'>Events</NavLink>
    //       </li>
    //       {context.token && (
    //         <>
    //           <li>
    //             <NavLink to='/bookings'>Bookings</NavLink>
    //           </li>
    //           <li>
    //             <button onClick={context.logout}>Logout</button>
    //           </li>
    //         </>
    //       )}
    //     </ul>
    //   </nav>
    // </header>
  );
};

export default MainNavigation;
