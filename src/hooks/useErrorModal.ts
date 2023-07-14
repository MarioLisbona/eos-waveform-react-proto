import { useDisclosure } from "@chakra-ui/react";

export const useErrorModal = () => {
  const {
    isOpen: isInvalidTCPModalOpen,
    onClose: onInvalidTCPModalClose,
    onOpen: onInvalidTCPModalOpen,
  } = useDisclosure();

  const {
    isOpen: isInvalidTopTailModalOpen,
    onClose: onInvalidTopTailModalClose,
    onOpen: onInvalidTopTailModalOpen,
  } = useDisclosure();

  return {
    isInvalidTCPModalOpen,
    onInvalidTCPModalClose,
    onInvalidTCPModalOpen,
    isInvalidTopTailModalOpen,
    onInvalidTopTailModalClose,
    onInvalidTopTailModalOpen,
  };
};
