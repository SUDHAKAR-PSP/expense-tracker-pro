import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";

function Profile() {
  const { transactions, setTransactions, addNotification } = useOutletContext();
  const { theme, setTheme } = useTheme();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : {
      name: "User",
      email: "user@example.com",
      currency: "INR",
      dateFormat: "DD/MM/YYYY"
    };
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("settings");
    return saved ? JSON.parse(saved) : {
      notifications: true,
      autoSave: true,
      compactView: false,
      animations: true
    };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const updateUser = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
    addNotification("Profile updated successfully", "success");
  };

  const updateSetting = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    addNotification("Settings updated", "success");
  };

  const exportData = () => {
    const data = {
      user,
      settings,
      transactions,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification("Data exported successfully", "success");
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.transactions) {
            setTransactions(data.transactions);
            localStorage.setItem("transactions", JSON.stringify(data.transactions));
          }
          if (data.user) {
            setUser(data.user);
          }
          if (data.settings) {
            setSettings(data.settings);
          }
          addNotification("Data imported successfully", "success");
        } catch (error) {
          addNotification("Invalid file format", "error");
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      setTransactions([]);
      localStorage.clear();
      setUser({ name: "User", email: "user@example.com", currency: "INR", dateFormat: "DD/MM/YYYY" });
      setSettings({ notifications: true, autoSave: true, compactView: false, animations: true });
      addNotification("All data cleared", "warning");
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>⚙️ Settings & Profile</h2>
        <p className="page-subtitle">Customize your experience</p>
      </div>

      <div className="profile-grid">
        {/* User Profile */}
        <div className="profile-section">
          <h3>👤 Profile Information</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser("name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => updateUser("email", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Currency</label>
            <select
              value={user.currency}
              onChange={(e) => updateUser("currency", e.target.value)}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        {/* Appearance */}
        <div className="profile-section">
          <h3>🎨 Appearance</h3>
          <div className="form-group">
            <label>Theme</label>
            <div className="theme-options">
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                ☀️ Light
              </button>
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="profile-section">
          <h3>🔧 Preferences</h3>
          <div className="settings-list">
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSetting("notifications", e.target.checked)}
              />
              <span>Enable notifications</span>
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting("autoSave", e.target.checked)}
              />
              <span>Auto-save data</span>
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.compactView}
                onChange={(e) => updateSetting("compactView", e.target.checked)}
              />
              <span>Compact view</span>
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.animations}
                onChange={(e) => updateSetting("animations", e.target.checked)}
              />
              <span>Enable animations</span>
            </label>
          </div>
        </div>

        {/* Data Management */}
        <div className="profile-section">
          <h3>💾 Data Management</h3>
          <div className="data-actions">
            <button className="btn btn-primary" onClick={exportData}>
              📤 Export Data
            </button>
            <label className="btn btn-secondary">
              📥 Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
              />
            </label>
            <button className="btn btn-danger" onClick={clearAllData}>
              🗑️ Clear All Data
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="profile-section">
          <h3>📊 Your Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{transactions.length}</span>
              <span className="stat-label">Total Transactions</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {transactions.filter(t => t.type === 'INCOME').length}
              </span>
              <span className="stat-label">Income Entries</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {transactions.filter(t => t.type === 'EXPENSE').length}
              </span>
              <span className="stat-label">Expense Entries</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {new Set(transactions.map(t => t.category)).size}
              </span>
              <span className="stat-label">Categories Used</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;