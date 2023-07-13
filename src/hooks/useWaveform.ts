import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { TestSegmentProps } from "../types";
import { testSegmentsSmall } from "../data/segmentData";

import { createTopTail } from "../lib/waveform-utils";

export const useWaveform = () => {
  const [segments, setSegments] =
    useState<TestSegmentProps[]>(testSegmentsSmall);

  return "hi";
};
