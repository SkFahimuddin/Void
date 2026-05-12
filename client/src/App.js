import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050508;
    --bg2: #0d0d14;
    --bg3: #12121c;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.14);
    --accent: #7b5ea7;
    --accent2: #a07fd4;
    --text: #e8e6f0;
    --muted: #6b6880;
    --glow: rgba(123,94,167,0.25);
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Space Mono', monospace;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .noise {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(123,94,167,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(123,94,167,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
  }
  .orb1 { width: 400px; height: 400px; background: rgba(123,94,167,0.12); top: -100px; right: -100px; }
  .orb2 { width: 300px; height: 300px; background: rgba(80,60,140,0.1); bottom: -80px; left: -80px; }

  .page { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }

  /* ── PASSWORD SCREEN ── */
  .lock-wrap { width: 100%; max-width: 420px; display: flex; flex-direction: column; align-items: center; gap: 32px; animation: fadeUp 0.6s ease both; }

  .lock-icon { font-size: 48px; opacity: 0.5; filter: grayscale(1); }

  .void-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(52px, 14vw, 88px);
    font-weight: 800;
    letter-spacing: -4px;
    background: linear-gradient(135deg, #fff 30%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .lock-sub { font-size: 13px; letter-spacing: 0.5px; color: var(--muted); text-transform: none; text-align: center; font-style: italic; line-height: 1.6; }

  .lock-form { width: 100%; display: flex; flex-direction: column; gap: 12px; }

  .pw-input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border2);
    border-radius: 8px;
    padding: 14px 18px;
    font-family: 'Space Mono', monospace;
    font-size: 15px;
    color: var(--text);
    outline: none;
    letter-spacing: 2px;
    transition: border-color 0.2s, box-shadow 0.2s;
    text-align: center;
  }
  .pw-input::placeholder { letter-spacing: 1px; color: var(--muted); font-size: 13px; }
  .pw-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--glow); }
  .pw-input.error { border-color: #e24b4a; box-shadow: 0 0 0 3px rgba(226,75,74,0.15); animation: shake 0.3s ease; }

  .enter-btn {
    width: 100%;
    padding: 14px;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }
  .enter-btn:hover { background: var(--accent2); }
  .enter-btn:active { transform: scale(0.98); }
  .enter-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .err-msg { font-size: 12px; color: #e24b4a; text-align: center; min-height: 16px; letter-spacing: 1px; }

  .footer { position: fixed; bottom: 16px; left: 0; right: 0; text-align: center; font-size: 11px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; z-index: 1; }

  /* ── MAIN APP ── */
  .app-wrap { width: 100%; max-width: 700px; display: flex; flex-direction: column; gap: 0; animation: fadeUp 0.5s ease both; }

  .app-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 32px; }

  .app-title {
    font-family: 'Syne', sans-serif;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #fff 30%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logout-btn { background: none; border: 1px solid var(--border2); border-radius: 6px; color: var(--muted); font-family: 'Space Mono', monospace; font-size: 11px; padding: 6px 12px; cursor: pointer; letter-spacing: 1px; transition: border-color 0.2s, color 0.2s; }
  .logout-btn:hover { border-color: var(--border2); color: var(--text); }

  .cipher-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
  }

  .card-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); }
  .card-badge { font-size: 10px; letter-spacing: 2px; color: var(--accent2); border: 1px solid rgba(160,127,212,0.3); border-radius: 20px; padding: 3px 10px; }

  .cipher-textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    padding: 18px 20px;
    font-family: 'Space Mono', monospace;
    font-size: 15px;
    color: var(--text);
    line-height: 1.8;
    min-height: 110px;
  }
  .cipher-textarea::placeholder { color: var(--muted); font-size: 13px; }

  .arrow-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 4px 0; color: var(--muted); font-size: 12px; letter-spacing: 2px; }
  .arrow-icon { font-size: 20px; color: var(--accent); animation: pulse 2s ease infinite; }

  .output-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .output-text {
    padding: 18px 20px;
    font-size: 17px;
    line-height: 2;
    min-height: 110px;
    word-break: break-all;
    color: var(--text);
    user-select: all;
  }
  .output-text.empty { color: var(--muted); font-size: 13px; font-style: italic; }

  .bottom-row { display: flex; gap: 10px; }

  .copy-btn {
    flex: 1;
    padding: 13px;
    background: transparent;
    border: 1px solid var(--accent);
    border-radius: 8px;
    color: var(--accent2);
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .copy-btn:hover { background: rgba(123,94,167,0.12); }
  .copy-btn.copied { border-color: #3b6d11; color: #97c459; }

  .clear-btn {
    padding: 13px 20px;
    background: transparent;
    border: 1px solid var(--border2);
    border-radius: 8px;
    color: var(--muted);
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .clear-btn:hover { color: var(--text); border-color: var(--text); }

  .ref-toggle { width: 100%; background: none; border: 1px solid var(--border); border-radius: 8px; padding: 12px; color: var(--muted); font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 2px; cursor: pointer; margin-top: 4px; transition: color 0.2s, border-color 0.2s; }
  .ref-toggle:hover { color: var(--text); border-color: var(--border2); }

  .ref-panel { margin-top: 12px; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; animation: fadeUp 0.3s ease both; }
  .ref-title { font-size: 10px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 16px; }

  .legend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .legend-item { display: flex; align-items: center; gap: 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 6px 12px; font-size: 12px; }
  .legend-sym { font-size: 16px; }
  .legend-range { color: var(--muted); font-size: 11px; }

  .ref-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 6px; }
  .ref-cell { background: var(--bg3); border: 1px solid var(--border); border-radius: 6px; padding: 8px 4px; text-align: center; }
  .ref-sym { font-size: 16px; line-height: 1.4; }
  .ref-let { font-size: 10px; color: var(--muted); margin-top: 2px; letter-spacing: 1px; }

  .group-sep { grid-column: 1/-1; border-top: 1px solid var(--border); margin: 4px 0; }

  /* ── ANIMATIONS ── */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
`;

const bases = ['◆','●','▲','■','★','✦'];
const mods  = ['⁰','¹','²','³','⁴'];
const alpha = 'abcdefghijklmnopqrstuvwxyz';
const encMap = {};
const decMap = {};
alpha.split('').forEach((ch, i) => {
  const sym = bases[Math.min(Math.floor(i/5), bases.length-1)] + mods[i%5];
  encMap[ch] = sym;
  decMap[sym] = ch;
});

function encode(text) {
  return text.split('').map(ch => ch === ' ' ? '  ' : (encMap[ch.toLowerCase()] || ch)).join('');
}

function decode(text) {
  let result = '', i = 0;
  while (i < text.length) {
    if (text[i] === ' ' && text[i+1] === ' ') { result += ' '; i += 2; continue; }
    if (text[i] === ' ') { i++; continue; }
    const chunk = text.substr(i, 2);
    if (decMap[chunk]) { result += decMap[chunk]; i += 2; }
    else { result += text[i]; i++; }
  }
  return result;
}

function isEncoded(text) {
  return bases.some(b => text.includes(b));
}

const groupNames = ['A – E','F – J','K – O','P – T','U – Y','Z'];

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const pwRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('void_auth');
    if (saved === 'true') setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed && pwRef.current) pwRef.current.focus();
  }, [authed]);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setPwError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('void_auth', 'true');
        setAuthed(true);
      } else {
        setPwError('wrong password');
        setPw('');
        pwRef.current?.focus();
      }
    } catch {
      setPwError('cannot connect to server');
    }
    setLoading(false);
  }

  function handleInput(val) {
    setInput(val);
    if (!val.trim()) { setOutput(''); setMode(''); return; }
    if (isEncoded(val)) {
      setMode('decode');
      setOutput(decode(val));
    } else {
      setMode('encode');
      setOutput(encode(val));
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleClear() {
    setInput(''); setOutput(''); setMode('');
  }

  function handleLogout() {
    sessionStorage.removeItem('void_auth');
    setAuthed(false);
    setPw('');
  }

  return (
    <>
      <style>{styles}</style>
      <div className="noise" />
      <div className="grid-bg" />
      <div className="orb orb1" />
      <div className="orb orb2" />

      <div className="page">
        {!authed ? (
          <div className="lock-wrap">
            <div className="lock-icon">⬡</div>
            <div className="void-title">VOID</div>
            <div className="lock-sub">a name he gave, a name you know, type it here and in you go</div>
            <form className="lock-form" onSubmit={handleAuth}>
              <input
                ref={pwRef}
                className={`pw-input${pwError ? ' error' : ''}`}
                type="password"
                placeholder="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setPwError(''); }}
                autoComplete="off"
              />
              <button className="enter-btn" type="submit" disabled={loading || !pw}>
                {loading ? '...' : 'ENTER'}
              </button>
              <div className="err-msg">{pwError}</div>
            </form>
          </div>
        ) : (
          <div className="app-wrap">
            <div className="app-header">
              <div className="app-title">VOID</div>
              <button className="logout-btn" onClick={handleLogout}>LOCK</button>
            </div>

            <div className="cipher-card">
              <div className="card-header">
                <span className="card-label">input</span>
                {mode && (
                  <span className="card-badge">
                    {mode === 'encode' ? '↓ ENCODING' : '↑ DECODING'}
                  </span>
                )}
              </div>
              <textarea
                className="cipher-textarea"
                placeholder="type in english to encode — or paste symbols to decode"
                value={input}
                onChange={e => handleInput(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="arrow-row">
              <span className="arrow-icon">⬡</span>
              <span>{mode === 'decode' ? 'decoding void script' : mode === 'encode' ? 'encoding to void script' : 'void script'}</span>
              <span className="arrow-icon">⬡</span>
            </div>

            <div className="output-card">
              <div className="card-header">
                <span className="card-label">output</span>
                {output && <span className="card-badge">READY</span>}
              </div>
              <div className={`output-text${!output ? ' empty' : ''}`}>
                {output || 'output appears here...'}
              </div>
            </div>

            <div className="bottom-row">
              <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy} disabled={!output}>
                {copied ? '✓ COPIED' : 'COPY'}
              </button>
              <button className="clear-btn" onClick={handleClear}>CLEAR</button>
            </div>

            <button className="ref-toggle" onClick={() => setShowRef(v => !v)}>
              {showRef ? '▲ hide reference map' : '▼ show reference map'}
            </button>

            {showRef && (
              <div className="ref-panel">
                <div className="ref-title">Reference map — void script</div>
                <div className="legend">
                  {bases.map((b, i) => (
                    <div className="legend-item" key={b}>
                      <span className="legend-sym">{b}</span>
                      <span className="legend-range">{groupNames[i]}</span>
                    </div>
                  ))}
                  {mods.map((m, i) => (
                    <div className="legend-item" key={m}>
                      <span className="legend-sym">{m}</span>
                      <span className="legend-range">pos {i+1}</span>
                    </div>
                  ))}
                </div>
                <div className="ref-grid">
                  {alpha.split('').map((ch, i) => (
                    <>
                      {i > 0 && i % 5 === 0 && <div className="group-sep" key={`sep-${i}`} />}
                      <div className="ref-cell" key={ch}>
                        <div className="ref-sym">{encMap[ch]}</div>
                        <div className="ref-let">{ch.toUpperCase()}</div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="footer">Fahim MindWorks</div>
    </>
  );
}