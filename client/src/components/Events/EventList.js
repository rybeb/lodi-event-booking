import React, { useContext, useState, useEffect } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { AuthContext } from '../../context/auth-context';

import EventItem from './EventItem';

const EventList = props => {
  const context = useContext(AuthContext);

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
    <div className='container mt-3'>
      {context.token && (
        <div className='card mb-3'>
          <h5 className='card-header'>My Events</h5>
          <div className='card-body'>
            <div className='card-deck'>{myEvents}</div>
          </div>
        </div>
      )}
      <div className='card mb-3'>
        <h5 className='card-header'>Events</h5>
        <div className='card-body'>
          <div className='card-deck'>{otherEvents}</div>
        </div>
      </div>
    </div>
  );
};

export default EventList;
