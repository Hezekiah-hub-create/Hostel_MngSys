import { useState, useCallback } from 'react';

export const useLoginForm = (onSubmit) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (email) => {
    const regex = /^.+@.+$/;
    return regex.test(email);
  };

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear submit error if typing
    if (submitError) setSubmitError('');
  }, [errors, submitError]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    // Minimal validation
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData.email, formData.password);
    } catch (error) {
      setSubmitError(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  return {
    formData,
    showPassword,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
    togglePassword: () => setShowPassword(prev => !prev)
  };
};
