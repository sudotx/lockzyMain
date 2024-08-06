import React from "react";

interface GaugeChartComponentProps {
  voltageData: number[];
}

const GaugeChartComponent: React.FC<GaugeChartComponentProps> = ({
  voltageData,
}) => {
  const minVoltage = 220;
  const maxVoltage = 240;

  const calculateBatteryPercentage = (voltage: number): number => {
    return ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;
  };

  const latestBatteryPercentage =
    voltageData.length > 0
      ? calculateBatteryPercentage(voltageData[voltageData.length - 1])
      : 0;

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
                  style={{ width: `${latestBatteryPercentage}%` }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-teal-600 bg-teal-200">
              {latestBatteryPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeChartComponent;
