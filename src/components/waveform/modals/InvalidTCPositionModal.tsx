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

export default function InvalidTCPositionModal({
  isOpen,
  onClose,
  clipOverlap,
  myPeaks,
}: {
  isOpen: boolean;
  onClose: () => void;
  clipOverlap: boolean;
  myPeaks: PeaksInstance;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unable to Add Segment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textStyle={"smContext"}></Text>
          {clipOverlap
            ? `There is not enough room for your clip. Please choose a gap larger than ${(
                myPeaks.player.getDuration()! * 0.03
              ).toFixed(1)} seconds`
            : "A clip already exists at that position, clips cannot overlap. Please choose an empty gap on the timeline"}
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
