import React from 'react';

import { days, months } from '../../helper/date-helper';

const EventItem = props => (
  <div key={props.eventId} className='card'>
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
        <div className='d-flex flex-column justify-content-center align-items-center '>
          <span className='text-danger'>{months(props.starts)}</span>
          <h1>{new Date(props.starts).getDate()}</h1>
        </div>
        <div className='mt-2 ml-2'>
          <h6
            className='card-subtitle text-muted'
            style={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          >
            {days(props.starts)} - {props.location}
          </h6>
        </div>
      </div>
    </div>

    <div className='card-footer bg-white'>
      {props.canViewBook && (
        <button
          className='btn btn-dark'
          onClick={props.onBookDetail.bind(this, props.bookId)}
        >
          View Details
        </button>
      )}
      {props.canViewEvent && (
        <button
          className='btn btn-dark'
          onClick={props.onEventDetail.bind(this, props.eventId)}
        >
          View Details
        </button>
      )}
    </div>
  </div>
);

export default EventItem;
