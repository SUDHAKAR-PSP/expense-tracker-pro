import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function Layout() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="d-flex">

      <div className="sidebar p-3">
        <h4 className="text-center mb-4">💰 Tracker</h4>

        <NavLink to="/app/dashboard" className="nav-btn">Dashboard</NavLink>
        <NavLink to="/app/analytics" className="nav-btn">Analytics</NavLink>
        <NavLink to="/app/transactions" className="nav-btn">Transactions</NavLink>
      </div>

      <div className="main-content p-4">
        <Outlet context={{ transactions, setTransactions, deleteTransaction }} />
      </div>

    </div>
  );
}

export default Layout;