const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const VALID_PASSWORDS = ['nightowl', 'idiot'];

function normalize(str) {
  return str.toLowerCase().replace(/\s+/g, '');
}

app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ success: false, message: 'No password provided' });
  const norm = normalize(password);
  if (VALID_PASSWORDS.includes(norm)) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, message: 'Wrong password' });
});

const bases = ['◆', '●', '▲', '■', '★', '✦'];
const mods = ['⁰', '¹', '²', '³', '⁴'];
const alpha = 'abcdefghijklmnopqrstuvwxyz';

const encMap = {};
const decMap = {};
alpha.split('').forEach((ch, i) => {
  const g = Math.floor(i / 5);
  const p = i % 5;
  const sym = bases[Math.min(g, bases.length - 1)] + mods[p];
  encMap[ch] = sym;
  decMap[sym] = ch;
});

app.post('/api/encode', (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ result: '' });
  const result = text.split('').map(ch => {
    if (ch === ' ') return '  ';
    const l = ch.toLowerCase();
    return encMap[l] || ch;
  }).join('');
  res.json({ result });
});

app.post('/api/decode', (req, res) => {
  const { text } = req.body;
  if (!text) return res.json({ result: '' });
  let result = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === ' ' && text[i + 1] === ' ') { result += ' '; i += 2; continue; }
    if (text[i] === ' ') { i++; continue; }
    const chunk = text.substr(i, 2);
    if (decMap[chunk]) { result += decMap[chunk]; i += 2; }
    else { result += text[i]; i++; }
  }
  res.json({ result });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Void server running on port ${PORT}`));