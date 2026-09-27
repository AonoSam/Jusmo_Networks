interface SimpleLineChartProps {
  data: { month: string; count: number }[];
}

function SimpleLineChart({ data }: SimpleLineChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const width = 300;
  const height = 140;
  const chartTop = 20;
  const chartBottom = 110;
  const chartHeight = chartBottom - chartTop;
  const stepX = width / (data.length - 1 || 1);

  const points = data.map((point, i) => {
    const x = i * stepX;
    const y = chartBottom - (point.count / max) * chartHeight;
    return { x, y, ...point };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${chartBottom} L ${points[0]?.x ?? 0} ${chartBottom} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-500)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Filled area under the curve */}
      <path d={areaPath} fill="url(#lineFill)" />

      {/* The line itself */}
      <path d={linePath} fill="none" stroke="var(--color-gold-500)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p) => (
        <g key={p.month}>
          {/* Point marker */}
          <circle cx={p.x} cy={p.y} r={3.5} fill="var(--color-gold-500)" stroke="var(--color-navy-950)" strokeWidth="1.5" />

          {/* Count label above each point */}
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="white"
          >
            {p.count}
          </text>

          {/* Month label */}
          <text
            x={p.x}
            y={128}
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="var(--color-navy-100)"
          >
            {p.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default SimpleLineChart;