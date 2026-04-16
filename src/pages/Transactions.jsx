import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import TransactionList from "../components/TransactionList";

function Transactions() {
  const { transactions, deleteTransaction } = useOutletContext();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // 🔍 Filter logic
  const filteredTransactions = transactions.filter((t) => {
    const matchSearch = (t.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "ALL" ? true : t.type === filter;

    return matchSearch && matchFilter;
  });

  // 🔄 Sort logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "date":
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case "amount":
        aValue = a.amount;
        bValue = b.amount;
        break;
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "category":
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // 📊 Statistics
  const stats = {
    total: sortedTransactions.length,
    income: sortedTransactions.filter(t => t.type === "INCOME").length,
    expense: sortedTransactions.filter(t => t.type === "EXPENSE").length,
    totalIncome: sortedTransactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: sortedTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h2>📋 All Transactions</h2>
        <p className="page-subtitle">Complete history of your financial activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="transactions-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>{stats.total}</h4>
            <p>Total Transactions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h4 className="positive">₹{stats.totalIncome.toLocaleString()}</h4>
            <p>Total Income</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h4 className="negative">₹{stats.totalExpense.toLocaleString()}</h4>
            <p>Total Expenses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h4>₹{(stats.totalIncome - stats.totalExpense).toLocaleString()}</h4>
            <p>Net Balance</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="transactions-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
              onClick={() => setFilter("ALL")}
            >
              All ({stats.total})
            </button>
            <button
              className={`filter-btn ${filter === "INCOME" ? "active" : ""}`}
              onClick={() => setFilter("INCOME")}
            >
              Income ({stats.income})
            </button>
            <button
              className={`filter-btn ${filter === "EXPENSE" ? "active" : ""}`}
              onClick={() => setFilter("EXPENSE")}
            >
              Expense ({stats.expense})
            </button>
          </div>
        </div>

        <div className="sort-section">
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="transactions-list">
        {sortedTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No transactions found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <TransactionList
            transactions={sortedTransactions}
            onDelete={deleteTransaction}
          />
        )}
      </div>

      {/* Pagination could be added here for large datasets */}
      {sortedTransactions.length > 50 && (
        <div className="pagination">
          <p>Showing {sortedTransactions.length} transactions</p>
        </div>
      )}
    </div>
  );
}

export default Transactions;