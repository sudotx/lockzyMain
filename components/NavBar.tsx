// components/Navbar.tsx

import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";

const Navbar = () => {
  const router = useRouter();

  const handleReturnToDashboard = () => {
    router.push("dashboard"); // Adjust the path based on your routes
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl">Lockzy Monitoring</h1>
        <Button onClick={handleReturnToDashboard} colorScheme="teal">
          Return to Dashboard
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
