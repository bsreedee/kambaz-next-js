
import { Modal, Button } from "react-bootstrap";
export default function AssignmentDeleter({
  show,
  handleClose,
  dialogTitle,
  assignmentName,
  deleteAssignment,
}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  assignmentName: string;
  deleteAssignment: () => void;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {`Are you sure you want to delete the assignment "${assignmentName}"? This
        action cannot be undone.`}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            deleteAssignment();
            handleClose();
          }}
        >
          Delete Assignment
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
