"use client";

import {
  changeDoorStatus,
  enrollFingerprintId,
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
  const [confirming, setConfirming] = useState(false); // Track if the user confirmed enrollment
  const router = useRouter();
  const toast = useToast();

  const changeMode = async () => {
    try {
      await changeDoorStatus(0, 0);
      toast({
        title: "Door set to enroll mode.",
        status: "success",
        duration: 1000,
      });
      router.push("dashboard");
    } catch (error) {
      console.error("Error changing door mode:", error);
      toast({
        title: "Error setting door mode.",
        description: "There was an issue changing the door mode.",
        status: "error",
        duration: 1000,
      });
    }
  };

  const handleEnroll = async (val: number) => {
    try {
      await enrollFingerprintId(val);
      toast({
        title: `ID ${userId} has been enrolled.`,
        status: "success",
        duration: 1000,
      });

      // Call changeMode after enrollment
      setTimeout(() => {
        changeMode();
      }, 1000);
    } catch (error) {
      console.error("An error occurred during the enroll process:", error);
      toast({
        title: "Error enrolling the account.",
        description: "There was an issue enrolling the account.",
        status: "error",
        duration: 1000,
      });
    }
  };

  const handleConfirmEnroll = () => {
    toast({
      title: "Enrollment process started.",
      description: "Please wait while we process the enrollment.",
      status: "info",
      duration: 1000,
    });
    const idx = parseInt(userId);
    handleEnroll(idx);
    setConfirming(false);
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
            setConfirming(true);
            onOpen();
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
            <Button colorScheme="green" onClick={handleConfirmEnroll}>
              Confirm Enroll
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EnrollAccountPage;
