import { useDisclosure } from "@chakra-ui/react";

export const useInvalidTTClipModal = () => {
  const {
    isOpen: isInvalidTopTailModalOpen,
    onClose: onInvalidTopTailModalClose,
    onOpen: onInvalidTopTailModalOpen,
  } = useDisclosure();
  return {
    isInvalidTopTailModalOpen,
    onInvalidTopTailModalClose,
    onInvalidTopTailModalOpen,
  };
};
