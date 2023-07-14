import { useDisclosure } from "@chakra-ui/react";

export const useInvalidTCPModal = () => {
  const {
    isOpen: isInvalidTCPModalOpen,
    onClose: onInvalidTCPModalClose,
    onOpen: onInvalidTCPModalOpen,
  } = useDisclosure();
  return {
    isInvalidTCPModalOpen,
    onInvalidTCPModalClose,
    onInvalidTCPModalOpen,
  };
};
