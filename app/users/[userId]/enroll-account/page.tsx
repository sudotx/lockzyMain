"use client";

import {
  changeDoorStatus,
  EnrollFingerprintId,
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

const EnrollAccountPage = () => {
  const [userId, setUserId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const changeMode = async () => {
    try {
      toast({
        title: "set to enroll mode.",
        status: "success",
        duration: 1000,
      });
      changeDoorStatus(0, 0);
    } catch (error) {}
  };

  const handleEnroll = async () => {
    try {
      toast({
        title: `ID ${userId} has been enrolled.`,
        status: "success",
        duration: 1000,
      });

      router.push("dashboard");

      // Close the modal
      onClose();
      //   getAndDecrementFingerprintId(userId); // decrement fingerprint ID
      const iid = parseInt(userId);
      EnrollFingerprintId(iid);
    } catch (error) {
      console.error("An error occurred during the enroll process:", error);
      toast({
        title: "An error occurred while enrolling the account.",
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
          Enroll Account
        </Text>
        <Input
          placeholder="Enter an ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          mb={4}
        />
        <Button
          colorScheme="green"
          width="full"
          onClick={() => {
            onOpen();
            // changeMode();
            handleEnroll();
          }}
        >
          Enroll Account
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Account Enroll</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to enroll the account with ID: {userId}?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                // handleEnroll();
                changeMode();
                onOpen();
              }}
            >
              Confirm Enroll
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <PasskeyModal /> */}
    </Box>
  );
};

export default EnrollAccountPage;
