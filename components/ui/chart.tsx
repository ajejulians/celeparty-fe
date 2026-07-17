"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ChartConfig {
	[key: string]: { label: string; color: string };
}

interface ChartProps {
	data: Record<string, unknown>[];
	config: ChartConfig;
	className?: string;
}

export function Chart({ data, config, className }: ChartProps) {
	const keys = Object.keys(config);
	return (
		<div className={className}>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart
					data={data}
					margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
						stroke="var(--color-neutral-200)"
					/>
					<XAxis
						dataKey="label"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tick={{ fontSize: 12, fontFamily: "Inter" }}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tick={{ fontSize: 12, fontFamily: "Inter" }}
					/>
					<Tooltip
						cursor={{ fill: "var(--color-c-blue-50)" }}
						contentStyle={{
							borderRadius: "8px",
							border: "1px solid var(--color-neutral-200)",
							fontFamily: "Inter",
							fontSize: "13px",
						}}
					/>
					{keys.map((key) => (
						<Bar
							key={key}
							dataKey={key}
							fill={config[key].color}
							radius={[4, 4, 0, 0]}
						/>
					))}
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

interface AreaChartProps extends ChartProps {
	type?: "area";
}

export function AreaChartComponent({
	data,
	config,
	className,
}: AreaChartProps) {
	const {
		Area,
		AreaChart,
		CartesianGrid,
		ResponsiveContainer,
		Tooltip,
		XAxis,
		YAxis,
	} = require("recharts");
	const keys = Object.keys(config);
	return (
		<div className={className}>
			<ResponsiveContainer width="100%" height={300}>
				<AreaChart
					data={data}
					margin={{ top: 16, right: 16, bottom: 0, left: 0 }}
				>
					<defs>
						{keys.map((key) => (
							<linearGradient
								key={key}
								id={`fill-${key}`}
								x1="0"
								y1="0"
								x2="0"
								y2="1"
							>
								<stop
									offset="5%"
									stopColor={config[key].color}
									stopOpacity={0.15}
								/>
								<stop
									offset="95%"
									stopColor={config[key].color}
									stopOpacity={0}
								/>
							</linearGradient>
						))}
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
						stroke="#E5E5E5"
					/>
					<XAxis
						dataKey="label"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tick={{ fontSize: 12, fontFamily: "Inter" }}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						tick={{ fontSize: 12, fontFamily: "Inter" }}
					/>
					<Tooltip
						cursor={{ fill: "#F0EDF9" }}
						contentStyle={{
							borderRadius: "8px",
							border: "1px solid #E5E5E5",
							fontFamily: "Inter",
							fontSize: "13px",
						}}
					/>
					{keys.map((key) => (
						<Area
							key={key}
							dataKey={key}
							fill={`url(#fill-${key})`}
							stroke={config[key].color}
							strokeWidth={2}
						/>
					))}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
