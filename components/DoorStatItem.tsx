import { getCurrent, getPower, getVoltage } from "@/lib/actions/user.actions";
import React, { useEffect, useState } from "react";

interface DoorStatItemProps {
  doorId: string;
}

const DoorStatItem: React.FC<DoorStatItemProps> = ({ doorId }) => {
  const [current, setCurrent] = useState<number>(0);
  const [voltage, setVoltage] = useState<number>(0);
  const [power, setPower] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentData = await getCurrent();
        const powerData = await getPower();
        const voltageData = await getVoltage();

        setCurrent(currentData.curr);
        setPower(powerData.pwr);
        setVoltage(voltageData.vlt);
      } catch (error) {
        console.error("Error fetching door stats:", error);
      }
    };

    fetchStats();
  }, [doorId]); // Fetch stats whenever doorId changes

  return (
    <li
      key={doorId}
      className="bg-gray-800 text-white p-4 rounded-lg shadow-lg"
    >
      <p className="text-sm text-gray-300 mb-1">Power: {power} W</p>
      <p className="text-sm text-gray-300 mb-1">Current: {current} A</p>
      <p className="text-sm text-gray-300 mb-1">Voltage: {voltage} V</p>
    </li>
  );
};

export default DoorStatItem;
