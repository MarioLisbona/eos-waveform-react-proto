import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
} from "@chakra-ui/react";
import { PeaksInstance } from "peaks.js";

export default function InvalidTopTailEndTimeModal({
  isOpen,
  onClose,
  myPeaks,
}: {
  isOpen: boolean;
  onClose: () => void;
  myPeaks: PeaksInstance;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invalid Top and Tail End time</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textStyle={"smContext"}>
            {`Clip End time cannot be before Start Time. Please choose a Top and
            Tail End time after ${myPeaks.player.getCurrentTime().toFixed(1)}`}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button variant={"brandPrimaryMobileNav"} mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
