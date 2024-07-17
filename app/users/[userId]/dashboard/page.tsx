import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import OpenButton from "@/components/openDoorButton";
import { Button } from "@/components/ui/button";
// import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async () => {
  // const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer"></Link>

        <p className="text-16-semibold">User Dashboard</p>
        <p className="text-16-semibold">Monitoring</p>
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
            icon={"/assets/icons/pending.svg"}
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
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <section className="button-section flex space-x-4">
          <Button type="submit" className="shad-primary-btn w-full">
            Open Door
          </Button>
        </section>

        {/* <DataTable columns={columns} data={appointments.documents} /> */}
      </main>
    </div>
  );
};

export default AdminPage;
