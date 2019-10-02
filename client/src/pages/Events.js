import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, Spinner } from 'react-bootstrap';

import ModalComp from '../components/Modal/ModalComp';
import EventList from '../components/Events/EventList/EventList';
import { AuthContext } from '../context/auth-context';
import './Events.css';

const EventsPage = () => {
  const [creating, setCreating] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isActive = useRef(true);

  const context = useContext(AuthContext);

  const titleElRef = useRef(null);
  const priceElRef = useRef(null);
  const dateElRef = useRef(null);
  const descriptionElRef = useRef(null);

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = () => {
    setCreating(false);
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    axios
      .post('/graphql', requestBody, {
        headers: {
          Authorization: 'Bearer ' + context.token
        }
      })
      .then(resData => {
        setEvents(prevEvents => {
          const updatedEvents = [...prevEvents];
          updatedEvents.push({
            _id: resData.data.data.createEvent._id,
            title: resData.data.data.createEvent.title,
            description: resData.data.data.createEvent.description,
            date: resData.data.data.createEvent.date,
            price: resData.data.data.createEvent.price,
            creator: {
              _id: context.userId
            }
          });
          return updatedEvents;
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null);
  };

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    axios
      .post('/graphql', requestBody, {
        headers: {
          Authorization: 'Bearer ' + context.token
        }
      })
      .then(resData => {
        const events2 = resData.data.data.events;
        setEvents(events2);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        if (isActive) {
          setIsLoading(false);
        }
      });
  };

  const showDetailHandler = eventId => {
    const selectedEvent = events.find(e => e._id === eventId);
    setSelectedEvent(selectedEvent);
  };

  const bookEventHandler = () => {
    if (!context.token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
      variables: {
        id: selectedEvent._id
      }
    };

    axios
      .post('/graphql', requestBody, {
        headers: {
          Authorization: 'Bearer ' + context.token
        }
      })
      .then(resData => {
        setSelectedEvent(null);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchEvents();
    isActive.current = true;
    return () => {
      isActive.current = false;
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ModalComp
        title='Add Event'
        canCancel
        canConfirm
        onShow={creating}
        onCancel={modalCancelHandler}
        onConfirm={modalConfirmHandler}
        confirmText='Confirm'
      >
        <Form>
          <Form.Group>
            <Form.Label htmlFor='title'>Title</Form.Label>
            <Form.Control
              type='text'
              id='title'
              placeholder='Title'
              ref={titleElRef}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor='price'>Price</Form.Label>
            <Form.Control
              type='number'
              id='price'
              placeholder='Price'
              ref={titleElRef}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor='date'>Date</Form.Label>
            <Form.Control
              type='datetime-local'
              id='date'
              placeholder='Date'
              ref={titleElRef}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor='description'>Description</Form.Label>
            <Form.Control
              type='textarea'
              id='description'
              rows='4'
              placeholder='Description'
              ref={titleElRef}
            />
          </Form.Group>
        </Form>
      </ModalComp>
      {selectedEvent && (
        <ModalComp
          title={selectedEvent.title}
          canCancel
          canConfirm
          canView
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={context.token ? 'Book' : 'Confirm'}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{' '}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </ModalComp>
      )}
      {context.token && (
        <div className='events-control'>
          <p>Share your own Events!</p>
          <button className='btn btn-dark' onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner
          animation='border'
          role='status'
          className='d-flex justify-content-center align-items-center mx-auto'
        />
      ) : (
        <EventList
          events={events}
          authUserId={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </>
  );
};

export default EventsPage;