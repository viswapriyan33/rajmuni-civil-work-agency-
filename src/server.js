import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Increased body limit to support base64 inspection photo uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static frontend files from 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// In-memory reports store
const savedReports = [];

// Authentication Endpoint supporting both Employee & Admin logins
app.post('/api/login', (req, res) => {
  const { username, email, password, loginType } = req.body;

  const userIdentifier = (username || email || '').trim().toLowerCase();

  if (!userIdentifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Identifier and password are required.',
    });
  }

  // 1. Employee Login: gmail rajmuni@gmail.com, password raj@123
  if (userIdentifier === 'rajmuni@gmail.com' && password === 'raj@123') {
    return res.json({
      success: true,
      message: 'Access Granted: Welcome Employee to Inspection Portal',
      user: {
        type: 'employee',
        isAdmin: false,
        email: 'rajmuni@gmail.com',
        name: 'Rajmuni (Technician)',
        role: 'Field Inspection Technician',
        badge: 'Employee Verified',
      },
      token: 'rajmuni_civil_employee_token_' + Date.now(),
    });
  }

  // 2. Admin Login: username rajmuni, password rajmuni@7729
  if (userIdentifier === 'rajmuni' && password === 'rajmuni@7729') {
    return res.json({
      success: true,
      message: 'Access Granted: Welcome to Rajmuni Civil Admin Portal',
      user: {
        type: 'admin',
        isAdmin: true,
        username: 'rajmuni',
        name: 'Er. Rajmuni',
        role: 'Chief Administrator & Lead Civil Engineer',
        badge: 'Admin Verified',
      },
      token: 'rajmuni_civil_secure_admin_token_' + Date.now(),
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Access Denied: Invalid credentials.',
  });
});

// Inspection Report Submission Endpoint (Local Session / In-Memory Storage)
app.post('/api/inspection', async (req, res) => {
  try {
    const reportPayload = req.body;
    const reportId = Date.now();
    const newReport = {
      id: reportId,
      ...reportPayload,
      createdAt: new Date().toISOString(),
    };
    savedReports.push(newReport);

    console.log(`[Inspection Report Saved]: ID=${reportId}, Client="${reportPayload?.general?.clientName || 'N/A'}"`);

    return res.json({
      success: true,
      reportId: reportId,
      message: 'Inspection report recorded successfully in admin session.',
    });
  } catch (error) {
    console.error('[Inspection API Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all saved inspection reports
app.get('/api/inspections', (req, res) => {
  res.json({
    success: true,
    reports: savedReports,
    count: savedReports.length,
  });
});
});

// High-Definition Text-to-Speech (TTS) Proxy for Tamil, Hindi & English
app.get('/api/tts', async (req, res) => {
  try {
    const text = req.query.text;
    const lang = req.query.lang || 'en';
    if (!text || !text.trim()) {
      return res.status(400).send('Text parameter required');
    }
    const langCode = lang === 'ta' ? 'ta' : lang === 'hi' ? 'hi' : 'en';
    const cleanText = text.trim().slice(0, 200);
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(
      langCode
    )}&q=${encodeURIComponent(cleanText)}`;

    const response = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'TTS upstream response failed' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.warn('[TTS Proxy Error]:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Rajmuni Civil Admin Server Online',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Rajmuni Civil Server running on http://localhost:${PORT}`);
  console.log(`✅ System Ready & Admin Session Active`);
});

export default app;
