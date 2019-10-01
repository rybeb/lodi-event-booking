import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';

import Spinner from '../components/Spinner/Spinner';
import { AuthContext } from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [outputType, setOutputType] = useState('list');

  const context = useContext(AuthContext);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               date
               price
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
        const bookings_ = resData.data.data.bookings;
        setBookings(bookings_);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const deleteBookingHandler = bookingId => {
    setIsLoading(true);
    const requestBody = {
      query: `
         mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: bookingId
      }
    };

    axios
      .post('/graphql', requestBody, {
        headers: {
          Authorization: 'Bearer ' + context.token
        }
      })
      .then(resData => {
        setBookings(prevState => {
          const updatedBookings = prevState.filter(booking => {
            return booking._id !== bookingId;
          });
          return updatedBookings;
        });
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const changeOutputTypeHandler = outputType => {
    if (outputType === 'list') {
      setOutputType('list');
    } else {
      setOutputType('chart');
    }
  };

  let content = <Spinner />;
  if (!isLoading) {
    content = (
      <>
        <BookingsControls
          activeOutputType={outputType}
          onChange={changeOutputTypeHandler}
        />
        <div>
          {outputType === 'list' ? (
            <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
          ) : (
            <BookingsChart bookings={bookings} />
          )}
        </div>
      </>
    );
  }
  return <>{content}</>;
};

export default BookingsPage;
