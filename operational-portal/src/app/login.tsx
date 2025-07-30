import React, { useState, useEffect } from 'react';

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string[];
  password: string[];
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      status: string;
      role_id: number;
      created_at: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

const LoginComponent: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({
    email: [],
    password: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      console.log('User is already authenticated');
    }
  }, []);

  const validateEmail = (email: string): string[] => {
    const errors: string[] = [];
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }
    return errors;
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors].length > 0) {
      setErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
  };

  const validateForm = (): boolean => {
    const emailErrors = validateEmail(formData.email);
    const passwordErrors = validatePassword(formData.password);
    
    const newErrors: FormErrors = {
      email: emailErrors,
      password: passwordErrors
    };
    
    setErrors(newErrors);
    return emailErrors.length === 0 && passwordErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      setSuccessMessage('Login successful! Redirecting...');
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        console.log('Login successful:', data);
      }, 1000);
      
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFieldInvalid = (fieldName: keyof FormErrors): boolean => {
    return errors[fieldName].length > 0;
  };

  return (
    <div className="shared-login-container">
      <div className="shared-login-card">
        <div className="shared-login-header">
          <h1 className="shared-login-title">Welcome Back</h1>
          <p className="shared-login-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="shared-alert success">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="shared-alert error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="shared-form-group">
            <label htmlFor="email" className="shared-form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`shared-form-input ${isFieldInvalid('email') ? 'error' : ''}`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {isFieldInvalid('email') && (
              <span className="shared-form-error">
                {errors.email[0]}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="shared-form-group">
            <label htmlFor="password" className="shared-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`shared-form-input ${isFieldInvalid('password') ? 'error' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {isFieldInvalid('password') && (
              <span className="shared-form-error">
                {errors.password[0]}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="shared-form-button"
            disabled={isLoading}
          >
            {isLoading && <span className="shared-loading"></span>}
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Toggle to Signup */}
        <div className="shared-form-toggle">
          Don't have an account?
          <a href="/signup" className="shared-form-toggle-link">
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent; 