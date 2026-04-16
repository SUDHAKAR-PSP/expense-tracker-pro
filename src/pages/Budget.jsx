import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

function Budget() {
  const { transactions, addNotification } = useOutletContext();
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : {
      food: 5000,
      travel: 10000,
      bills: 8000,
      shopping: 3000,
      entertainment: 2000
    };
  });

  const [editing, setEditing] = useState(null);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  // Calculate current spending by category
  const spending = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const updateBudget = (category, amount) => {
    setBudgets(prev => ({
      ...prev,
      [category]: Number(amount)
    }));
    setEditing(null);
    addNotification(`Budget updated for ${category}`, "success");
  };

  const categories = Object.keys(budgets);

  return (
    <div className="budget-page">
      <div className="page-header">
        <h2>🎯 Budget Goals</h2>
        <p className="page-subtitle">Set and track your spending limits</p>
      </div>

      <div className="budget-grid">
        {categories.map(category => {
          const spent = spending[category] || 0;
          const budget = budgets[category];
          const percentage = (spent / budget) * 100;
          const isOverBudget = spent > budget;

          return (
            <div key={category} className={`budget-card ${isOverBudget ? 'over-budget' : ''}`}>
              <div className="budget-header">
                <h3 className="category-name">{category}</h3>
                {editing === category ? (
                  <div className="budget-edit">
                    <input
                      type="number"
                      defaultValue={budget}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateBudget(category, e.target.value);
                        }
                      }}
                      autoFocus
                    />
                    <button onClick={() => setEditing(null)}>✕</button>
                  </div>
                ) : (
                  <div className="budget-amount">
                    <span className="spent">₹{spent.toLocaleString()}</span>
                    <span className="separator">/</span>
                    <span className="total">₹{budget.toLocaleString()}</span>
                    <button
                      className="edit-btn"
                      onClick={() => setEditing(category)}
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>

              <div className="budget-status">
                <span className={`percentage ${isOverBudget ? 'danger' : percentage > 80 ? 'warning' : 'good'}`}>
                  {percentage.toFixed(1)}%
                </span>
                <span className="remaining">
                  {isOverBudget
                    ? `₹${(spent - budget).toLocaleString()} over`
                    : `₹${(budget - spent).toLocaleString()} left`
                  }
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="budget-summary">
        <div className="summary-card">
          <h3>Total Budget</h3>
          <p className="amount">₹{Object.values(budgets).reduce((a, b) => a + b, 0).toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Total Spent</h3>
          <p className="amount">₹{Object.values(spending).reduce((a, b) => a + b, 0).toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Remaining</h3>
          <p className="amount">
            ₹{(Object.values(budgets).reduce((a, b) => a + b, 0) -
               Object.values(spending).reduce((a, b) => a + b, 0)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Budget;