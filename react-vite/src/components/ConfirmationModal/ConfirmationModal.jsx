import { useState } from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  passwordPrompt = false,
  showConfirmButton = true,
}) => {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    if (passwordPrompt) {
      onConfirm(password);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">{title}</div>
        <div className="modal-message">
          <p>{message}</p>

          {passwordPrompt && (
            <input
              type="password"
              placeholder="Enter SpongeBob's password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
            />
          )}
        </div>
        <div className="modal-actions">
          {showConfirmButton && (
            <button onClick={handleConfirm} className="confirm-btn">
              Confirm
            </button>
          )}
          <button onClick={onCancel} className="cancel-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;