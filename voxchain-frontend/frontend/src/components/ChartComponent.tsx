import { candidates } from '../data/store';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#5b6af5', '#9254f5', '#10b981', '#f59e0b'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { fullName: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-lg rounded-xl px-4 py-2">
        <p className="text-sm font-body font-semibold text-slate-800">{payload[0].payload.fullName}</p>
        <p className="text-sm text-primary-500 font-mono">{payload[0].value} votes</p>
      </div>
    );
  }
  return null;
}

interface Props {
  /** Map of candidateId → vote count, from live API */
  votesById: Record<string, number>;
  totalVotes: number;
}

export default function ChartComponent({ votesById, totalVotes }: Props) {
  const data = candidates.map((c, i) => ({
    name: c.name.split(' ').slice(-1)[0],
    fullName: c.name,
    votes: votesById[c.id] || 0,
    fill: COLORS[i],
  }));

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-body font-semibold text-slate-700 mb-4 text-sm">Votes Per Candidate</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fontFamily: 'DM Sans', fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fontFamily: 'JetBrains Mono', fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie / donut chart */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-body font-semibold text-slate-700 mb-4 text-sm">Vote Share</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="votes"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Legend
              formatter={(value) => (
                <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: '#64748b' }}>{value}</span>
              )}
              iconType="circle"
              iconSize={8}
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 text-center">
          <span className="font-mono text-xs text-slate-400">{totalVotes} total votes cast</span>
        </div>
      </div>
    </div>
  );
}
