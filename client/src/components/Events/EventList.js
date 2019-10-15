import React from 'react';
import EventItem from './EventItem';

const EventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.name}
        location={event.location}
        starts={event.starts}
        userId={props.authUserId}
        creatorId={event.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });

  return (
    <ul
      className='my-2 mx-auto list-unstyled p-0'
      style={{ width: '40rem', maxWidth: '90%' }}
    >
      {events}
    </ul>
  );
};

export default EventList;
