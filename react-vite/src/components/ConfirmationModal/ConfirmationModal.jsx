import { useModal } from "../../context/Modal";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ title, message, onConfirm }) => {
  const { closeModal } = useModal();

  const handleClick = (e) => {
    const isDelete = e.target.classList.contains("confirm-btn");
    if (!isDelete) {
      closeModal();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClick}>
      <div className="modal-content">
        <div className="modal-header">{title}</div>
        <div className="modal-message">{message}</div>
        <div className="modal-actions">
          <button
            className="confirm-btn"
            onClick={() => {
              onConfirm();
              closeModal();
            }}
          >
            DELETE
          </button>
          <button className="cancel-btn" onClick={closeModal}>
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;