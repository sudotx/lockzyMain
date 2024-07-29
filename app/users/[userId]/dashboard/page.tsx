"use client";

import { NavigationMenu } from "@/components/NavigationMenu";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { changeDoorStatus, signOutUser } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const AdminPage = async () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const handleOpenDoorClick = async () => {
    const a = await changeDoorStatus(1, 1); // unlock door
    toast(a.message);
  };

  const handleSignOut = async () => {
    signOutUser();
    toast("youre signed out");
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
            icon={"/assets/icons/cancelled.svg"}
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

          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white w-full"
            onClick={() => {
              handleSignOut();
              handleNavigation("/");
            }}
          >
            Sign Out
          </Button>
          <Toaster />
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
