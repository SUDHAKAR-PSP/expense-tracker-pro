import { useOutletContext } from "react-router-dom";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";

function Analytics() {
  const { transactions } = useOutletContext();

  // Calculate analytics data
  const totalIncome = transactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const categoryBreakdown = transactions
    .filter(t => t.type === "EXPENSE")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const monthlyTrend = transactions.reduce((acc, t) => {
    const month = new Date(t.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    if (t.type === "INCOME") {
      acc[month].income += t.amount;
    } else {
      acc[month].expense += t.amount;
    }
    return acc;
  }, {});

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>📊 Advanced Analytics</h2>
        <p className="page-subtitle">Deep insights into your financial patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics">
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Balance</h3>
            <p className={`metric-value ${balance >= 0 ? 'positive' : 'negative'}`}>
              ₹{balance.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>Total Income</h3>
            <p className="metric-value positive">₹{totalIncome.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📉</div>
          <div className="metric-content">
            <h3>Total Expenses</h3>
            <p className="metric-value negative">₹{totalExpense.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Savings Rate</h3>
            <p className="metric-value">
              {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="chart-container">
          <h3>Monthly Trend</h3>
          <LineChart transactions={transactions} />
        </div>

        <div className="chart-container">
          <h3>Expense Breakdown</h3>
          <PieChart transactions={transactions} />
        </div>
      </div>

      {/* Category Analysis */}
      <div className="category-analysis">
        <h3>📂 Category Analysis</h3>
        <div className="category-grid">
          {Object.entries(categoryBreakdown).map(([category, amount]) => {
            const percentage = (amount / totalExpense) * 100;
            return (
              <div key={category} className="category-item">
                <div className="category-header">
                  <span className="category-name">{category}</span>
                  <span className="category-amount">₹{amount.toLocaleString()}</span>
                </div>
                <div className="category-bar">
                  <div
                    className="category-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="category-percentage">{percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="monthly-overview">
        <h3>📅 Monthly Overview</h3>
        <div className="monthly-table">
          <div className="table-header">
            <span>Month</span>
            <span>Income</span>
            <span>Expenses</span>
            <span>Net</span>
          </div>
          {Object.entries(monthlyTrend).map(([month, data]) => (
            <div key={month} className="table-row">
              <span>{month}</span>
              <span className="positive">₹{data.income.toLocaleString()}</span>
              <span className="negative">₹{data.expense.toLocaleString()}</span>
              <span className={data.income - data.expense >= 0 ? 'positive' : 'negative'}>
                ₹{(data.income - data.expense).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;