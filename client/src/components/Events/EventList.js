import React, { useContext } from 'react';

import { AuthContext } from '../../context/auth-context';
import EventItem from './EventItem';
import EventSlider from './EventSlider';

const EventList = props => {
  const context = useContext(AuthContext);

  const myBookings = props.bookings.map(event => {
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
        onDetail={props.onViewDetail}
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
          onDetail={props.onViewDetail}
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
          onDetail={props.onViewDetail}
        />
      );
    });

  return (
    <>
      {context.token && (
        <>
          <EventSlider
            header='My Events'
            events={[...myEvents, ...myBookings]}
          />
          <EventSlider header='Other Events' events={otherEvents} />
        </>
      )}
      {!context.token && <EventSlider header='Events' events={otherEvents} />}
    </>
  );
};

export default EventList;
