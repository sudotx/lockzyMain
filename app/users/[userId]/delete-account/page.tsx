"use client";

import {
  changeDoorStatus,
  getAndDecrementFingerprintId,
} from "@/lib/actions/user.actions";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
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
import { PasskeyModal } from "@/components/PasskeyModal";

const DeleteAccountPage = () => {
  const [userId, setUserId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await Promise.all([
        changeDoorStatus(0, 1), // delete mode
        getAndDecrementFingerprintId(), // decrement fingerprint ID
      ]);

      toast({
        title: "Account Deleted Successfully.",
        description: `ID ${userId} has been deleted.`,
        status: "success",
        duration: 1000,
      });

      router.push("dashboard");

      // Close the modal
      onClose();
    } catch (error) {
      console.error("An error occurred during the delete process:", error);
      toast({
        title: "Error.",
        description: "An error occurred while deleting the account.",
        status: "error",
        duration: 1000,
      });
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      p={4}
    >
      <Box
        width="full"
        maxWidth="md"
        p={6}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        bg="white"
      >
        <Text fontSize="lg" mb={4}>
          Delete Account
        </Text>
        <Input
          placeholder="Enter user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          mb={4}
        />
        <Button colorScheme="red" width="full" onClick={onOpen}>
          Delete Account
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Account Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete the account with ID: {userId}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                handleDelete();
                onOpen();
              }}
            >
              Confirm Deletion
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <PasskeyModal /> */}
    </Box>
  );
};

export default DeleteAccountPage;
