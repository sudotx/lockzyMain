"use client";

import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminPage = async () => {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleOpenDoorClick = () => {
    alert("Opening Your Door.");
    // send open signal to the database
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header flex justify-between items-center">
        <Link href="/" className="cursor-pointer"></Link>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl p-2"
          >
            ☰
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={() => handleNavigation("monitor")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                Go to Monitoring
              </button>
              <button
                onClick={() => handleNavigation("delete-account")}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
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

        <div>
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="text-dark-600 xl:text-left">© 2024 Lockzy</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
