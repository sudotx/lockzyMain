import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const NavigationMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-2xl p-2"
      ></button>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Menu
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleNavigation("monitor")}>
            Go to Monitoring
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("delete-account")}>
            Delete Account
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};
