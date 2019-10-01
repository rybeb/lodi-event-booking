import React, { useRef, useState, useContext } from 'react';

import axios from 'axios';
import { AuthContext } from '../context/auth-context';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const context = useContext(AuthContext);

  const emailEl = useRef(null);
  const passwordEl = useRef(null);

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = event => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    axios
      .post('/graphql', requestBody)
      .then(resData => {
        const { token, userId, tokenExpiration } = resData.data.data.login;
        if (isLogin && token) {
          context.login(token, userId, tokenExpiration);
        }
        console.log(resData);
      })
      .catch(err => {
        console.log(err, err.data);
      });
  };

  return (
    <form className='auth-form' onSubmit={submitHandler}>
      <div className='form-control'>
        <label htmlFor='email'>E-mail</label>
        <input type='email' id='email' ref={emailEl} />
      </div>
      <div className='form-control'>
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' ref={passwordEl} />
      </div>
      <div className='form-actions'>
        <button type='submit'>Submit</button>
        <button type='button' onClick={switchModeHandler}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
