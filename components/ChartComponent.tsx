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
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  labels,
  voltageData,
}) => {
  const minVoltage = 220; // Replace with actual minimum voltage
  const maxVoltage = 240; // Replace with actual maximum voltage

  const calculateBatteryPercentage = (voltage: number): number => {
    return ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
  };

  const data = labels.map((label, index) => ({
    name: label,
    batteryPercentage: calculateBatteryPercentage(voltageData[index]),
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
          domain={[0, 100]}
          label={{
            value: "Battery Percentage",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="batteryPercentage"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
