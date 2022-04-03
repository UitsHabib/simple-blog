import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ConfirmationModal = ({ title, message, show, onConfirmation, onCancellation, onHide }) => {
    return <Modal
        centered
        size=""
        show={show}
        onHide={onHide}
    >
        <Modal.Header closeButton>
            <Modal.Title className="modal-title_small">
                {title || 'Confirmation'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                {message || 'Are you sure?'}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <button
                className="btn cdp-btn-outline-primary"
                onClick={onCancellation}
            >
                Cancel
            </button>
            <button
                className="ml-2 btn cdp-btn-secondary text-white"
                onClick={onConfirmation}
            >
                Confirm
            </button>
        </Modal.Footer>
    </Modal>
}

export default ConfirmationModal;
