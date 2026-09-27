interface Series {
  name: string;
  color: string;
  data: { month: string; count: number }[];
}

interface SimpleMultiLineChartProps {
  series: Series[];
}

function SimpleMultiLineChart({ series }: SimpleMultiLineChartProps) {
  const allCounts = series.flatMap((s) => s.data.map((d) => d.count));
  const max = Math.max(...allCounts, 1);
  // Round the axis max up to a clean number so gridline labels look intentional
  const axisMax = Math.max(5, Math.ceil(max / 5) * 5);

  const width = 320;
  const height = 160;
  const paddingLeft = 28;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 28;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotTop = paddingTop;
  const plotBottom = height - paddingBottom;
  const plotHeight = plotBottom - plotTop;

  const months = series[0]?.data ?? [];
  const stepX = plotWidth / (months.length - 1 || 1);

  const buildPoints = (data: { month: string; count: number }[]) =>
    data.map((point, i) => ({
      x: paddingLeft + i * stepX,
      y: plotBottom - (point.count / axisMax) * plotHeight,
      ...point,
    }));

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((frac) => ({
    value: Math.round(axisMax * frac),
    y: plotBottom - frac * plotHeight,
  }));

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Horizontal gridlines + y-axis value labels */}
        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={tick.y}
              y2={tick.y}
              stroke="var(--color-navy-800)"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 6}
              y={tick.y + 3}
              textAnchor="end"
              fontSize="9"
              fill="var(--color-navy-400)"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {series.map((s) => {
          const points = buildPoints(s.data);
          const linePath = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ");

          return (
            <g key={s.name}>
              <path
                d={linePath}
                fill="none"
                stroke={s.color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {points.map((p) => (
                <circle key={p.month} cx={p.x} cy={p.y} r={2.5} fill={s.color} />
              ))}
            </g>
          );
        })}

        {/* Month labels — x positions match the line points exactly,
            with the outermost labels anchored inward so they can't clip */}
        {months.map((m, i) => {
          const x = paddingLeft + i * stepX;
          const isFirst = i === 0;
          const isLast = i === months.length - 1;

          return (
            <text
              key={m.month}
              x={x}
              y={height - 8}
              textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
              fontSize="10"
              fontWeight="600"
              fill="var(--color-navy-100)"
            >
              {m.month}
            </text>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-center gap-6">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-xs font-medium text-navy-100">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimpleMultiLineChart;