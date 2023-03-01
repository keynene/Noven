/* eslint-disable */ //warning 제거
import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import AppRouter from './components/Router';

/* Actions */
import {LoggedIn, LoggedOut} from 'store.js';

function App() {

  let navigate = useNavigate();
  let state = useSelector((state) => {return state})
  let dispatch = useDispatch();

  const [userObj, setUserObj] = useState(null);

  useEffect(()=>{
    if (localStorage.getItem('login') === 'true'){
      dispatch(LoggedIn())
    }
  },[])

  return (
    <div className="App">
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="#home">No ·_· ven</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={()=>{ navigate('/') }}>Home</Nav.Link>
            {
              state.isLoggedIn === false ? 
                <Nav.Link onClick={()=>{ navigate('/join') }}>Join Us</Nav.Link>
              :
                <Nav.Link onClick={()=>{ navigate('mypage') }}>MyPage</Nav.Link>
            }
            <Nav.Link onClick={()=>{ 
              dispatch(LoggedOut())
              navigate('/')
            }}>LogOut</Nav.Link>

            { 
              state.isLoggedIn === true ? 
                null
              :
                <Nav.Link onClick={()=>{ navigate('/login') }}>Login</Nav.Link>
            }

          </Nav>
        </Container>
      </Navbar>

      <AppRouter />
    </div>
  );
}

export default App;
