import React, { useState, useContext } from 'react';
import { Formik } from 'formik';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useMutation } from '@apollo/react-hooks';
import styled from 'styled-components';

import { LOGIN, CREATE_USER } from '../components/Queries/Queries';
import { AuthContext } from '../context/auth-context';

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
  // const [globalError, setglobalError] = useState(null);
  const context = useContext(AuthContext);

  const [Login, { loading, error, data }] = useMutation(LOGIN, {
    errorPolicy: 'all'
  });
  const [
    CreateUser,
    { loading: loadingCreateUser, data: dataCreateUser, error: errorCreateUser }
  ] = useMutation(CREATE_USER);

  let globalError = '';

  if (loading || loadingCreateUser) {
    return (
      <Spinner
        animation='border'
        role='status'
        className='d-flex justify-content-center align-items-center mx-auto mt-5'
      />
    );
  }
  if (error) {
    globalError = 'Email and/or password is incorrect, please try again!';
  }
  if (data) {
    const { token, userId, tokenExpiration } = data.login;
    context.login(token, userId, tokenExpiration);
  }

  if (errorCreateUser) {
    globalError = 'User exist already!';
  }
  if (dataCreateUser) {
    globalError = 'User created!';
  }

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  return (
    <AuthContainer>
      <Formik
        validationSchema={schema}
        onSubmit={(values, { resetForm }) => {
          const { email, password } = values;
          if (isLogin) {
            Login({
              variables: { email, password }
            });
          } else {
            CreateUser({
              variables: { email, password }
            });
          }
          // resetForm();
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
            <Form onSubmit={handleSubmit} className='auth-form'>
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
                  type='text'
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
                  disabled={loading}
                >
                  {!isLogin ? 'Signup' : 'Login'}
                </button>
              </Form.Group>
            </Form>
          </>
        )}
      </Formik>
    </AuthContainer>
  );
};

export default AuthPage;

const AuthContainer = styled.div`
  .auth-form {
    width: 25rem;
    max-width: 80%;
    margin: 5rem auto;
  }
  .cursor-pointer {
    cursor: pointer;
  }
`;
