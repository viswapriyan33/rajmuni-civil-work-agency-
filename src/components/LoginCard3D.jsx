import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Lock, Eye, EyeOff, ShieldAlert, ArrowRight, ShieldCheck, User, Mail, Briefcase } from 'lucide-react';

export default function LoginCard3D({ onLoginSuccess }) {
  // 'employee' (Normal Login) or 'admin' (Admin Login)
  const [loginMode, setLoginMode] = useState('employee');

  // Employee credentials: gmail: rajmuni@gmail.com, password: raj@123
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [employeeName, setEmployeeName] = useState('');

  // Admin credentials: username: rajmuni, password: rajmuni@7729
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // 3D Tilt Card Ref
  const cardRef = useRef(null);

  // 3D Tilt on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    cardRef.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    cardRef.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#00d2ff', '#d4af37', '#f6c854', '#ffffff'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#00d2ff', '#d4af37', '#f6c854', '#ffffff'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 550));

    // 1. NORMAL EMPLOYEE LOGIN: gmail: rajmuni@gmail.com, password: raj@123
    if (loginMode === 'employee') {
      const targetEmail = 'rajmuni@gmail.com';
      const targetPassword = 'raj@123';

      if (!employeeEmail || !employeePassword) {
        setIsLoading(false);
        setErrorMessage('Please enter employee Gmail and password.');
        triggerShake();
        return;
      }

      if (employeeEmail.trim().toLowerCase() === targetEmail && employeePassword === targetPassword) {
        triggerConfetti();
        onLoginSuccess({
          type: 'employee',
          isAdmin: false,
          email: targetEmail,
          name: employeeName.trim() || 'Rajmuni (Technician)',
          inspectorName: employeeName.trim() || 'Rajmuni (Technician)',
          role: 'Field Inspection Technician',
        });
      } else {
        setIsLoading(false);
        setErrorMessage('Access Denied: Invalid employee credentials. Authorized Gmail: rajmuni@gmail.com & password: raj@123');
        triggerShake();
      }
      return;
    }

    // 2. ADMIN LOGIN: username: rajmuni, password: rajmuni@7729
    if (loginMode === 'admin') {
      const targetUsername = 'rajmuni';
      const targetPassword = 'rajmuni@7729';

      if (!adminUsername || !adminPassword) {
        setIsLoading(false);
        setErrorMessage('Please enter admin username and password.');
        triggerShake();
        return;
      }

      if (adminUsername.trim().toLowerCase() === targetUsername && adminPassword === targetPassword) {
        triggerConfetti();
        onLoginSuccess({
          type: 'admin',
          isAdmin: true,
          username: targetUsername,
          name: 'Er. Rajmuni',
          inspectorName: 'Er. Rajmuni (Administrator)',
          role: 'Chief Administrator & Lead Civil Engineer',
        });
      } else {
        setIsLoading(false);
        setErrorMessage('Access Denied: Invalid admin credentials. Authorized username: rajmuni & password: rajmuni@7729');
        triggerShake();
      }
      return;
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 600);
  };

  return (
    <div className="login-card-perspective-wrapper">
      <div
        ref={cardRef}
        className={`login-card-3d-box ${isShaking ? 'card-shake-error' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glowing Animated Border Beam */}
        <div className="card-border-beam" />

        {/* 2 Login Mode Switcher Pills */}
        <div className="login-role-tabs-strip">
          <button
            type="button"
            className={`login-tab-pill ${loginMode === 'employee' ? 'active-tab' : ''}`}
            onClick={() => {
              setLoginMode('employee');
              setErrorMessage('');
            }}
          >
            <User size={14} />
            <span>Employee Login</span>
          </button>

          <button
            type="button"
            className={`login-tab-pill ${loginMode === 'admin' ? 'active-tab' : ''}`}
            onClick={() => {
              setLoginMode('admin');
              setErrorMessage('');
            }}
          >
            <ShieldCheck size={14} />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Card Header */}
        <div className="card-header-block" style={{ marginTop: '0.4rem' }}>
          <div className="architect-avatar-ring">
            {loginMode === 'admin' ? <ShieldCheck strokeWidth={2} /> : <Briefcase strokeWidth={2} />}
          </div>

          <h2 className="login-card-title">
            {loginMode === 'admin' ? 'Rajmuni Admin Portal' : 'Employee Inspection Portal'}
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
            {loginMode === 'admin'
              ? 'Executive Dashboard & Report Oversight'
              : 'Normal Technician Login — Form & Official PDF Report'}
          </p>
        </div>

        {/* Login Form */}
        <form className="login-form-element" onSubmit={handleSubmit} noValidate>
          {/* ====================================================
              MODE 1: EMPLOYEE LOGIN FIELDS
          ==================================================== */}
          {loginMode === 'employee' && (
            <>
              {/* Employee / Inspector Name Field */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="employee-name-input">
                  Employee / Inspector Name
                </label>
                <div className="input-control-wrapper">
                  <span className="input-prefix-icon">
                    <User size={19} />
                  </span>
                  <input
                    id="employee-name-input"
                    type="text"
                    className="form-input-stylish"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Employee Gmail Field */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="employee-email-input">
                  Employee Gmail
                </label>
                <div className="input-control-wrapper">
                  <span className="input-prefix-icon">
                    <Mail size={19} />
                  </span>
                  <input
                    id="employee-email-input"
                    type="email"
                    className="form-input-stylish"
                    value={employeeEmail}
                    onChange={(e) => setEmployeeEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Employee Password Field */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="employee-password-input">
                  Password
                </label>
                <div className="input-control-wrapper">
                  <span className="input-prefix-icon">
                    <Lock size={19} />
                  </span>
                  <input
                    id="employee-password-input"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input-stylish"
                    value={employeePassword}
                    onChange={(e) => setEmployeePassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="eye-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ====================================================
              MODE 2: ADMIN LOGIN FIELDS
          ==================================================== */}
          {loginMode === 'admin' && (
            <>
              {/* Admin Username Field */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="admin-username-input">
                  Admin Username
                </label>
                <div className="input-control-wrapper">
                  <span className="input-prefix-icon">
                    <User size={19} />
                  </span>
                  <input
                    id="admin-username-input"
                    type="text"
                    className="form-input-stylish"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Admin Password Field */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="admin-password-input">
                  Admin Password
                </label>
                <div className="input-control-wrapper">
                  <span className="input-prefix-icon">
                    <Lock size={19} />
                  </span>
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input-stylish"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="eye-visibility-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Error Alert */}
          {errorMessage && (
            <div className="error-alert-box">
              <ShieldAlert size={18} style={{ color: 'var(--danger-color)', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spin-indicator" />
            ) : (
              <>
                <span>
                  {loginMode === 'admin' ? 'Enter Admin Dashboard' : 'Open Form & PDF Report'}
                </span>
                <ArrowRight size={19} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
