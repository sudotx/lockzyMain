import clsx from "clsx";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils";

type StatCardProps = {
  type: "appointments" | "pending" | "cancelled";
  value: number | boolean | string;
  label: string;
  icon: string;
};

export const StatCard = ({ value, label, icon, type }: StatCardProps) => {
  const renderValue = () => {
    if (typeof value === "number") {
      return value;
    } else if (typeof value === "boolean") {
      return value ? "open" : "closed";
    } else if (typeof value === "string") {
      return formatDateTime(value).dateOnly;
    }
    return "N/A";
  };

  return (
    <div
      className={clsx("stat-card flex flex-col justify-between", {
        "bg-appointments": type === "appointments",
        "bg-pending": type === "pending",
        "bg-cancelled": type === "cancelled",
      })}
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          height={32}
          width={32}
          alt="stat icon"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white truncate">{renderValue()}</h2>
      </div>
      <p className="text-14-regular mt-auto">{label}</p>
    </div>
  );
};
