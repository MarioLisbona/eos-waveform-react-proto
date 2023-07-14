import React from "react";
import { TestSegmentProps } from "../types";
import { PeaksInstance, SegmentDragEvent } from "peaks.js";

export const useWaveform = (
  myPeaks: PeaksInstance,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  //////////////////////////////////////////////////////////////////////
  //
  //
  //              Create Top and Tail clip on empty timeline
  //
  //
  const createTopTail = (
    mediaLength: number,
    onInvalidTopTailModalOpen: () => void
  ) => {
    const playheadPosition = myPeaks.player.getDuration();
    const topTailSegment = {
      id: "Top-n-Tail-Segment",
      fileName: "Top-n-Tail-Segment",
      startTime: 0,
      endTime: mediaLength,
      editable: true,
      color: "#1E1541",
      labelText: "Top-n-Tail-Segment",
      formErrors: {
        fileNameError: false,
        isCreated: false,
      },
    };

    //segments array is empty, first click becomes the start time
    if (segments.length === 0) {
      topTailSegment.startTime = playheadPosition;
      setSegments([topTailSegment]);
    }

    //segments array contains Top and Tail clip and playhead is at a valid position
    if (segments.length === 1 && playheadPosition > segments[0].startTime) {
      //set the end time for the Top and Tail clip
      //must be greater than 0.05 after start time
      const updatedSegment = segments.map((seg) => {
        return {
          ...seg,
          endTime:
            playheadPosition < seg.startTime + 0.05
              ? seg.endTime
              : playheadPosition,
        };
      });
      //update the segments state
      setSegments(updatedSegment);

      //playhead for end time is before start time, open modal
    } else if (
      segments.length === 1 &&
      playheadPosition < segments[0].startTime
    ) {
      onInvalidTopTailModalOpen();
    }
  };
  //////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////
  //
  //             Edit segment start points
  //
  //             Handles a clip start point being dragged
  //             to a new position on the zoomview window
  //
  //
  const editClipStartPoint = (evt: SegmentDragEvent) => {
    //id for the current clip being edited
    const segmentId = evt.segment.id;

    const newSegState = segments.map((segment, idx, arr) => {
      if (segment.id === segmentId) {
        //error checking for Top clip else all other clips
        if (idx === 0) {
          return {
            ...segment,
            startTime:
              evt.segment.startTime > segment.endTime - 0.05
                ? segment.startTime
                : evt.segment.startTime,
          };
        } else {
          return {
            ...segment,
            startTime:
              evt.segment.startTime < arr[idx - 1].endTime ||
              evt.segment.startTime > segment.endTime - 0.05
                ? segment.startTime
                : evt.segment.startTime,
          };
        }
      }
      // otherwise return the segment unchanged
      return segment;
    });
    //use the updated segment to update the segments state
    setSegments(newSegState);
  };
  //////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////
  //
  //             Edit segment end points
  //
  //             Handles a clip end point being dragged
  //             to a new position on the zoomview window
  //
  //

  const editClipEndPoint = (evt: SegmentDragEvent) => {
    //id for the current clip being edited
    const segmentId = evt.segment.id;

    const newSegState = segments.map((segment, idx, arr) => {
      if (segment.id === segmentId) {
        //error checking for Tail clip else all other clips
        if (idx === segments.length - 1) {
          return {
            ...segment,
            endTime:
              evt.segment.endTime < segment.startTime + 0.05
                ? segment.endTime
                : evt.segment.endTime,
          };
        } else {
          return {
            ...segment,
            endTime:
              evt.segment.endTime > arr[idx + 1].startTime ||
              evt.segment.endTime < segment.startTime + 0.05
                ? segment.endTime
                : evt.segment.endTime,
          };
        }
      }
      // otherwise return the segment unchanged
      return segment;
    });
    //use the updated segment to update the segments state
    setSegments(newSegState);
  };
  //////////////////////////////////////////////////////////////////////

  return { createTopTail, editClipStartPoint, editClipEndPoint };
};
