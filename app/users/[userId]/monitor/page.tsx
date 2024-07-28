"use client";

import ChartComponent from "@/components/ChartComponent";
import DoorStatItem from "@/components/DoorStatItem";
import doorData from "@/data-snapshot.json";
import { useEffect, useState } from "react";

interface DoorSnapshot {
  timestamp: string;
  current: number;
  voltage: number;
  lastAccessed: string;
  status: string;
  id: string;
}

interface DoorData {
  [doorName: string]: DoorSnapshot[];
}

const DashboardPage = () => {
  const [doorStats, setDoorStats] = useState<DoorData>({});
  const [selectedDoor, setSelectedDoor] = useState<string>("");

  useEffect(() => {
    setDoorStats(doorData.doors);
    if (Object.keys(doorData.doors).length > 0) {
      setSelectedDoor(Object.keys(doorData.doors)[0]);
    }
  }, []);

  const getChartData = (doorName: string) => {
    const snapshots = doorStats[doorName] || [];
    return {
      labels: snapshots.map((snapshot) =>
        new Date(snapshot.timestamp).toLocaleString()
      ),
      currentData: snapshots.map((snapshot) => snapshot.current),
      voltageData: snapshots.map((snapshot) => snapshot.voltage),
    };
  };

  const chartData = getChartData(selectedDoor);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto p-6">
        <div className="sub-container max-w-[800px] mx-auto">
          <div>
            <h2 className="text-xl font-medium mb-4">Select Door</h2>
            <select
              value={selectedDoor}
              onChange={(e) => setSelectedDoor(e.target.value)}
              className="mb-4 p-2 rounded border border-gray-300"
            >
              {Object.keys(doorStats).map((doorName) => (
                <option key={doorName} value={doorName}>
                  {doorName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h2 className="text-xl font-small mb-4">
              Voltage and Current Over Time
            </h2>
            <div className="mb-12">
              <ChartComponent
                currentData={chartData.currentData}
                labels={chartData.labels}
                voltageData={chartData.voltageData}
              />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-medium mb-4">Realtime Stats</h2>
            <ul className="space-y-4">
              {Object.entries(doorStats).map(([doorName, snapshots]) => {
                const latestSnapshot = snapshots[snapshots.length - 1];
                return (
                  <DoorStatItem
                    key={doorName}
                    doorId={latestSnapshot.id}
                    stats={{
                      current: latestSnapshot.current,
                      voltage: latestSnapshot.voltage,
                      status: "open",
                    }}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
