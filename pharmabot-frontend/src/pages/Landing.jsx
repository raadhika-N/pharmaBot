import { Link } from 'react-router-dom';
import { Activity, Zap, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div
      className="bg-dark-900 flex flex-col items-center justify-center text-center px-6"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2" style={{ marginBottom: '32px' }}>
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold" style={{ fontSize: '20px' }}>PharmaBot</span>
      </div>

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400"
        style={{ padding: '8px 16px', fontSize: '13px', marginBottom: '24px' }}
      >
        <Zap className="w-3.5 h-3.5" />
        AI-Powered Drug Interaction Detection
      </div>

      {/* Headline */}
      <h1
        className="font-bold text-white leading-tight"
        style={{ fontSize: '48px', marginBottom: '16px', maxWidth: '700px' }}
      >
        Know Before You
        <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent"> Prescribe</span>
      </h1>

      {/* Subtext */}
      <p
        className="text-slate-400 leading-relaxed"
        style={{ fontSize: '16px', marginBottom: '32px', maxWidth: '520px' }}
      >
        Upload a prescription and instantly detect dangerous drug interactions — backed by real medical evidence.
      </p>

      {/* CTA */}
      <Link
        to="/auth"
        className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
        style={{ padding: '14px 32px', fontSize: '16px', marginBottom: '48px' }}
      >
        Start Free
        <ArrowRight className="w-4 h-4" />
      </Link>

      {/* Steps row */}
      <div className="flex items-center justify-center" style={{ gap: '40px' }}>
        {['Upload', 'Extract', 'Analyse', 'Report'].map((label, i) => (
          <div key={label} className="flex items-center" style={{ gap: '8px' }}>
            <span
              className="flex items-center justify-center rounded-full bg-brand-500/10 text-brand-400 font-medium"
              style={{ width: '24px', height: '24px', fontSize: '12px' }}
            >
              {i + 1}
            </span>
            <span className="text-slate-400" style={{ fontSize: '13px' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-slate-600" style={{ fontSize: '11px', marginTop: '40px' }}>
        For educational purposes only — not a substitute for professional medical advice
      </p>
    </div>
  );
};

export default Landing;