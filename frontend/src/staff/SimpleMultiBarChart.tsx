interface Series {
  name: string;
  color: string;
  data: { month: string; count: number }[];
}

interface SimpleMultiBarChartProps {
  series: Series[];
}

function SimpleMultiBarChart({ series }: SimpleMultiBarChartProps) {
  const allCounts = series.flatMap((s) => s.data.map((d) => d.count));
  const max = Math.max(...allCounts, 1);

  const months = series[0]?.data ?? [];
  const groupWidth = 100 / months.length;
  const barWidth = (groupWidth * 0.7) / series.length;
  const groupPadding = groupWidth * 0.15;

  return (
    <div>
      <svg viewBox="0 0 300 150" className="w-full">
        {months.map((m, monthIndex) => {
          const groupX = monthIndex * groupWidth;

          return (
            <g key={m.month}>
              {series.map((s, seriesIndex) => {
                const count = s.data[monthIndex]?.count ?? 0;
                const height = (count / max) * 90;
                const barX = groupX + groupPadding + seriesIndex * barWidth;

                return (
                  <g key={s.name}>
                    <rect
                      x={`${barX}%`}
                      y={110 - height}
                      width={`${barWidth * 0.85}%`}
                      height={Math.max(height, 2)}
                      rx={2}
                      fill={s.color}
                    />
                  </g>
                );
              })}

              <text
                x={`${groupX + groupWidth / 2}%`}
                y={128}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="var(--color-navy-100)"
              >
                {m.month}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex items-center justify-center gap-6">
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

export default SimpleMultiBarChart;