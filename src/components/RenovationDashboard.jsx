import React from 'react';
import { LogOut, FileText, CheckCircle2 } from 'lucide-react';

export default function RenovationDashboard({ user, onLogout, onOpenInspectionReport }) {
  return (
    <section className="renovation-portal-dashboard">
      {/* Top Header */}
      <div className="portal-top-bar">
        <div className="lead-user-profile">
          <div className="user-crest-badge">
            <div className="user-crest-inner">RC</div>
          </div>
          <div className="user-titles-box">
            <h2>Welcome, {user?.name || 'Er. Rajmuni'}</h2>
            <p>{user?.role || 'Administrator & Lead Civil Engineer'} &bull; rajmuni</p>
          </div>
        </div>

        <button type="button" className="signout-button" onClick={onLogout}>
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* System Status Ribbon */}
      <div className="db-sync-strip">
        <div className="db-sync-left">
          <FileText size={18} style={{ color: 'var(--blueprint-blue)' }} />
          <span>Rajmuni Civil Operations &bull; <strong>Inspection Reports &amp; Engineering Oversight</strong></span>
        </div>
        <div style={{ color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} />
          <span>Admin System Online &bull; Reports Synchronized</span>
        </div>
      </div>
    </section>
  );
}
