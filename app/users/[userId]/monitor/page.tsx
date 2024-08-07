"use client";

import GaugeChartComponent from "@/components/ChartComponent";
import DoorStatItem from "@/components/DoorStatItem";
import Navbar from "@/components/NavBar";
import doorData from "@/data-snapshot.json";
import { useEffect, useState } from "react";

interface DoorSnapshot {
  Current: number;
  Power: number;
  Voltage: number;
  batPercent: number;
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

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <section className="remove-scrollbar container my-auto p-6">
        <Navbar />
        <div className="sub-container max-w-[800px] mx-auto">
          <div className="mb-12">
            <GaugeChartComponent />
          </div>
          <div>
            <h2 className="text-xl font-medium mb-3 text-white">
              Realtime Stats
            </h2>
          </div>
          <div>
            <ul className="space-y-4">
              {Object.entries(doorStats).map(([doorName, snapshots]) => {
                return (
                  <DoorStatItem
                    key={doorName}
                    doorId={doorName} // Using doorName as ID
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
