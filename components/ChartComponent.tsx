import { getCurrentPercentage } from "@/lib/actions/user.actions";
import React, { useEffect, useState } from "react";

interface GaugeChartComponentProps {}

const GaugeChartComponent: React.FC<GaugeChartComponentProps> = () => {
  const [batteryPercentage, setBatteryPercentage] = useState<number>(0);

  useEffect(() => {
    const fetchBatteryPercentage = async () => {
      try {
        const result = await getCurrentPercentage();
        setBatteryPercentage(parseFloat(result.pct));
      } catch (error) {
        console.error("Error fetching battery percentage:", error);
      }
    };

    fetchBatteryPercentage();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="w-full max-w-[400px]">
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-teal-600 bg-teal-200">
              Battery Percentage
            </span>
          </div>
          <div className="relative flex mb-2 items-center">
            <div className="flex-1">
              <div className="relative flex py-1 px-4 border-2 border-teal-200 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full bg-teal-400 rounded-full"
                  style={{ width: `${batteryPercentage}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-teal-600 bg-teal-200">
              {batteryPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeChartComponent;
