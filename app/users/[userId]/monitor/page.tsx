"use client";

import DoorStatItem from "@/components/DoorStatItem";
import data from "@/data.json";
import { useEffect, useState } from "react";
import Image from "next/image";

interface DoorStat {
  id: string;
  current: number;
  voltage: number;
  status: string;
}

const DashboardPage = () => {
  const [firestoreStats, setFirestoreStats] = useState<DoorStat[]>([]);
  const [realtimeStats, setRealtimeStats] = useState<{
    [key: string]: DoorStat;
  }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const realtimeData = data.doors; // Use static data from the imported JSON
        setRealtimeStats(realtimeData);
      } catch (error) {
        console.error("Error fetching door stats:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto p-6">
        <div className="sub-container max-w-[800px] mx-auto">
          <div>
            <h2 className="text-xl font-medium mb-4">Realtime Door Stats</h2>
            <ul className="space-y-4">
              {Object.entries(realtimeStats).map(([doorId, stats]) => (
                <DoorStatItem key={doorId} doorId={stats.id} stats={stats} />
              ))}
            </ul>
          </div>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="text-dark-600 xl:text-left">© 2024 Lockzy</p>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default DashboardPage;
