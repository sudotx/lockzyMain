"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DeleteAccountComingSoon = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] text-center">
          <h1 className="header mb-6">Account Deletion Coming Soon</h1>
          <p className="text-dark-700 mb-8">
            We're working hard to implement a secure account deletion process.
            This feature will be available in the near future. Thank you for
            your patience.
          </p>

          <Button
            className="shad-primary-btn"
            onClick={() => handleNavigation("dashboard")}
          >
            Return to Dashboard
          </Button>

          <div className="text-14-regular mt-20">
            <p className="text-dark-600">© 2024 Lockzy</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeleteAccountComingSoon;
