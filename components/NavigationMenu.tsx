import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const NavigationMenu = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex justify-between items-center w-full">
      <section>
        <h1 className="header">Your Dashboard</h1>
      </section>

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
