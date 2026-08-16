import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.js';

interface AuthContextType {
  currentUser: User;
  isAuthenticated: boolean;
  availableUsers: User[];
  login: (email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchUser: (user: User) => void;
}

// Get API base URL from environment or default to current origin
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-admin-01',
    email: 'rishi@kmrl.gov.in',
    name: 'RISHI',
    role: 'ADMIN',
    department: 'Administration & Executive Operations',
    assignedProjects: ['Phase 1 Operations', 'Phase 2 Kakkanad Extension', 'Water Metro Integration']
  },
  {
    id: 'usr-mgr-01',
    email: 'sri@kmrl.gov.in',
    name: 'SRI',
    role: 'MANAGER',
    department: 'Project Management & Procurement',
    assignedProjects: ['S&T Maintenance', 'Rolling Stock Spares', 'Ticketing AFC']
  },
  {
    id: 'usr-analyst-01',
    email: 'elayanithish@kmrl.gov.in',
    name: 'ELAYANITHISH',
    role: 'ANALYST',
    department: 'Safety & Compliance Analytics',
    assignedProjects: ['25kV Traction Grid', 'SCADA Network', 'Track Safety']
  },
  {
    id: 'usr-viewer-01',
    email: 'rithika@kmrl.gov.in',
    name: 'RITHIKA',
    role: 'VIEWER',
    department: 'Audit & Inspection Viewer',
    assignedProjects: ['KSPCB Compliance', 'Public Safety Records']
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('kmrl_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USERS[0];
      }
    }
    return DEFAULT_USERS[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('kmrl_auth') === 'true';
  });
  const [availableUsers, setAvailableUsers] = useState<User[]>(DEFAULT_USERS);

  useEffect(() => {
    const url = `${API_BASE_URL}/api/auth/users`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.users && data.users.length > 0) {
          setAvailableUsers(data.users);
        }
      })
      .catch(() => {});
  }, []);

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    const matched = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    const userToSet: User = matched || {
      id: `usr-${Date.now()}`,
      email,
      name: email.split('@')[0].toUpperCase(),
      role: role || 'ANALYST',
      department: 'General Operations',
      assignedProjects: ['Phase 1 Operations']
    };

    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    localStorage.setItem('kmrl_user', JSON.stringify(userToSet));
    localStorage.setItem('kmrl_auth', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kmrl_auth');
  };

  const switchUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('kmrl_user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        availableUsers,
        login,
        logout,
        switchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
