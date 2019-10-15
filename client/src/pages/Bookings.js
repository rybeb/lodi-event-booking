import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/react-hooks';

import BookingList from '../components/Bookings/BookingList';
import { FETCH_BOOKINGS, CANCEL_BOOKING } from '../components/Queries/Queries';

const BookingsPage = () => {
  const { loading, error, data, refetch } = useQuery(FETCH_BOOKINGS);

  const [CancelBooking] = useMutation(CANCEL_BOOKING, {
    refetchQueries: [`FetchBookings`]
  });

  refetch();

  let bookings_ = [];

  if (data) data.bookings.map(booking => bookings_.push(booking));

  return (
    <>
      {/* <h1>Bookings</h1> */}
      {loading && (
        <div className='mt-5'>
          <Spinner
            animation='border'
            role='status'
            className='d-flex justify-content-center align-items-center mx-auto'
          />
        </div>
      )}
      <BookingList
        bookings={bookings_}
        onDelete={bookingId => {
          CancelBooking({
            variables: {
              id: bookingId
            }
          });
        }}
      />
    </>
  );
};

export default BookingsPage;
