import { SegmentDragEvent } from "peaks.js";
import { TestSegmentProps } from "../types";
import { editClipStartPoint, editClipEndPoint } from "../lib/waveform-utils";

export const useWaveFormEvents = (evt: SegmentDragEvent) => {
  const handleClipDragEnd = (
    segments: TestSegmentProps[],
    setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
  ) => {
    evt.startMarker
      ? editClipStartPoint(evt, segments, setSegments)
      : editClipEndPoint(evt, segments, setSegments);
  };
  return { handleClipDragEnd };
};
