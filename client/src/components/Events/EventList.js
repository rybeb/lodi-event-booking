import React, { useContext } from 'react';

import { AuthContext } from '../../context/auth-context';
import EventItem from './EventItem';
import EventSlider from './EventSlider';

const EventList = props => {
  const context = useContext(AuthContext);

  const myBookings = props.bookings.map(booking => {
    let { event } = booking;
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        bookId={booking._id}
        name={event.name}
        location={event.location}
        description={event.description}
        starts={event.starts}
        userId={props.authUserId}
        creatorId={event.creator._id}
        onBookDetail={props.onViewBook}
        canViewBook
      />
    );
  });

  const myEvents = props.events
    .filter(event => event.creator._id === props.authUserId)
    .map(event => {
      return (
        <EventItem
          key={event._id}
          eventId={event._id}
          name={event.name}
          location={event.location}
          description={event.description}
          starts={event.starts}
          userId={props.authUserId}
          creatorId={event.creator._id}
          onEventDetail={props.onViewEvent}
          canViewEvent
        />
      );
    });

  const otherEvents = props.events
    .filter(event => event.creator._id !== props.authUserId)
    .map(event => {
      return (
        <EventItem
          key={event._id}
          eventId={event._id}
          name={event.name}
          location={event.location}
          description={event.description}
          starts={event.starts}
          userId={props.authUserId}
          creatorId={event.creator._id}
          onEventDetail={props.onViewEvent}
          canViewEvent
        />
      );
    });

  return (
    <>
      {context.token && (
        <>
          <EventSlider
            header='Upcoming Events'
            events={[...myEvents, ...myBookings]}
          />
          <EventSlider header='Events You May Like' events={otherEvents} />
        </>
      )}
      {!context.token && <EventSlider header='Events' events={otherEvents} />}
    </>
  );
};

export default EventList;
