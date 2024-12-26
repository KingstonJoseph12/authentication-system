// src/components/auth/SignIn.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext.tsx';

const SignIn: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signin, signup, error } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signin({
          email: formData.email,
          password: formData.password
        });
        toast.success("You're now logged in.");
        navigate('/');
      } else {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profile_image_url: '/user.png'
        });
        toast.success('Account created successfully');
        navigate('/auth/pending');
      }
    } catch (err) {
      console.error(mode === 'signin' ? 'Sign in failed:' : 'Sign up failed:', err);
      toast.error(error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 w-full flex justify-center font-mona ${theme}`}>
      <div className="fixed m-10 z-50">
        <div className="flex space-x-2">
          <div className="self-center">
            <img
              src="/logo.png"
              className="w-10 rounded-full"
              alt="logo"
            />
          </div>
        </div>
      </div>

      <div className="w-full sm:max-w-md px-10 min-h-screen flex flex-col text-center">
        <div className="my-auto pb-10 w-full dark:text-gray-100">
          <form 
            className="flex flex-col justify-center"
            onSubmit={handleSubmit}
          >
            <div className="mb-1">
              <div className="text-2xl font-medium">
                {mode === 'signin' ? 'Sign in' : 'Sign up'}
              </div>

              {mode === 'signup' && (
                <div className="mt-1 text-xs font-medium text-gray-500">
                  ⓘ Your data stays securely on your locally hosted server.
                </div>
              )}
            </div>

            <div className="flex flex-col mt-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <div className="text-sm font-medium text-left mb-1">Name</div>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="px-5 py-3 rounded-2xl w-full text-sm outline-none border dark:border-none dark:bg-gray-900"
                      placeholder="Enter Your Full Name"
                      required
                    />
                  </div>
                  <hr className="my-3 dark:border-gray-900" />
                </>
              )}

              <div className="mb-2">
                <div className="text-sm font-medium text-left mb-1">Email</div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-5 py-3 rounded-2xl w-full text-sm outline-none border dark:border-none dark:bg-gray-900"
                  placeholder="Enter Your Email"
                  required
                />
              </div>

              <div>
                <div className="text-sm font-medium text-left mb-1">Password</div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="px-5 py-3 rounded-2xl w-full text-sm outline-none border dark:border-none dark:bg-gray-900"
                  placeholder="Enter Your Password"
                  required
                />
              </div>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gray-900 hover:bg-gray-800 w-full rounded-2xl text-white font-medium text-sm py-3 transition"
              >
                {isLoading
                  ? 'Please wait...'
                  : mode === 'signin'
                  ? 'Sign in'
                  : 'Create Account'}
              </button>

              <div className="mt-4 text-sm text-center">
                {mode === 'signin'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
                <button
                  type="button"
                  className="font-medium underline ml-1"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            </div>
          </form>

          {/* <div className="inline-flex items-center justify-center w-full">
            <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-950">
              or
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <button 
              className="flex items-center px-6 border-2 dark:border-gray-800 duration-300 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-2xl dark:text-white text-sm py-3 transition"
              onClick={() => window.location.href = '/oauth/google/login'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-6 mr-3">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </button>
          </div> */}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default SignIn;