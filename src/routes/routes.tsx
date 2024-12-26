// src/routes/routes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PrivateRoute, AdminRoute } from '../components/routes/ProtectedRoutes';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import PendingApproval from '../components/auth/PendingApproval';
import UsersManagement from '../components/admin/UsersManagement';
import Dashboard from '../components/Dashboard';

interface CustomRouteObject extends Omit<RouteObject, 'children'> {
  path: string;
  element: React.ReactNode;
  children?: CustomRouteObject[];
}

export const routes: CustomRouteObject[] = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/auth/signin",
    element: <SignIn />,
  },
  {
    path: "/auth/signup",
    element: <SignUp />,
  },
  {
    path: "/auth/pending",
    element: <PendingApproval />,
  },
  {
    path: "/admin/users",
    element: (
      <AdminRoute>
        <UsersManagement />
      </AdminRoute>
    ),
  },
];