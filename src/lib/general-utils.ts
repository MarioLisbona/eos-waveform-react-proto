import { TestSegmentProps } from "../types";

export const createNewSegment = (
  segments: TestSegmentProps[],
  playheadPosition: number,
  mediaLength: number
) => {
  return {
    id: segments.length.toString(),
    fileName: `Segment-${parseInt(segments.length.toString()) + 1}`,
    startTime: playheadPosition,
    endTime: playheadPosition + mediaLength * 0.03,
    editable: true,
    color: "#1E1541",
    labelText: `Segment-${parseInt(segments.length.toString()) + 1}`,
    formErrors: {
      fileNameError: false,
      isCreated: false,
    },
  };
};
