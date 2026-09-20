import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthModal.module.css';

export const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const { error } = isRegister 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) throw error;
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{isRegister ? 'Create Account' : 'Log In'}</h2>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <button 
          type="button"
          className={styles.toggleBtn} 
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};