import React from 'react';

const EventItem = props => (
  <li
    key={props.eventId}
    className='my-3 mx-auto p-3 border border-dark d-flex justify-content-between align-items-center'
  >
    <div>
      <h1 className='h4 m-0 text-dark'>{props.name}</h1>
      <h2 className='h6 m-0 text-dark'>
        {new Date(props.starts).toLocaleDateString()} - {props.location}
      </h2>
    </div>
    <div>
      {props.userId === props.creatorId ? (
        <p className='m-0'>Your the owner of this event.</p>
      ) : (
        <button
          className='btn btn-dark'
          onClick={props.onDetail.bind(this, props.eventId)}
        >
          View Details
        </button>
      )}
    </div>
  </li>
);

export default EventItem;
