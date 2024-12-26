// src/components/auth/PendingApproval.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const PendingApproval: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Pending Approval
          </h2>
          <div className="mt-8 text-center">
            <div className="rounded-full h-24 w-24 bg-yellow-100 mx-auto flex items-center justify-center">
              <svg
                className="h-12 w-12 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-center text-gray-600">
            Your account is pending administrator approval. You will receive an email once your account has been approved.
          </p>
          <div className="mt-8 text-center">
            <Link
              to="/auth/signin"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;