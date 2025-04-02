import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getSupplies,
  createSupplyItem,
  reduceSupplyItem,
  editSupplyItem,
  removeSupplyItem,
} from "../../redux/supplies";
import "./SuppliesPage.css";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const SuppliesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const supplyRef = useRef(null);
  const supplies = useSelector((state) => state.supplies.supplies);
  const loading = useSelector((state) => state.session.loading);
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();
  const [newSupplyName, setNewSupplyName] = useState("");
  const [newSupplyQuantity, setNewSupplyQuantity] = useState("");
  const [editSupplyId, setEditSupplyId] = useState(null);
  const [editSupplyName, setEditSupplyName] = useState("");
  const [editSupplyQuantity, setEditSupplyQuantity] = useState("");
  const editSupplyRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(getSupplies());
  }, [dispatch]);

  useEffect(() => {
    if (supplyRef.current) {
      supplyRef.current.scrollTop = supplyRef.current.scrollHeight;
    }
  }, [supplies]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        editSupplyRef.current &&
        !editSupplyRef.current.contains(e.target) &&
        !e.target.classList.contains("save-btn") &&
        !e.target.classList.contains("edit-input")
      ) {
        setEditSupplyId(null);
      }
    };

    if (editSupplyId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editSupplyId]);

  const handleDelete = (supplyItem) => {
    setModalContent(
      <ConfirmationModal
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${supplyItem.name}" from the supply room?`}
        onConfirm={() => dispatch(removeSupplyItem(supplyItem.id))}
      />
    );
  };

  const handleEdit = async (supply) => {
    if (
      editSupplyId === supply.id &&
      (editSupplyName !== supply.name ||
        parseInt(editSupplyQuantity, 10) !== supply.quantity)
    ) {
      await dispatch(
        editSupplyItem(supply.id, {
          name: editSupplyName,
          quantity: parseInt(editSupplyQuantity, 10),
        })
      );
    }

    if (editSupplyId !== supply.id) {
      setEditSupplyName(supply.name);
      setEditSupplyQuantity(supply.quantity.toString());
    }

    setEditSupplyId(editSupplyId === supply.id ? null : supply.id);
  };

  const handleAddSupply = async () => {
    if (newSupplyName.trim() === "" || parseInt(newSupplyQuantity, 10) <= 0) {
      alert("Please enter a valid name and quantity.");
      return;
    }

    await dispatch(
      createSupplyItem({
        name: newSupplyName,
        quantity: parseInt(newSupplyQuantity, 10),
      })
    );

    setNewSupplyName("");
    setNewSupplyQuantity("");
  };

  if (loading) return <div className="loading">Loading supplies...</div>;

  return (
    <div className="supplies-container">
      <header className="supplies-header">
        <h1>Supply Room</h1>
      </header>

      <div className="add-supply-container">
        <input
          type="text"
          value={newSupplyName}
          onChange={(e) => setNewSupplyName(e.target.value)}
          placeholder="Enter supply name"
          className="supply-add-input"
        />
        <input
          type="number"
          value={newSupplyQuantity}
          min="1"
          onChange={(e) => setNewSupplyQuantity(e.target.value)}
          placeholder="Qty"
          className="supply-add-input"
        />
        <button onClick={handleAddSupply} className="add-btn">
          ADD
        </button>
      </div>

      <div className="supply-list" ref={supplyRef}>
        {Object.values(supplies || {}).length ? (
          Object.values(supplies).map((supply) => (
            <div key={supply.id} className="supply-card">
              {editSupplyId === supply.id ? (
                <div ref={editSupplyRef} className="supply-name-editing">
                <input
                  type="text"
                  value={editSupplyName}
                  onChange={(e) => setEditSupplyName(e.target.value)}
                  className="edit-input"
                  placeholder="Supply name"
                />
                <input
                  type="number"
                  min="0"
                  value={editSupplyQuantity}
                  onChange={(e) => setEditSupplyQuantity(e.target.value)}
                  className="edit-input"
                  placeholder="Quantity"
                />
                <button className="save-btn" onClick={() => handleEdit(supply)}>Save</button>
                <button onClick={() => setEditSupplyId(null)}>Cancel</button>
              </div>
              ) : (
                <>
                  <div className="supply-name">
                    {supply.name} – {supply.quantity} in stock
                  </div>

                  <div className="supply-actions">
                    <button
                      onClick={() => handleEdit(supply)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supply)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No supplies available.</p>
        )}
      </div>
    </div>
  );
};

export default SuppliesPage;
