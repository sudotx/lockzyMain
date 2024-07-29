import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartComponentProps {
  labels: string[];
  voltageData: number[];
  currentData: number[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  labels,
  voltageData,
  currentData,
}) => {
  const data = labels.map((label, index) => ({
    name: label,
    voltage: voltageData[index],
    current: currentData[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          yAxisId="left"
          domain={["dataMin - 1", "dataMax + 1"]}
          label={{ value: "Voltage", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={["dataMin - 0.1", "dataMax + 0.1"]}
          label={{ value: "Current", angle: 90, position: "insideRight" }}
        />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="voltage"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="current"
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
