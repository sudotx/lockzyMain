"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LogOutPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSignOut = async () => {};

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] text-center">
          <Button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            onClick={() => {
              handleNavigation("/");
              handleSignOut();
            }}
          >
            Log Out
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LogOutPage;
