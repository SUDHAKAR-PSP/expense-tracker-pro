import { useState } from "react";

function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "EXPENSE"
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount) return;

    onAdd({
      ...form,
      amount: Number(form.amount),
      id: Date.now(),
      created_at: new Date()
    });

    setForm({
      title: "",
      amount: "",
      category: "Food",
      type: "EXPENSE"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h5>Add Transaction</h5>

      <input
        className="form-control mb-2"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        type="number"
        className="form-control mb-2"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <div className="d-flex gap-2 mb-2">
        <select
          className="form-control"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
        </select>

        <select
          className="form-control"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </div>

      <button className="btn btn-primary">Add</button>
    </form>
  );
}

export default ExpenseForm;