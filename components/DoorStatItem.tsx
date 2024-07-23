// components/DoorStatItem.tsx
import React from "react";

interface DoorStat {
  current: number;
  voltage: number;
  status: string;
}

interface DoorStatItemProps {
  doorId: string;
  stats: DoorStat;
}

const DoorStatItem: React.FC<DoorStatItemProps> = ({ doorId, stats }) => {
  return (
    <li
      key={doorId}
      className="bg-gray-800 text-white p-4 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-2">Door ID: {doorId}</h3>
      <p className="text-sm text-gray-300 mb-1">Current: {stats.current} A</p>
      <p className="text-sm text-gray-300 mb-1">Voltage: {stats.voltage} V</p>
      <p className="text-sm text-gray-300">Status: {stats.status}</p>
    </li>
  );
};

export default DoorStatItem;
