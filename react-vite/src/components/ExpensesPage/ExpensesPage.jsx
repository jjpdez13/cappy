// react-vite/src/components/ExpensesPage/ExpensesPage.jsx

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { expenseActions } from "../../redux";
import "./ExpensesPage.css";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const ExpensesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expenseRef = useRef(null);
  const expenses = useSelector((state) => state.expenses.expenses);
  const loading = useSelector((state) => state.session.loading);
  const user = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();

  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);
  const [editExpense, setEditExpense] = useState({
    category: "",
    amount: "",
    description: "",
  });

  const editRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== "Admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    dispatch(expenseActions.getExpenses());
  }, [dispatch]);

  useEffect(() => {
    if (expenseRef.current) {
      expenseRef.current.scrollTop = expenseRef.current.scrollHeight;
    }
  }, [expenses]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        editRef.current &&
        !editRef.current.contains(e.target) &&
        !e.target.classList.contains("save-btn") &&
        !e.target.classList.contains("edit-input")
      ) {
        setEditId(null);
      }
    };

    if (editId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editId]);

  const handleDelete = (expense) => {
    const handlePasswordConfirm = (password) => {
      if (!password.trim()) {
        setModalContent(
          <ConfirmationModal
            title="Missing Password"
            message={`Nice try Mr. Krabs 🧽`}
            showConfirmButton={false}
            onCancel={() => setModalContent(null)}
          />
        );
        return;
      }

      setModalContent(null);
      dispatch(expenseActions.removeExpense(expense.id, password));
    };

    setModalContent(
      <ConfirmationModal
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${expense.category}"?`}
        passwordPrompt={true}
        onConfirm={handlePasswordConfirm}
        onCancel={() => setModalContent(null)}
      />
    );
  };

  const handleEdit = async (expense) => {
    if (
      editId === expense.id &&
      (editExpense.category !== expense.category ||
        parseFloat(editExpense.amount) !== parseFloat(expense.amount) ||
        editExpense.description !== expense.description)
    ) {
      await dispatch(
        expenseActions.editExpense(expense.id, {
          ...editExpense,
          amount: parseFloat(editExpense.amount),
        })
      );
    }

    if (editId !== expense.id) {
      setEditExpense({
        category: expense.category,
        amount: expense.amount.toString(),
        description: expense.description,
      });
    }

    setEditId(editId === expense.id ? null : expense.id);
  };

  const handleAddExpense = async () => {
    if (
      !newExpense.category.trim() ||
      parseFloat(newExpense.amount) <= 0 ||
      !newExpense.description.trim()
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    await dispatch(
      expenseActions.createExpense({
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
      })
    );

    setNewExpense({ category: "", amount: "", description: "" });
  };

  if (loading) return <div className="loading">Loading expenses...</div>;

  return (
    <div className="expenses-container">
      <header className="expenses-header">
        <h1>Monthly Expenses</h1>
      </header>

      <div className="add-expense-container">
        <input
          type="text"
          value={newExpense.category}
          onChange={(e) =>
            setNewExpense((prev) => ({ ...prev, category: e.target.value }))
          }
          placeholder="Category"
          className="expense-add-input"
        />
        <input
          type="number"
          value={newExpense.amount}
          min="0"
          onChange={(e) =>
            setNewExpense((prev) => ({ ...prev, amount: e.target.value }))
          }
          placeholder="Amount"
          className="expense-add-input"
        />
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) =>
            setNewExpense((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Description"
          className="expense-add-input"
        />
        <button onClick={handleAddExpense} className="add-btn">
          ADD
        </button>
      </div>

      <div className="expense-list" ref={expenseRef}>
        {Object.values(expenses || {}).length ? (
          Object.values(expenses).map((expense) => (
            <div key={expense.id} className="expense-card">
              {editId === expense.id ? (
                <div ref={editRef} className="expense-editing">
                  <input
                    type="text"
                    value={editExpense.category}
                    onChange={(e) =>
                      setEditExpense((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="edit-input"
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    min="0"
                    value={editExpense.amount}
                    onChange={(e) =>
                      setEditExpense((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="edit-input"
                    placeholder="Amount"
                  />
                  <input
                    type="text"
                    value={editExpense.description}
                    onChange={(e) =>
                      setEditExpense((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="edit-input"
                    placeholder="Description"
                  />
                  <button
                    className="save-btn"
                    onClick={() => handleEdit(expense)}
                  >
                    Save
                  </button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                  <div className="expense-details">
                    <strong>{expense.category}</strong> – ${expense.amount}
                    <div className="expense-description">
                      {expense.description}
                    </div>
                  </div>

                  <div className="expense-actions">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(expense)}
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
          <p>No expenses available.</p>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
