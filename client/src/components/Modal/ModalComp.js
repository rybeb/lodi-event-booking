import React from 'react';
import { Modal } from 'react-bootstrap';

const ModalComp = props => (
  <Modal show={true} onHide={props.onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>{props.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{props.children}</Modal.Body>
    <Modal.Footer>
      {props.canCancel && (
        <button className='btn btn-dark' onClick={props.onCancel}>
          Cancel
        </button>
      )}
      {props.canConfirm && (
        <button className='btn btn-dark' onClick={props.onConfirm}>
          {props.confirmText}
        </button>
      )}
    </Modal.Footer>
  </Modal>
);

export default ModalComp;
