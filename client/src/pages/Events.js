import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Form, Spinner, Row, Col } from 'react-bootstrap';

import { eventDate, date_full, months } from '../helper/date-helper';
import { MdLocationOn, MdAccessTime, MdAdd } from 'react-icons/md';
import ModalComp from '../components/Modal/ModalComp';
import EventList from '../components/Events/EventList';
import { AuthContext } from '../context/auth-context';
import {
  CREATE_EVENT,
  FETCH_EVENTS,
  DELETE_EVENT,
  PAST_EVENT,
  BOOK_EVENT,
  FETCH_BOOKINGS,
  CANCEL_BOOKING
} from '../components/Queries/Queries';

const EventsPage = () => {
  const context = useContext(AuthContext);
  const [validated, setValidated] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [endDate, setEndDate] = useState(false);
  const [startDate, setStartDate] = useState('');

  const nameElRef = useRef(null);
  const locationElRef = useRef(null);
  const descriptionElRef = useRef(null);
  const startsElRef = useRef(null);
  const endsElRef = useRef(null);

  const [CreateEvent] = useMutation(CREATE_EVENT, {
    refetchQueries: [`FetchEvents`]
  });

  const {
    loading: loadingFetch,
    error: errorFetch,
    data: dataFetch,
    refetch
  } = useQuery(FETCH_EVENTS);

  const [DeleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted: () => setSelectedEvent(null)
  });

  const {
    loading: loadingBook,
    error: errorBook,
    data: dataBook,
    refetch: refetchBook
  } = useQuery(FETCH_BOOKINGS);

  const [PastEvent] = useMutation(PAST_EVENT);

  const [BookEvent] = useMutation(BOOK_EVENT, {
    onCompleted: () => setSelectedEvent(null)
  });

  const [CancelBooking] = useMutation(CANCEL_BOOKING, {
    onCompleted: () => setSelectedBooking(null)
  });

  refetch();
  refetchBook();

  let events_ = [],
    bookings_ = [];

  if (dataFetch) dataFetch.events.map(e => events_.push(e));
  if (dataBook) dataBook.bookings.map(b => bookings_.push(b));

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
        name,
        location,
        description,
        starts,
        ends
      }
    });
    setValidated(false);
    setCreating(false);
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
    setSelectedBooking(null);
    setValidated(false);
    setEndDate(false);
  };

  const showEventDetail = eventId => {
    const selectedEvent = events_.find(e => e._id === eventId);
    setSelectedEvent(selectedEvent);
  };
  const showBookDetail = bookId => {
    const selectedBooking = bookings_.find(b => b._id === bookId);
    setSelectedBooking(selectedBooking);
  };

  const unAuth = () => {
    setSelectedEvent(null);
    setRedirect(true);
    return;
  };

  const addEndDate = () => {
    setEndDate(!endDate);
  };

  const pastEventsDeleter = () => {
    return events_
      .filter(e => {
        return e.ends
          ? new Date(e.ends) < new Date()
          : new Date(e.starts) < new Date();
      })
      .map(e => {
        console.log(`${e.name} deleted`);
        return PastEvent({ variables: { id: e._id } });
      });
  };

  useEffect(() => {
    pastEventsDeleter();
  }, [dataFetch]);

  if (redirect) return <Redirect push to='/auth' />;

  const { token, userId } = context;

  return (
    <>
      {/* Create Event Modal */}
      {creating && (
        <ModalComp
          name='Create Event'
          canCreate
          onBack={modalCancelHandler}
          onCreate={modalConfirmHandler}
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
                  // min={date_full(new Date())}
                  onChange={e => setStartDate(e.target.value)}
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
                    min={startDate.toString()}
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
          creatorId={selectedEvent.creator._id}
          eventId={selectedEvent._id}
          canBook
          canDelete
          authUserId={userId}
          onBack={modalCancelHandler}
          bookText={token ? 'Book' : 'Login to Book'}
          onBook={token ? id => BookEvent({ variables: { id } }) : unAuth}
          onDelete={id => DeleteEvent({ variables: { id } })}
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
      {/* View Booking Modal */}
      {selectedBooking && (
        <ModalComp
          name={selectedBooking.event.name}
          canCancel
          authUserId={userId}
          onBack={modalCancelHandler}
          onCancel={id => CancelBooking({ variables: { id } })}
          bookingId={selectedBooking._id}
        >
          <h5>Hosted by {selectedBooking.event.creator.email}</h5>
          <h6 className='text-muted d-flex align-items-center'>
            <MdAccessTime className='mr-3' />
            {eventDate(
              selectedBooking.event.starts,
              selectedBooking.event.ends
            )}
          </h6>
          <h6 className='text-muted d-flex align-items-center'>
            <MdLocationOn className='mr-3' />
            {selectedBooking.event.location}
          </h6>
          <div className='bg-light mt-3'>
            <span className='font-weight-bold'>Details</span>
            <p className='text-muted'>{selectedBooking.event.description}</p>
          </div>
        </ModalComp>
      )}
      {/* Create event */}
      <div className='mt-5 ml-5'>
        <button
          className='btn btn-dark mb-2 d-flex align-items-center justify-content-center'
          onClick={token ? startCreateEventHandler : unAuth}
        >
          <MdAdd className='mr-2' />
          <span>{token ? 'Create Event' : 'Login to Create Event'}</span>
        </button>
      </div>
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
          authUserId={userId}
          onViewEvent={showEventDetail}
          onViewBook={showBookDetail}
        />
      )}
    </>
  );
};

export default EventsPage;
