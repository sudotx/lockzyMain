"use client";

import { NavigationMenu } from "@/components/NavigationMenu";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import {
  changeDoorStatus,
  getFingerPrintId,
  signOutUser,
} from "@/lib/actions/user.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminPage = async () => {
  const router = useRouter();

  const [doorId, setDoorId] = useState(null);

  useEffect(() => {
    const fetchDoorId = async () => {
      const id = (await getIdFromDb()).id;
      setDoorId(id);
    };
    fetchDoorId();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const handleOpenDoorClick = async () => {
    const a = await changeDoorStatus(1, 1); // unlock door
    toast(a.message);
  };

  const handleSignOut = async () => {
    signOutUser();
    handleNavigation("/");
  };

  const getIdFromDb = async () => {
    // get current id value from db
    const res = await getFingerPrintId();
    return res;
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header flex justify-between items-center">
        <Link href="/" className="cursor-pointer"></Link>
        <NavigationMenu />
      </header>

      <main className="admin-main">
        <section className="admin-stat">
          {/* <StatCard
            type="pending"
            value={true} // boolean
            label="Current Door Status"
            icon={"/assets/icons/check.svg"}
          /> */}
          <StatCard
            type="cancelled"
            value={doorId!} // number
            label="Door Id"
            icon={"/assets/icons/user.svg"}
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
