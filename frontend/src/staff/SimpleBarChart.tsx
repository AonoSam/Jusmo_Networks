interface SimpleBarChartProps {
  data: { month: string; count: number }[];
}

function SimpleBarChart({ data }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const barWidth = 100 / data.length;

  return (
    <svg viewBox="0 0 300 140" className="w-full">
      {data.map((point, i) => {
        const height = (point.count / max) * 100;
        const x = i * barWidth;

        return (
          <g key={point.month}>
            <rect
              x={`${x + barWidth * 0.2}%`}
              y={110 - height}
              width={`${barWidth * 0.6}%`}
              height={Math.max(height, 2)}
              rx={3}
              fill="var(--color-gold-500)"
            />
            <text
              x={`${x + barWidth * 0.5}%`}
              y={128}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="var(--color-navy-100)"
            >
              {point.month}
            </text>
            <text
              x={`${x + barWidth * 0.5}%`}
              y={110 - height - 6}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="white"
            >
              {point.count}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default SimpleBarChart;