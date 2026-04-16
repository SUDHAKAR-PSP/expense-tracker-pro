import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./ThemeContext";

function AppLayout() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [notifications, setNotifications] = useState([]);

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addNotification = (message, type = "info") => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const location = useLocation();
  const isAnalytics = location.pathname.includes("analytics");

  return (
    <ThemeProvider value={{ theme, setTheme }}>
      <div className={`app-container ${theme}`}>
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">💰 ExpenseTracker Pro</h1>
            <div className="header-actions">
              <button
                className="theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <div className="user-menu">
                <span className="user-avatar">👤</span>
              </div>
            </div>
          </div>
        </header>

        <div className="app-main">
          {/* Sidebar */}
          <aside className={`app-sidebar ${isAnalytics ? 'analytics-mode' : ''}`}>
            <nav className="sidebar-nav">
              <NavLink to="/app/dashboard" className="nav-item">
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </NavLink>
              <NavLink to="/app/analytics" className="nav-item">
                <span className="nav-icon">📈</span>
                <span className="nav-text">Analytics</span>
              </NavLink>
              <NavLink to="/app/transactions" className="nav-item">
                <span className="nav-icon">📋</span>
                <span className="nav-text">Transactions</span>
              </NavLink>
              <NavLink to="/app/budget" className="nav-item">
                <span className="nav-icon">🎯</span>
                <span className="nav-text">Budget</span>
              </NavLink>
              <NavLink to="/app/profile" className="nav-item">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Settings</span>
              </NavLink>
            </nav>
          </aside>

          {/* Main Content */}
          <main className={`app-content ${isAnalytics ? 'analytics-layout' : ''}`}>
            <Outlet context={{
              transactions,
              setTransactions,
              deleteTransaction,
              addNotification,
              notifications
            }} />
          </main>
        </div>

        {/* Notifications */}
        <div className="notifications-container">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AppLayout;