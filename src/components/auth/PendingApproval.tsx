// src/components/auth/PendingApproval.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface AdminDetails {
  name: string;
  email: string;
}

const PendingApproval: React.FC = () => {
  const [adminDetails, setAdminDetails] = useState<AdminDetails | null>(null);
  const navigate = useNavigate();
  const { signout } = useAuth();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get('/api/v1/users/admin', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAdminDetails(response.data);
      } catch (error) {
        console.error('Error fetching admin details:', error);
      }
    };

    fetchAdminDetails();
  }, []);

  const handleCheckAgain = () => {
    window.location.href = '/';
  };

  const handleSignOut = () => {
    signout();
    navigate('/auth/signin');
  };

  return (
    <div className="fixed w-full h-full flex z-[999]">
      <div className="absolute w-full h-full backdrop-blur-lg bg-white/10 dark:bg-gray-900/50 flex justify-center">
        <div className="m-auto pb-10 flex flex-col justify-center">
          <div className="max-w-md">
            <div className="text-center dark:text-white text-2xl font-medium z-50">
              Account Activation Pending<br />
              Contact Admin for WebUI Access
            </div>

            <div className="mt-4 text-center text-sm dark:text-gray-200 w-full">
              Your account status is currently pending activation.<br />
              To access the WebUI, please reach out to the administrator. Admins can manage user statuses from the Admin Panel.
            </div>

            {adminDetails && (
              <div className="mt-4 text-sm font-medium text-center">
                <div>Admin: {adminDetails.name} ({adminDetails.email})</div>
              </div>
            )}

            <div className="mt-6 mx-auto relative group w-fit">
              <button
                className="relative z-20 flex px-5 py-2 rounded-full bg-white border border-gray-100 dark:border-none hover:bg-gray-100 text-gray-700 transition font-medium text-sm"
                onClick={handleCheckAgain}
              >
                Check Again
              </button>

              <button
                className="text-xs text-center w-full mt-2 text-gray-400 underline"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;