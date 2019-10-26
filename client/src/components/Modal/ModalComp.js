import React from 'react';
import { Modal } from 'react-bootstrap';
import { AuthContext } from '../../context/auth-context';

const ModalComp = props => {
  return (
    <Modal show={true} onHide={props.onBack} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        {/* Back Button */}
        <button className='btn btn-dark' onClick={props.onBack}>
          Back
        </button>
        {/* Create Event Button */}
        {props.canCreate && (
          <button className='btn btn-dark' onClick={props.onCreate}>
            Create
          </button>
        )}
        {/* Delete Event Button */}
        {props.authUserId === props.creatorId &&
          (props.canDelete && (
            <button
              className='btn btn-dark'
              onClick={props.onDelete.bind(this, props.eventId)}
            >
              Delete Event
            </button>
          ))}
        {/* Book Event Button*/}
        {props.authUserId !== props.creatorId &&
          (props.canBook && (
            <button
              className='btn btn-dark'
              onClick={props.onBook.bind(this, props.eventId)}
            >
              {props.bookText}
            </button>
          ))}
        {/* Delete Booking Button*/}
        {props.canCancel && (
          <button
            className='btn btn-dark'
            onClick={props.onCancel.bind(this, props.bookingId)}
          >
            Cancel Booking
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComp;
