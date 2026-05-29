import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { useAppStore } from './store';
import { User } from './types';

export default function App() {
  const [currentView, setView] = useState<'landing' | 'dashboard' | 'admin'>('landing');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Bind Zustand state
  const {
    user, setUser,
    groups,
    devices,
    projects,
    usersList,
    logs,
    isRealtimeConnected,
    connectSSE,
    fetchInitialData,
    updateGroupConfigApi
  } = useAppStore();

  // Sync session on mount
  useEffect(() => {
    const cached = localStorage.getItem('siskom_session');
    if (cached) {
      try {
        const u = JSON.parse(cached);
        setUser(u);
      } catch (e) {
        localStorage.removeItem('siskom_session');
      }
    }

    // Load initial context stats & records from server DB
    fetchInitialData();
  }, [setUser, fetchInitialData]);

  // Set up and connect Server-Sent Events for real-time live push updates
  useEffect(() => {
    connectSSE();
    return () => {
      // EventSource cleanup is managed by the store connect logic on reconnect,
      // but here we can just leave it running since it's global.
    };
  }, [connectSSE]);

  // Login handler
  const handleLogin = async (username: string, pass: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('siskom_session', JSON.stringify(data.user));
        
        // Redirect directly in dashboard after login for smooth UX
        setView('dashboard');
        
        // Sync any newly created stats
        fetchInitialData();
        return null; // success
      } else {
        return data.error || 'Autentikasi gagal.';
      }
    } catch (e) {
      return 'Koneksi ke server tertutup.';
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('siskom_session');
    setUser(null);
    setView('landing');
  };

  // Update layout customization options (API calls)
  const handleUpdateGroupConfig = async (groupSlug: string, updates: any): Promise<boolean> => {
    if (!user) return false;
    return await updateGroupConfigApi(groupSlug, updates, user.apiKey);
  };

  // Create new user account under admin authorization
  const handleAddUser = async (userForm: any): Promise<boolean> => {
    if (!user || user.role !== 'SUPER_ADMIN') return false;
    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.apiKey}`
        },
        body: JSON.stringify(userForm)
      });
      if (response.ok) {
        // Redownload summary list
        fetchInitialData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Deactivate account under admin authorization
  const handleDeleteUser = async (userId: string): Promise<boolean> => {
    if (!user || user.role !== 'SUPER_ADMIN') return false;
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.apiKey}`
        }
      });
      if (response.ok) {
        fetchInitialData();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100">
      
      {/* Floating high-tech navbar header */}
      <Navbar
        currentView={currentView}
        setView={setView}
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        isRealtimeConnected={isRealtimeConnected}
      />

      {/* Main Container Pages router routing */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            projects={projects}
            groups={groups}
            logs={logs}
            onOpenLogin={() => setIsLoginOpen(true)}
            onEnterDashboardOfGroup={(slug) => {
              // Direct navigation preview
              if (user) {
                // If viewing group, super admin can see any. Normal user can only see their own.
                if (user.role === 'SUPER_ADMIN' || user.groupSlug === slug) {
                  // Allow entry
                  setView('dashboard');
                } else {
                  alert(`Area Terbatas! Kredensial Anda diset khusus untuk ${user.groupSlug.toUpperCase()}. Silakan login dengan akun yang cocok.`);
                }
              } else {
                // Not logged in. Prompt login.
                setIsLoginOpen(true);
              }
            }}
          />
        )}

        {currentView === 'dashboard' && user && (
          <Dashboard
            user={user}
            groups={groups}
            devices={devices}
            logs={logs}
            onUpdateGroupConfig={handleUpdateGroupConfig}
            isRealtimeConnected={isRealtimeConnected}
          />
        )}

        {currentView === 'admin' && user && user.role === 'SUPER_ADMIN' && (
          <AdminPanel
            currentUser={user}
            usersList={usersList}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            logsCount={logs.length}
            devicesCount={devices.length}
          />
        )}
      </main>

      {/* Auth Portal Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

    </div>
  );
}
