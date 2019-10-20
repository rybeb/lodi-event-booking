import React from 'react';

import { DAYS, MONTHS } from '../../helper/date-arrays';

const EventItem = props => (
  <div key={props.eventId} className='card mb-3 col-12'>
    <div className='card-body'>
      <h5
        className='card-title text-center'
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
      >
        {props.name}
      </h5>
      <div className='d-flex flex-row align-items-start'>
        <div className='d-flex flex-column justify-content-center align-items-center'>
          <span className='text-danger'>{MONTHS(props.starts)}</span>
          <h1>{new Date(props.starts).getDate()}</h1>
        </div>
        <div className='mt-2 ml-2'>
          <h6 className='card-subtitle text-muted'>
            {DAYS(props.starts)} - {props.location}
          </h6>
        </div>
      </div>
    </div>

    <div className='card-footer bg-white'>
      {props.userId === props.creatorId ? (
        <span className='m-0' style={{ fontSize: '0.9rem' }}>
          You're the owner of this event.
        </span>
      ) : (
        <button
          className='btn btn-dark'
          onClick={props.onDetail.bind(this, props.eventId)}
        >
          View Details
        </button>
      )}
    </div>
  </div>
);

export default EventItem;
