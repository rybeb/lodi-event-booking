import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Form, Spinner, Row, Col } from 'react-bootstrap';

import ModalComp from '../components/Modal/ModalComp';
import EventList from '../components/Events/EventList';
import { AuthContext } from '../context/auth-context';
import {
  CREATE_EVENT,
  FETCH_EVENTS,
  BOOK_EVENT
} from '../components/Queries/Queries';

const EventsPage = () => {
  const [validated, setValidated] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const context = useContext(AuthContext);
  const nameElRef = useRef(null);
  const locationElRef = useRef(null);
  const descriptionElRef = useRef(null);
  const startsElRef = useRef(null);
  const endsElRef = useRef(null);

  const [CreateEvent, { error: errorCreate }] = useMutation(CREATE_EVENT, {
    refetchQueries: [`FetchEvents`]
  });

  const [BookEvent] = useMutation(BOOK_EVENT, {
    refetchQueries: [`FetchBookings`]
  });

  const {
    loading: loadingFetch,
    error: errorFetch,
    data: dataFetch,
    refetch
  } = useQuery(FETCH_EVENTS);

  refetch();

  let events_ = [];

  if (dataFetch) dataFetch.events.map(event => events_.push(event));

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = event => {
    const name = nameElRef.current.value;
    const location = locationElRef.current.value;
    const description = descriptionElRef.current.value;
    const starts = startsElRef.current.value;
    const ends = endsElRef.current.value;

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    if (
      name.trim().length === 0 ||
      location.trim().length === 0 ||
      description.trim().length === 0 ||
      starts.trim().length === 0 ||
      ends.trim().length === 0
    ) {
      return;
    }

    CreateEvent({
      variables: {
        name: name,
        location: location,
        description: description,
        starts: starts,
        ends: ends
      }
    });

    setCreating(false);
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
    setValidated(false);
  };

  const showDetailHandler = eventId => {
    const selectedEvent = events_.find(e => e._id === eventId);
    setSelectedEvent(selectedEvent);
  };

  const bookEventHandler = () => {
    if (!context.token) {
      setSelectedEvent(null);
      setRedirect(true);
      return;
    }

    BookEvent({
      variables: {
        id: selectedEvent._id
      }
    }).then(() => {
      setSelectedEvent(null);
    });
  };

  if (redirect) return <Redirect push to='/auth' />;
  return (
    <>
      {creating && (
        <ModalComp
          title='Add Event'
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText='Confirm'
        >
          <Form noValidate validated={validated}>
            <Form.Group as={Row}>
              <Form.Label column sm={2} htmlFor='name'>
                Name
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                  type='text'
                  id='name'
                  ref={nameElRef}
                  placeholder='Name'
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2} htmlFor='location'>
                Location
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type='text'
                  id='location'
                  ref={locationElRef}
                  placeholder='Location'
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2} htmlFor='description'>
                Description
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as='textarea'
                  id='description'
                  rows='3'
                  ref={descriptionElRef}
                  placeholder='Description'
                  required
                />
              </Col>
              {/* <Form.Control.Feedback type='invalid'>
                Provide a description.
              </Form.Control.Feedback> */}
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2} htmlFor='starts'>
                Starts
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type='datetime-local'
                  id='starts'
                  ref={startsElRef}
                  placeholder='Starts'
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2} htmlFor='ends'>
                Ends
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  type='datetime-local'
                  id='ends'
                  ref={endsElRef}
                  placeholder='Ends'
                  required
                />
              </Col>
            </Form.Group>
          </Form>
        </ModalComp>
      )}
      {selectedEvent && (
        <ModalComp
          title={selectedEvent.title}
          canCancel
          canConfirm
          canView
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={context.token ? 'Book' : 'Login to Book'}
        >
          <h1>{selectedEvent.name}</h1>
          <h2>
            {new Date(selectedEvent.starts).toLocaleDateString()} -{' '}
            {selectedEvent.location}
          </h2>
          <p>{selectedEvent.description}</p>
        </ModalComp>
      )}
      {context.token && (
        <div
          className='text-center border border-dark p-1 my-2 mx-auto'
          style={{ width: '30rem', maxWidth: '80%' }}
        >
          <p>Share your own Events!</p>
          <button
            className='btn btn-dark mb-2'
            onClick={startCreateEventHandler}
          >
            Create Event
          </button>
        </div>
      )}
      {loadingFetch && (
        <Spinner
          animation='border'
          role='status'
          className='d-flex justify-content-center align-items-center mx-auto'
        />
      )}
      <EventList
        events={events_}
        authUserId={context.userId}
        onViewDetail={showDetailHandler}
      />
    </>
  );
};

export default EventsPage;
