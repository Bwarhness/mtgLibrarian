import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

export function DashboardPage() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>MTG Librarian</h1>
        <div className="user-section">
          <p>Welcome, {session?.user?.email}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to MTG Librarian</h2>
          <p>Your personal Magic: The Gathering card collection management system</p>

          <div className="features-grid">
            <div className="feature-card">
              <h3>📸 Card Scanner</h3>
              <p>Scan your cards to quickly add them to your collection</p>
            </div>
            <div className="feature-card">
              <h3>📚 Collection Management</h3>
              <p>Organize and manage your cards by set, type, and color</p>
            </div>
            <div className="feature-card">
              <h3>🏷️ Categorization</h3>
              <p>Create custom categories and tags for your collection</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="primary-button">Start Scanning</button>
            <button className="secondary-button">View Collection</button>
          </div>
        </div>
      </main>
    </div>
  );
}
