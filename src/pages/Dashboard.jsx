import { useState } from "react";
import SummaryCards from "../components/SummaryCards";
import ExpenseForm from "../components/ExpenseForm";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import TransactionList from "../components/TransactionList";
import { useOutletContext } from "react-router-dom";

function Dashboard() {
  const { transactions, setTransactions, deleteTransaction } = useOutletContext();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // ➕ Add
  const addTransaction = (data) => {
    setTransactions((prev) => [data, ...prev]);
  };

  // 🔍 Filter logic
  const filteredTransactions = transactions.filter((t) => {
    const matchSearch = (t.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "ALL" ? true : t.type === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>🏠 Dashboard</h2>
        <p className="page-subtitle">Welcome back! Here's your financial overview</p>
      </div>

      {/* Summary Cards */}
      <SummaryCards transactions={transactions} />

      {/* Charts Section */}
      {transactions.length > 0 && (
        <div className="dashboard-charts">
          <div className="chart-container">
            <h3>📈 Monthly Trend</h3>
            <LineChart transactions={transactions} />
          </div>
          <div className="chart-container">
            <h3>🥧 Expense Breakdown</h3>
            <PieChart transactions={transactions} />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <ExpenseForm onAdd={addTransaction} />
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="section-header">
          <h3>📋 Recent Transactions</h3>
          <div className="filters">
            <input
              type="text"
              placeholder="🔍 Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
                onClick={() => setFilter("ALL")}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === "INCOME" ? "active" : ""}`}
                onClick={() => setFilter("INCOME")}
              >
                Income
              </button>
              <button
                className={`filter-btn ${filter === "EXPENSE" ? "active" : ""}`}
                onClick={() => setFilter("EXPENSE")}
              >
                Expense
              </button>
            </div>
          </div>
        </div>

        <TransactionList
          transactions={filteredTransactions.slice(0, 10)}
          onDelete={deleteTransaction}
        />

        {filteredTransactions.length > 10 && (
          <div className="view-more">
            <p>Showing 10 of {filteredTransactions.length} transactions</p>
            <button className="btn btn-primary">View All Transactions</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;