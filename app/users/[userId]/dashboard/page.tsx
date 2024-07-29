"use client";

import { NavigationMenu } from "@/components/NavigationMenu";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AdminPage = async () => {
  const handleOpenDoorClick = () => {
    alert("Opening Your Door.");
    // send open signal to the database
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header flex justify-between items-center">
        <Link href="/" className="cursor-pointer"></Link>
        <NavigationMenu />
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Your Dashboard</h1>
          <p className="text-dark-700"></p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="pending"
            value={true} // boolean
            label="Current Door Status"
            icon={"/assets/icons/arrow.svg"}
          />
          <StatCard
            type="cancelled"
            value={1} // number
            label="Door Id"
            icon={"/assets/icons/1cancelled.svg"}
          />
          <StatCard
            type="cancelled"
            value={new Date().toISOString()} // date string
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
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
