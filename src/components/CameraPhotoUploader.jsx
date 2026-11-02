import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, Trash2, Eye, Video, CheckCircle2 } from 'lucide-react';

export default function CameraPhotoUploader({
  label = 'Photo',
  value,
  onChange,
  isThermal = false,
}) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop camera when unmounting or deactivated
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access device camera. Please select a photo from your device using Upload Photo.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onChange(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`camera-uploader-box ${isThermal ? 'thermal-theme' : ''}`}>
      <div className="uploader-header">
        <span className="uploader-title">
          {label}
        </span>
        {isThermal && <span className="thermal-badge">FLIR / IRT SPEC</span>}
      </div>

      {/* Main View Area: Either Preview, Live Camera, or Empty Viewfinder */}
      <div className="viewfinder-container">
        {value ? (
          // Captured / Uploaded Image Preview
          <div className="preview-image-wrapper">
            <img src={value} alt={label} className="captured-preview-img" />
            <div className="preview-overlay-bar">
              <span className="preview-status-pill">
                <CheckCircle2 size={13} />
                <span>Captured</span>
              </span>
              <button
                type="button"
                className="btn-remove-photo"
                onClick={() => onChange(null)}
                title="Remove photo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ) : isCameraActive ? (
          // Live Camera Stream Section
          <div className="live-camera-feed-box">
            <video ref={videoRef} className="camera-video-stream" playsInline autoPlay muted />
            <div className="camera-crosshairs">
              <div className="crosshair-h" />
              <div className="crosshair-v" />
              <div className="camera-frame-corners" />
            </div>
            <div className="camera-controls-floating">
              <button
                type="button"
                className="btn-shutter-snap"
                onClick={capturePhoto}
                title="Take Picture"
              >
                <div className="shutter-inner-circle" />
              </button>
              <button
                type="button"
                className="btn-cancel-cam"
                onClick={stopCamera}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Empty State with Camera Viewfinder Visual
          <div className="empty-viewfinder">
            <div className="viewfinder-reticle">
              <Camera size={38} className="viewfinder-icon" />
              <div className="corner-bracket top-left" />
              <div className="corner-bracket top-right" />
              <div className="corner-bracket bottom-left" />
              <div className="corner-bracket bottom-right" />
            </div>
            <p className="viewfinder-hint">
              {isThermal ? 'Capture or upload thermal heat map' : 'Capture or upload site visual photo'}
            </p>
          </div>
        )}
      </div>

      {/* Camera Error Message if any */}
      {cameraError && (
        <div className="camera-error-notice">
          {cameraError}
        </div>
      )}

      {/* Action toolbar when no photo uploaded */}
      {!value && !isCameraActive && (
        <div className="uploader-action-toolbar">
          {/* Live Camera Button */}
          <button
            type="button"
            className="btn-action-tool btn-cam-primary"
            onClick={startCamera}
          >
            <Camera size={15} />
            <span>Open Camera</span>
          </button>

          {/* Upload Button */}
          <button
            type="button"
            className="btn-action-tool"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={15} />
            <span>Upload Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>
      )}
    </div>
  );
}
