import React, { useState, useEffect } from 'react';
import BlueprintCanvas from './components/BlueprintCanvas';
import FloatingRenovationMaterials from './components/FloatingRenovationMaterials';
import LoginCard3D from './components/LoginCard3D';
import InspectionReportWizard from './components/InspectionReportWizard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Track mouse coordinates for 3D parallax and cursor spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app-root-wrapper">
      {/* Dynamic Animated Canvas Grid & CAD Scanner */}
      <BlueprintCanvas />

      {/* Interactive Cursor Spotlight */}
      <div className="cursor-spotlight-layer" />

      {/* Main View: Login Screen or Professional Inspection Form Wizard */}
      {!currentUser ? (
        <main className="centered-login-stage">
          {/* Floating 3D Renovation Materials & Tools */}
          <FloatingRenovationMaterials mousePos={mousePos} />

          {/* Centered 3D Holographic Login Card */}
          <div className="login-card-focal-center">
            <LoginCard3D onLoginSuccess={(user) => setCurrentUser(user)} />
          </div>
        </main>
      ) : (
        <InspectionReportWizard
          user={currentUser}
          onLogout={() => setCurrentUser(null)}
        />
      )}
    </div>
  );
}
