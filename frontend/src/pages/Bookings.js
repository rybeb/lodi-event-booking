import React, { useState, useContext, useEffect } from 'react';
import Spinner from '../components/Spinner/Spinner';
import { AuthContext } from '../context/auth-context';

const BookingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

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
             }
            }
          }
        `
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const bookings_ = resData.data.bookings;
        setBookings(bookings_);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul>
          {bookings.map(booking => (
            <li key={booking._id}>
              {booking.event.title} -{' '}
              {new Date(booking.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default BookingsPage;
