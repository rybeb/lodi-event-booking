import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';

import { AuthContext } from '../context/auth-context';
import './Auth.css';

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid Email!')
    .max(30, 'Must be shorter than 30!')
    .required('Email is required!'),
  password: Yup.string()
    .min(4, 'Password must be 4 characters or longer!')
    .max(16, 'Must be shorter than 16!')
    .required('Password is required!')
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setglobalError] = useState(null);

  const context = useContext(AuthContext);

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = async (email, password) => {
    const SIGNUP_QUERY = {
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
    const LOGIN_QUERY = {
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
    const requestBody = isLogin ? LOGIN_QUERY : SIGNUP_QUERY;
    try {
      const res = await axios.post(
        'http://localhost:5000/graphql',
        requestBody
      );
      console.log(res);
      if (isLogin) {
        setIsLoading(false);
        const { token, userId, tokenExpiration } = res.data.data.login;
        return context.login(token, userId, tokenExpiration);
      } else {
        if (res.data.data.createUser !== null) {
          setIsLoading(false);
          return setglobalError('User created!');
        }
        const { message } = res.data.errors[0];
        setIsLoading(false);
        return setglobalError(message);
      }
    } catch (err) {
      setIsLoading(false);
      setglobalError(() => {
        if (err.response) return err.response.data.errors[0].message;
      });
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        const { email, password } = values;
        setIsLoading(true);
        submitHandler(email, password);
        resetForm();
      }}
      initialValues={{ email: '', password: '' }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
        handleReset
      }) => (
        <>
          {isLoading ? (
            <Spinner
              animation='border'
              role='status'
              className='d-flex justify-content-center align-items-center mx-auto'
            />
          ) : (
            <Form noValidate onSubmit={handleSubmit} className='auth-form'>
              <Form.Group className='d-flex justify-content-between align-items-start'>
                <p>{isLogin ? 'Login' : 'Signup'}</p>
                <p
                  className='cursor-pointer font-weight-bold text-dark'
                  onClick={() => {
                    switchModeHandler();
                    handleReset();
                  }}
                >
                  Switch to {isLogin ? 'Signup' : 'Login'}
                </p>
              </Form.Group>
              <Form.Group>
                {globalError && (
                  <p className='text-danger small'>{globalError}</p>
                )}
                <Form.Control
                  required
                  type='email'
                  name='email'
                  value={values.email}
                  placeholder='Email'
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.email}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type='password'
                  name='password'
                  value={values.password}
                  placeholder='Password'
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <button
                  type='submit'
                  className='btn btn-dark'
                  disabled={isLoading}
                >
                  {!isLogin ? 'Signup' : 'Login'}
                </button>
              </Form.Group>
            </Form>
          )}
        </>
      )}
    </Formik>
  );
};

export default AuthPage;
