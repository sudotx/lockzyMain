"use client";

import { Button } from "@/components/ui/button";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DeleteAccountComingSoon = () => {
  const [userId, setUserId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const handleDelete = () => {
    // Replace this with your delete logic
    toast({
      title: "Account Deleted.",
      description: `User account with ID ${userId} has been deleted.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose(); // Close the modal after deletion
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Input
        placeholder="Enter User ID to delete"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        mb={4}
      />
      <Button onClick={onOpen}>Delete Account</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Account Deletion</ModalHeader>
          <ModalBody>
            <Text>
              Are you sure you want to delete the account with ID {userId}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white w-full"
              onClick={() => {
                handleDelete();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DeleteAccountComingSoon;
