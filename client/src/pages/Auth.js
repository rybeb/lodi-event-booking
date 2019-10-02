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
  // const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setglobalError] = useState(null);

  const context = useContext(AuthContext);

  // const switchModeHandler = () => {
  //   setIsLogin(!isLogin);
  // };
  const submitHandler = async (email, password) => {
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
    try {
      const res = await axios.post('/graphql', requestBody);
      const { token, userId, tokenExpiration } = res.data.data.login;
      context.login(token, userId, tokenExpiration);
      console.log(res);
    } catch (err) {
      console.log(err.response.data.errors[0].message);
      // globalError = JSON.stringify(err.response.data.errors[0].message);
      // console.log(globalError);
      setglobalError(err.response.data.errors[0].message);
      setIsLoading(false);
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        const { email, password } = values;
        setIsLoading(true);
        submitHandler(email, password, () => {
          resetForm();
        });
      }}
      initialValues={{ email: '', password: '' }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        isSubmitting
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
              <div>
                <button
                  type='submit'
                  className='btn btn-dark'
                  disabled={isLoading}
                >
                  Login
                </button>
                {/* <button type='button' onClick={switchModeHandler}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button> */}
              </div>
            </Form>
          )}
        </>
      )}
    </Formik>

    // <form className='auth-form' onSubmit={submitHandler}>
    //   <div className='form-control'>
    //     <label htmlFor='email'>E-mail</label>
    //     <input
    //       type='email'
    //       id='email'
    //       placeholder='example@example.com'
    //       ref={emailEl}
    //     />
    //   </div>
    //   <div className='form-control'>
    //     <label htmlFor='password'>Password</label>
    //     <input
    //       type='password'
    //       id='password'
    //       placeholder='Make it secure'
    //       ref={passwordEl}
    //     />
    //   </div>
    //   <div className='form-actions'>
    //     <button type='submit'>Submit</button>
    //     <button type='button' onClick={switchModeHandler}>
    //       Switch to {isLogin ? 'Signup' : 'Login'}
    //     </button>
    //   </div>
    // </form>
  );
};

export default AuthPage;
