import React, { useState, useRef, useCallback } from 'react';

export default function SplitRenovationViewer() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const onMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="split-viewer-box"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={onMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={onTouchMove}
      onClick={(e) => handleMove(e.clientX)}
    >
      {/* Animated Vertical Laser Beam */}
      <div className="scanning-laser-beam" />

      {/* Before Layer: Architectural CAD Blueprint */}
      <div
        className="split-layer-blueprint"
        style={{ backgroundImage: "url('/assets/renovation_blueprint.jpg')" }}
      />

      {/* After Layer: Luxury Renovated Living Room */}
      <div
        className="split-layer-renovated"
        style={{ width: `${sliderPos}%` }}
      >
        <div
          className="split-layer-renovated-inner"
          style={{ backgroundImage: "url('/assets/renovation_luxury.jpg')" }}
        />
      </div>

      {/* Interactive Divider Line with Knob */}
      <div
        className="split-slider-line"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="split-center-knob" title="Drag to compare Blueprint vs Renovation">
          &#10094;&#10095;
        </div>
      </div>

      {/* Badges */}
      <span className="layer-badge-tag badge-villa">★ Luxury Renovated</span>
      <span className="layer-badge-tag badge-cad">CAD Blueprint Draft</span>
    </div>
  );
}
