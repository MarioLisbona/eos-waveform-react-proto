import { PeaksInstance } from "peaks.js";
import { TestSegmentProps } from "../types";

//////////////////////////////////////////////////////////////////////
//
//
//              Create a generic top and tail segment covering
//              90 % of the media duration
//
//
export const createGenericTopTail = (
  myPeaks: PeaksInstance,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  const mediaLength = myPeaks.player.getDuration();
  const playheadPosition = myPeaks.player.getCurrentTime();
  const topTailSegment = {
    id: "Top-n-Tail-Segment",
    fileName: "Top-n-Tail-Segment",
    startTime: playheadPosition,
    endTime: mediaLength * 0.95,
    editable: true,
    color: "#1E1541",
    labelText: "Top-n-Tail-Segment",
    formErrors: {
      fileNameError: false,
      isCreated: false,
    },
  };

  setSegments([topTailSegment]);
};
