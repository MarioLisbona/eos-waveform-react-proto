import { TestSegmentProps } from "../types";

//////////////////////////////////////////////////////////////////////
//
//             find a gap in the segments of a specific duration
//
//
export const findGap = (segments: TestSegmentProps[], gapDuration: number) => {
  return segments.findIndex((seg, idx, arr) => {
    if (idx + 1 < arr.length) {
      return arr[idx + 1].startTime - arr[idx].endTime! >= gapDuration;
    }
  });
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             Create a new segment 8 seconds long at a predetermined
//             location on the time line - uses the gapIdx returned from
//             the search for 10 / 5 second gap search and segment length
//
export const createNewSegmentObject = (
  segments: TestSegmentProps[],
  firstClip: boolean,
  secondClip: boolean,
  mediaLength: number,
  gapIdx?: number,
  clipLength?: number
) => {
  if (firstClip) {
    return {
      id: segments.length.toString(),
      fileName: `clip-${parseInt(segments.length.toString()) + 1}`,
      startTime: 0,
      endTime: mediaLength * 0.03,
      editable: true,
      color: "#1E1541",
      labelText: `clip-${parseInt(segments.length.toString()) + 1}`,
      formErrors: {
        fileNameError: false,
        startTimeError: false,
        endTimeError: false,
        isCreated: false,
      },
    };
  } else if (secondClip) {
    return {
      id: segments.length.toString(),
      fileName: `clip-${parseInt(segments.length.toString()) + 1}`,
      startTime: mediaLength * 0.97,
      endTime: mediaLength,
      editable: true,
      color: "#1E1541",
      labelText: `clip-${parseInt(segments.length.toString()) + 1}`,
      formErrors: {
        fileNameError: false,
        startTimeError: false,
        endTimeError: false,
        isCreated: false,
      },
    };
  } else {
    return {
      id: segments.length.toString(),
      fileName: `clip-${parseInt(segments.length.toString()) + 1}`,
      startTime: segments[gapIdx!].endTime + 0.5,
      endTime: segments[gapIdx!].endTime! + clipLength! + 0.5,
      editable: true,
      color: "#1E1541",
      labelText: `clip-${parseInt(segments.length.toString()) + 1}`,
      formErrors: {
        fileNameError: false,
        startTimeError: false,
        endTimeError: false,
        isCreated: false,
      },
    };
  }
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             slice new segment into correct index of segments
//
export const insertNewSegment = (
  segments: TestSegmentProps[],
  gapIdx: number,
  newSegment: TestSegmentProps
) => {
  return [
    ...segments.slice(0, gapIdx + 1),
    newSegment,
    ...segments.slice(gapIdx + 1),
  ];
};
//////////////////////////////////////////////////////////////////////
