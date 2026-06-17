const RiskBadge = ({ risk, size = 'md' }) => {
  const configs = {
    HIGH: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      dot: 'bg-red-400'
    },
    MODERATE: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      dot: 'bg-yellow-400'
    },
    Moderate: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      dot: 'bg-yellow-400'
    },
    High: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      dot: 'bg-red-400'
    },
    LOW: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      dot: 'bg-green-400'
    },
    Low: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      dot: 'bg-green-400'
    },
    MINIMAL: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      dot: 'bg-blue-400'
    },
    None: {
      bg: 'bg-slate-500/20',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      dot: 'bg-slate-400'
    }
  };

  const config = configs[risk] || configs['None'];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 ${padding} rounded-full border font-medium ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {risk}
    </span>
  );
};

export default RiskBadge;