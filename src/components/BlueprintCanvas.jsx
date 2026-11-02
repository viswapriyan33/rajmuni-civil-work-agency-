import React, { useEffect, useRef } from 'react';

export default function BlueprintCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles (Golden architectural dust & blueprint technical sparks)
    const particleCount = 45;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.2,
        opacity: Math.random() * 0.7 + 0.2,
        isGold: Math.random() > 0.4,
      });
    }

    // CAD Architectural Drafting Crosshair Nodes
    const nodes = [
      { x: 0.15, y: 0.22, label: 'WALL 3A / 14\'6" REF: DET-14' },
      { x: 0.28, y: 0.78, label: 'ELEVATION +11\'0" CURTAIN' },
      { x: 0.82, y: 0.28, label: 'ROOF PARAPET +39\'6"' },
      { x: 0.72, y: 0.82, label: 'HARDWOOD DECKING LOAD' },
    ];

    let gridOffset = 0;
    let scanY = 0;
    let scanDir = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Architectural Blueprint CAD Grid
      gridOffset = (gridOffset + 0.15) % 40;
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.04)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = gridOffset; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = gridOffset; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Animate Laser Scan Line
      scanY += 1.2 * scanDir;
      if (scanY > height) scanDir = -1;
      if (scanY < 0) scanDir = 1;

      const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      gradient.addColorStop(0, 'rgba(0, 210, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 210, 255, 0.12)');
      gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 30, width, 60);

      // 3. Draw CAD Architectural Technical Nodes & Crosshairs
      nodes.forEach((node) => {
        const nx = node.x * width;
        const ny = node.y * height;

        // Crosshair
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nx - 10, ny);
        ctx.lineTo(nx + 10, ny);
        ctx.moveTo(nx, ny - 10);
        ctx.lineTo(nx, ny + 10);
        ctx.stroke();

        // Technical Box
        ctx.strokeRect(nx - 5, ny - 5, 10, 10);

        // Technical text
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(0, 210, 255, 0.45)';
        ctx.fillText(node.label, nx + 14, ny + 4);
      });

      // 4. Update and Draw Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.isGold
          ? `rgba(246, 200, 84, ${p.opacity})`
          : `rgba(0, 210, 255, ${p.opacity})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.isGold ? 'rgba(246, 200, 84, 0.8)' : 'rgba(0, 210, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="canvas-container">
      <canvas ref={canvasRef} className="blueprint-canvas" />
    </div>
  );
}
