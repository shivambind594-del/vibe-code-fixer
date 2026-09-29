import { useState, useEffect, useRef } from 'react'
import CountUp from './components/CountUp'

// ─────────────────────────────────────────────
// Scroll reveal hook
// ─────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// Minimal syntax highlighter for display purposes
// ─────────────────────────────────────────────
function highlight(code) {
  const escape = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  let out = escape(code)

  // Safe ASCII placeholder — no weird unicode chars that get stripped
  const tokens = []
  const stash = (html) => {
    tokens.push(html)
    return `__TOK${tokens.length - 1}__`
  }

  // 1. Comments FIRST — before strings, so "//" inside strings isn't matched
  out = out.replace(/(\/\/[^\n]*)/g, (m) =>
    stash(`<span class="tok-comment">${m}</span>`)
  )

  // 2. Strings
  out = out.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, (m) =>
    stash(`<span class="tok-string">${m}</span>`)
  )

  // 3. Keywords
  out = out.replace(
    /\b(const|let|var|function|return|import|from|export|default|if|else|useState|useEffect|prev)\b/g,
    (m) => stash(`<span class="tok-keyword">${m}</span>`)
  )

  // 4. Numbers
  out = out.replace(/\b(\d+)\b/g, (m) =>
    stash(`<span class="tok-number">${m}</span>`)
  )

  // 5. JSX tags
  out = out.replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, (m) =>
    stash(`<span class="tok-tag">${m}</span>`)
  )

  // Restore tokens — loop until no placeholders remain
  let prev = ''
  while (prev !== out) {
    prev = out
    out = out.replace(/__TOK(\d+)__/g, (_, i) => tokens[Number(i)])
  }

  return out
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function PortfolioPiece() {
  const [isFixed, setIsFixed] = useState(false)
  const [metrics, setMetrics] = useState({
    users: 1240,
    revenue: 5800,
    growth: 0,
  })
  const [shakeKey, setShakeKey] = useState(0)
  const [connectPulse, setConnectPulse] = useState(false)

  const handleIncrement = (key) => {
    if (!isFixed) {
      setShakeKey((k) => k + 1)
      return
    }
    setMetrics((prev) => ({
      ...prev,
      [key]: prev[key] + (key === 'growth' ? 5 : 100),
    }))
  }

  const handleConnectWallet = () => {
    if (!isFixed) {
      setShakeKey((k) => k + 1)
      return
    }
    setConnectPulse(true)
    setTimeout(() => setConnectPulse(false), 600)
  }

  return (
    <>
      <div className="aurora-bg" />
      <div className="grid-overlay" />

      <div className="min-h-screen p-6 md:p-10 relative">
        <div className="max-w-7xl mx-auto">
          {/* ─────────── HEADER ─────────── */}
          <Reveal>
            <div className="mb-12">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full glass text-xs font-medium text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live interactive demo
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                    Vibe Code Fixer
                  </h1>
                  <p className="text-slate-400 text-base md:text-lg max-w-2xl">
                    Portfolio piece: Before &amp; After fixing AI-generated dashboard
                  </p>
                </div>

                <div className="glass rounded-2xl p-5 flex flex-col gap-3 min-w-[280px]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                        Showing
                      </p>
                      <p
                        className={`font-bold text-lg transition-colors ${
                          isFixed ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isFixed ? '✓ Fixed Version' : '✗ Broken Version'}
                      </p>
                    </div>
                    <button
                      aria-label="Toggle version"
                      onClick={() => setIsFixed(!isFixed)}
                      className={`relative w-16 h-9 rounded-full transition-all duration-300 cursor-pointer ${
                        isFixed
                          ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                          : 'bg-red-900/60 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-lg transition-all duration-300 ${
                          isFixed ? 'translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Flip to see the fix in real-time
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass glass-hover rounded-xl p-4 border-l-4 border-l-red-500">
                  <div className="inline-block bg-red-500/15 text-red-300 text-[10px] font-bold px-2 py-1 rounded tracking-wider">
                    BROKEN STATE
                  </div>
                  <p className="text-sm text-slate-300 mt-2">
                    Buttons don't update the UI
                  </p>
                </div>
                <div className="glass glass-hover rounded-xl p-4 border-l-4 border-l-orange-500">
                  <div className="inline-block bg-orange-500/15 text-orange-300 text-[10px] font-bold px-2 py-1 rounded tracking-wider">
                    FAKE DATA
                  </div>
                  <p className="text-sm text-slate-300 mt-2">
                    Hardcoded values, not dynamic
                  </p>
                </div>
                <div className="glass glass-hover rounded-xl p-4 border-l-4 border-l-purple-500">
                  <div className="inline-block bg-purple-500/15 text-purple-300 text-[10px] font-bold px-2 py-1 rounded tracking-wider">
                    MISSING INTEGRATION
                  </div>
                  <p className="text-sm text-slate-300 mt-2">
                    "Connect Wallet" button does nothing
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ─────────── DASHBOARD DEMO ─────────── */}
          <Reveal delay={100}>
            <div
              key={shakeKey}
              className={`rounded-2xl transition-all duration-500 overflow-hidden ${
                isFixed
                  ? 'glass border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
                  : 'glass border-2 border-dashed border-red-500/60'
              }`}
              style={!isFixed && shakeKey > 0 ? { animation: 'shake 0.4s ease-in-out' } : {}}
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                  <button
                    onClick={handleConnectWallet}
                    className={`px-5 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                      isFixed
                        ? `bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-lg shadow-emerald-900/40 ${
                            connectPulse ? 'animate-pulse' : ''
                          }`
                        : 'bg-slate-700/60 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isFixed ? '✓ Connect Wallet' : '✗ Connect Wallet'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                  <MetricCard
                    label="Active Users"
                    value={metrics.users}
                    delta="+12% this week"
                    buttonLabel="+100"
                    buttonColor="blue"
                    isFixed={isFixed}
                    onClick={() => handleIncrement('users')}
                    prefix=""
                  />
                  <MetricCard
                    label="Revenue"
                    value={metrics.revenue}
                    delta="+8% this week"
                    buttonLabel="+$100"
                    buttonColor="emerald"
                    isFixed={isFixed}
                    onClick={() => handleIncrement('revenue')}
                    prefix="$"
                  />
                  <MetricCard
                    label="Growth Rate"
                    value={metrics.growth}
                    delta="Month over month"
                    buttonLabel="+5%"
                    buttonColor="purple"
                    isFixed={isFixed}
                    onClick={() => handleIncrement('growth')}
                    suffix="%"
                  />
                </div>

                <div
                  className={`rounded-lg p-4 text-sm transition-all ${
                    isFixed
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200'
                      : 'bg-red-500/10 border border-red-500/30 text-red-200'
                  }`}
                >
                  {isFixed ? (
                    <span>
                      ✓ <strong>Fixed version:</strong> All metrics update in real-time. State
                      management is properly wired. Buttons are functional.
                    </span>
                  ) : (
                    <span>
                      ⚠️ <strong>In the broken version:</strong> Click the "+100" buttons
                      above—nothing happens. State changes aren't connected to the render.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* ─────────── CODE COMPARISON ─────────── */}
          <Reveal delay={150}>
            <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CodePanel
                variant="broken"
                label="BEFORE"
                title="Broken Code"
                code={`const Dashboard = () => {
  const metrics = {
    users: 1240,
    revenue: 5800,
    growth: 0
  };

  const handleIncrement = () => {
    // ❌ BUG: State not declared!
    // metrics.users += 100;
    // This won't re-render
  };

  return (
    <div>
      <p>{metrics.users}</p>
      <button onClick={handleIncrement}>
        +100
      </button>
    </div>
  );
};`}
                bullets={[
                  'No useState hook for state management',
                  "Direct object mutations don't trigger re-renders",
                  "Component won't update when user clicks",
                  'Static hardcoded values',
                ]}
              />

              <CodePanel
                variant="fixed"
                label="AFTER"
                title="Fixed Code"
                code={`const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    users: 1240,
    revenue: 5800,
    growth: 0
  });

  const handleIncrement = (key) => {
    setMetrics(prev => ({
      ...prev,
      [key]: prev[key] + (key === 'growth' ? 5 : 100)
    }));
  };

  return (
    <div>
      <p>{metrics.users}</p>
      <button onClick={() => handleIncrement('users')}>
        +100
      </button>
    </div>
  );
};`}
                bullets={[
                  '✓ Proper useState hook for reactive state',
                  '✓ Immutable state updates with setMetrics',
                  '✓ Component re-renders on state change',
                  '✓ Dynamic values update in real-time',
                ]}
              />
            </div>
          </Reveal>

          {/* ─────────── COMMON ISSUES ─────────── */}
          <Reveal delay={200}>
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">
                Common AI-Generated Issues Fixed
              </h2>
              <p className="text-slate-400 mb-8">
                The four patterns I fix most often in Vibe Code, Cursor, and Lovable output.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <IssueCard
                  emoji="❌"
                  color="red"
                  title="Missing State Management"
                  description="AI often creates components that look like they should work but don't use React hooks properly."
                  fix="Introduce useState, useEffect, useContext, and useReducer where needed."
                />
                <IssueCard
                  emoji="🔄"
                  color="orange"
                  title="Hardcoded Mock Data"
                  description="Components display static data that never changes, making them unsuitable for real apps."
                  fix="Connect to real APIs, implement proper data fetching, and dynamic rendering."
                />
                <IssueCard
                  emoji="🔌"
                  color="purple"
                  title="Non-Functional Integrations"
                  description="Buttons and interactions exist visually but don't do anything—auth, payments, APIs are broken."
                  fix="Wire up real authentication flows, payment integrations, and API calls."
                />
                <IssueCard
                  emoji="📦"
                  color="blue"
                  title="Poor Component Structure"
                  description="Massive monolithic components that should be broken down, no prop drilling solutions, tangled logic."
                  fix="Refactor into smaller, reusable components with proper prop interfaces."
                />
              </div>
            </div>
          </Reveal>

          {/* ─────────── CTA ─────────── */}
          <Reveal delay={250}>
            <div className="mt-16 glass rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-transparent to-blue-600/10 pointer-events-none" />
              <div className="relative">
                <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-white tracking-tight">
                  I fix broken AI-generated code.
                </h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Non-technical founders use Vibe Code, Cursor, and Lovable to ship MVPs
                  fast—but they break the moment you add real features. I specialize in
                  React, Tailwind, and Vite. I'll refactor your messy components, wire up
                  proper state management, integrate your APIs, and deliver
                  production-ready code.
                </p>
                <p className="text-slate-400 text-sm">
                  Market demand: massive surge in jobs seeking help for broken AI code{' '}
                  <span className="text-slate-500">(Fiverr marketplace data)</span>
                </p>
              </div>
            </div>
          </Reveal>

          <div className="h-16" />
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────
// MetricCard
// ─────────────────────────────────────────────
function MetricCard({
  label,
  value,
  delta,
  buttonLabel,
  buttonColor,
  isFixed,
  onClick,
  prefix = '',
  suffix = '',
}) {
  const colorMap = {
    blue: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40',
    emerald: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40',
    purple: 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/40',
  }

  return (
    <div className="glass glass-hover rounded-xl p-5 group">
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">
        {label}
      </p>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
            <CountUp value={value} prefix={prefix} suffix={suffix} />
          </p>
          <p className="text-slate-500 text-xs mt-1">{delta}</p>
        </div>
        <button
          onClick={onClick}
          disabled={!isFixed}
          className={`px-3 py-1.5 rounded-md text-xs font-bold text-white transition-all ${
            isFixed
              ? `${colorMap[buttonColor]} shadow-lg cursor-pointer active:scale-95`
              : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// CodePanel
// ─────────────────────────────────────────────
function CodePanel({ variant, label, title, code, bullets }) {
  const isBroken = variant === 'broken'

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-block text-[10px] font-bold px-2 py-1 rounded tracking-wider ${
            isBroken
              ? 'bg-red-500/15 text-red-300'
              : 'bg-emerald-500/15 text-emerald-300'
          }`}
        >
          {label}
        </span>
        <h3
          className={`text-lg font-bold ${
            isBroken ? 'text-red-300' : 'text-emerald-300'
          }`}
        >
          {title}
        </h3>
      </div>

      <div
        className={`glass rounded-xl overflow-hidden ${
          isBroken ? 'border-red-500/20' : 'border-emerald-500/20'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950/60 border-b border-slate-800">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-xs text-slate-500 font-mono">
            dashboard.jsx
          </span>
        </div>

               <pre className="p-4 text-[11.5px] leading-relaxed text-slate-300 overflow-x-auto font-mono whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>

      <div className="mt-4 text-sm text-slate-400">
        <p className="mb-2 font-semibold text-slate-300">
          {isBroken ? 'Issues:' : 'Fixes:'}
        </p>
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span
                className={`shrink-0 ${
                  isBroken ? 'text-red-400' : 'text-emerald-400'
                }`}
              >
                {isBroken ? '×' : '✓'}
              </span>
              <span>{b.replace(/^✓ /, '')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// IssueCard
// ─────────────────────────────────────────────
function IssueCard({ emoji, color, title, description, fix }) {
  const borderMap = {
    red: 'border-l-red-500',
    orange: 'border-l-orange-500',
    purple: 'border-l-purple-500',
    blue: 'border-l-blue-500',
  }
  const titleMap = {
    red: 'text-red-300',
    orange: 'text-orange-300',
    purple: 'text-purple-300',
    blue: 'text-blue-300',
  }

  return (
    <div className={`glass glass-hover rounded-xl p-6 border-l-4 ${borderMap[color]}`}>
      <h4 className={`font-bold mb-3 text-lg ${titleMap[color]}`}>
        <span className="mr-2">{emoji}</span>
        {title}
      </h4>
      <p className="text-slate-300 text-sm mb-3 leading-relaxed">{description}</p>
      <p className="text-slate-400 text-xs leading-relaxed">
        <strong className="text-slate-300">Fix:</strong> {fix}
      </p>
    </div>
  )
}