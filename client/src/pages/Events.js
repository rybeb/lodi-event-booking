import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Form, Spinner, Row, Col } from 'react-bootstrap';

import { eventDate, date_full } from '../helper/date-helper';
import { MdLocationOn, MdAccessTime, MdAdd } from 'react-icons/md';
import ModalComp from '../components/Modal/ModalComp';
import EventList from '../components/Events/EventList';
import { AuthContext } from '../context/auth-context';
import {
  CREATE_EVENT,
  FETCH_EVENTS,
  BOOK_EVENT,
  FETCH_BOOKINGS
} from '../components/Queries/Queries';

const EventsPage = () => {
  const context = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [endDate, setEndDate] = useState(false);
  const [sDate, setSDate] = useState('');

  const nameElRef = useRef(null);
  const locationElRef = useRef(null);
  const descriptionElRef = useRef(null);
  const startsElRef = useRef(null);
  const endsElRef = useRef(null);

  const [CreateEvent] = useMutation(CREATE_EVENT, {
    refetchQueries: [`FetchEvents`]
  });

  const {
    loading: loadingBook,
    error: errorBook,
    data: dataBook,
    refetch: refetchBook
  } = useQuery(FETCH_BOOKINGS);

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

  refetchBook();

  let bookings_ = [];

  if (dataBook) dataBook.bookings.map(booking => bookings_.push(booking.event));

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = event => {
    const name = nameElRef.current.value;
    const location = locationElRef.current.value;
    const description = descriptionElRef.current.value;
    const starts = startsElRef.current.value;
    let ends = '';
    if (endDate) ends = endsElRef.current.value;

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
      starts.trim().length === 0
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
    }).then(() => setSelectedEvent(null));
  };

  const addEndDate = () => {
    setEndDate(!endDate);
  };

  if (redirect) return <Redirect push to='/auth' />;

  return (
    <>
      {/* Create Event Modal */}
      {creating && (
        <ModalComp
          name='Create Event'
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
                  rows='2'
                  ref={descriptionElRef}
                  placeholder='Description'
                  required
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={2} htmlFor='starts'>
                Starts
              </Form.Label>
              <Col sm={7}>
                <Form.Control
                  as='input'
                  type='datetime-local'
                  id='starts'
                  ref={startsElRef}
                  min={date_full(new Date())}
                  onChange={e => setSDate(e.target.value)}
                  required
                />
              </Col>
              <Form.Label
                column
                sm={3}
                onClick={e => {
                  e.preventDefault();
                  addEndDate();
                }}
                style={{ cursor: 'pointer' }}
              >
                + End Date
              </Form.Label>
            </Form.Group>
            {endDate && (
              <Form.Group as={Row}>
                <Form.Label column sm={2} htmlFor='ends'>
                  Ends
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    as='input'
                    type='datetime-local'
                    id='ends'
                    ref={endsElRef}
                    min={sDate.toString()}
                  />
                </Col>
              </Form.Group>
            )}
          </Form>
        </ModalComp>
      )}
      {/* View Event Modal */}
      {selectedEvent && (
        <ModalComp
          name={selectedEvent.name}
          canCancel
          canConfirm
          canView
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={context.token ? 'Book' : 'Login to Book'}
        >
          <h5>Hosted by {selectedEvent.creator.email}</h5>
          <h6 className='text-muted d-flex align-items-center'>
            <MdAccessTime className='mr-3' />
            {eventDate(selectedEvent.starts, selectedEvent.ends)}
          </h6>
          <h6 className='text-muted d-flex align-items-center'>
            <MdLocationOn className='mr-3' />
            {selectedEvent.location}
          </h6>
          <div className='bg-light mt-3'>
            <span className='font-weight-bold'>Details</span>
            <p className='text-muted'>{selectedEvent.description}</p>
          </div>
        </ModalComp>
      )}
      {/* Create event */}
      {context.token && (
        <div className='mt-5 ml-5'>
          <button
            className='btn btn-dark mb-2 d-flex align-items-center justify-content-center'
            onClick={startCreateEventHandler}
          >
            <MdAdd className='mr-2' />
            <span>Create Event</span>
          </button>
        </div>
      )}
      {/* Loading and Display Events */}
      {loadingFetch && (
        <Spinner
          animation='border'
          role='status'
          className='d-flex justify-content-center align-items-center mx-auto mt-5'
        />
      )}
      {!loadingFetch && (
        <EventList
          events={events_}
          bookings={bookings_}
          authUserId={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
};

export default EventsPage;
