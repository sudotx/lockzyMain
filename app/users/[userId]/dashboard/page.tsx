"use client";

import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const AdminPage = async () => {
  const router = useRouter();
  const handleNavigation = () => {
    router.push("monitor");
  };

  const handleOpenDoorClick = () => {
    alert("Opening Your Door.");
    // send open signal to the database
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer"></Link>

        <button
          onClick={handleNavigation}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Go to Monitoring
        </button>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Manage your Door stats</p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="pending"
            count={1}
            label="Current Door Status"
            icon={"/assets/icons/arrow.svg"}
          />
          <StatCard
            type="cancelled"
            count={1}
            label="Total Open Events"
            icon={"/assets/icons/cancelled.svg"}
          />
          <StatCard
            type="cancelled"
            count={1}
            label="Last Open Time"
            icon={"/assets/icons/calendar.svg"}
          />
        </section>

        <section className="button-section flex space-x-4">
          <Button
            type="submit"
            className="shad-primary-btn w-full"
            onClick={handleOpenDoorClick}
          >
            Open Door
          </Button>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="text-dark-600 xl:text-left">© 2024 Lockzy</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
