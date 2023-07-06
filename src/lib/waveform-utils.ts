import { PeaksInstance, SegmentDragEvent } from "peaks.js";
import { TestSegmentProps } from "../types";
import { ChangeEvent } from "react";

//function to return true if the timecode is between the start and end of a clip
export const timecodeIsBetweenClip = (
  timecode: number,
  start: number,
  end: number
) => {
  return (timecode - start) * (timecode - end) <= 0;
};

//////////////////////////////////////////////////////////////////////
//
//
//              Create Top and Tail on empty timeline
//
//
export const createTopTail = (
  playheadPosition: number,
  mediaLength: number,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
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
      startTimeError: false,
      endTimeError: false,
      isCreated: false,
    },
  };

  if (segments.length === 0) {
    topTailSegment.startTime = playheadPosition;
    setSegments([topTailSegment]);
  }

  if (segments.length === 1 && playheadPosition > segments[0].startTime) {
    const updatedSegment = segments.map((seg) => {
      return {
        ...seg,
        endTime:
          playheadPosition < seg.startTime + 0.05
            ? seg.endTime
            : playheadPosition,
      };
    });

    setSegments(updatedSegment);
  } else if (
    segments.length === 1 &&
    playheadPosition < segments[0].startTime
  ) {
    alert("end time needs to be greater than start time");
  }
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//
//              Playhead seeks to the stat time of the clip
//              or end of the clip depending on wheher the
//              sart time or end time are clicked
//
//
export const handlePlayheadSeek = (
  id: string | undefined,
  myPeaks: PeaksInstance,
  segments: TestSegmentProps[],
  seekStart?: boolean
) => {
  //find selected segment and move playhead to that segments start time
  const selectedSegment = segments.find((seg) => seg.id === id);
  seekStart
    ? myPeaks.player.seek(selectedSegment!.startTime)
    : myPeaks.player.seek(selectedSegment!.endTime);
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
export const editClipStartPoint = (
  evt: SegmentDragEvent,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
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

export const editClipEndPoint = (
  evt: SegmentDragEvent,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
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

//////////////////////////////////////////////////////////////////////
//
//             Add Segment Button
//
//             Handles a adding a new segment when the Add Segment
//             button is clicked. A search is implemented and a 8 second
//             clip is created where the first 10 second gap is found.
//             If there are no 10 second gaps, a 4 second clip is created
//             if a 5 second gap is found.
//
//
export const handleAddSegment = (
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>,
  myPeaks: PeaksInstance,
  onOpen: () => void,
  setClipOverlap: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const firstClip = segments.length === 0;
  const secondClip = segments.length === 1;
  const mediaLength = myPeaks.player.getDuration()!;
  const playheadPosition = myPeaks.player.getCurrentTime();
  const clipUpperBound = playheadPosition + mediaLength * 0.03;
  const timelineUpperBound = mediaLength - 1;

  //function to return true if the timecode is between the start and end of a clip
  const timecodeIsBetweenClip = (
    timecode: number,
    start: number,
    end: number
  ) => {
    return (timecode - start) * (timecode - end) <= 0;
  };

  //map over the segment and call playheadIsBetween
  //if any element is true, the playhead is between the start and end of an existing clip
  const invalidPlayheadPosition = segments
    .map((seg) => {
      return timecodeIsBetweenClip(
        playheadPosition,
        seg.startTime,
        seg.endTime
      );
    })
    .includes(true);

  // Check the gaps between segments[1] and segments[n-2] to see if they are
  //large enough to contain the new clip length
  // eslint-disable-next-line
  const validGapLength = segments.findIndex((seg, idx, arr) => {
    if (idx + 1 < arr.length) {
      return (
        arr[idx + 1].startTime > clipUpperBound &&
        arr[idx].endTime < playheadPosition
      );
    }
    // console.log("returning seg at end of findIndex", idx);
    // return seg; //---> returning seg here to resolving linting error breaks error checking
  });

  const startClipValidGapLength = () => {
    if (segments.length > 0) {
      return clipUpperBound < segments[0]?.startTime;
    }
  };

  const endClipValidGapLength = () => {
    if (segments.length > 0) {
      return (
        clipUpperBound < timelineUpperBound &&
        playheadPosition > segments[segments?.length - 1].startTime
      );
    }
  };

  //create first clip on empty timeline
  if (firstClip && clipUpperBound < timelineUpperBound) {
    const newSegment = {
      id: segments.length.toString(),
      fileName: `Segment-${parseInt(segments.length.toString()) + 1}`,
      startTime: playheadPosition,
      endTime: playheadPosition + mediaLength * 0.03,
      editable: true,
      color: "#1E1541",
      labelText: `Segment-${parseInt(segments.length.toString()) + 1}`,
      formErrors: {
        fileNameError: false,
        startTimeError: false,
        endTimeError: false,
        isCreated: false,
      },
    };
    //update the segments state
    setSegments([newSegment]);
    //move the playhead to the start of the new segment
    myPeaks.player.seek(newSegment.startTime);
  } else if (
    //create first clip on empty timeline
    secondClip &&
    clipUpperBound < timelineUpperBound &&
    !invalidPlayheadPosition &&
    !timecodeIsBetweenClip(
      clipUpperBound,
      segments[0].startTime,
      segments[0].endTime
    )
  ) {
    //Seconde Clip (Tail) being created only if playhead is not between start and end of existing clip
    //and playhead is not before first (Top) clip
    const newSegment = {
      id: segments.length.toString(),
      fileName: `Segment-${parseInt(segments.length.toString()) + 1}`,
      startTime: playheadPosition,
      endTime: playheadPosition + mediaLength * 0.03,
      editable: true,
      color: "#1E1541",
      labelText: `Segment-${parseInt(segments.length.toString()) + 1}`,
      formErrors: {
        fileNameError: false,
        startTimeError: false,
        endTimeError: false,
        isCreated: false,
      },
    };

    const updatedSegments = [...segments, newSegment];
    //update the segments state
    setSegments(updatedSegments.sort((a, b) => a.startTime - b.startTime));
    //move the playhead to the start of the new segment
    myPeaks.player.seek(newSegment.startTime);
  } else if (!invalidPlayheadPosition && validGapLength !== -1) {
    const newSegment = {
      id: segments.length.toString(),
      fileName: `Segment-${parseInt(segments.length.toString()) + 1}`,
      startTime: playheadPosition,
      endTime: playheadPosition + mediaLength * 0.03,
      editable: true,
      color: "#1E1541",
      labelText: `Segment-${parseInt(segments.length.toString()) + 1}`,
      formErrors: {
        fileNameError: false,
        startTimeError: false,
        endTimeError: false,
        isCreated: false,
      },
    };

    //add new segment to the segments array, sort it by start time and update segments state
    const updatedSegments = [...segments, newSegment];
    setSegments(updatedSegments.sort((a, b) => a.startTime - b.startTime));

    //move the playhead to the start of the new segment
    myPeaks.player.seek(newSegment.startTime);
  } else if (
    !invalidPlayheadPosition &&
    validGapLength === -1 &&
    (startClipValidGapLength() || endClipValidGapLength())
  ) {
    const newSegment = {
      id: segments.length.toString(),
      fileName: `Segment-${parseInt(segments.length.toString()) + 1}`,
      startTime: playheadPosition,
      endTime: playheadPosition + mediaLength * 0.03,
      editable: true,
      color: "#1E1541",
      labelText: `Segment-${parseInt(segments.length.toString()) + 1}`,
      formErrors: {
        fileNameError: false,
        startTimeError: false,
        endTimeError: false,
        isCreated: false,
      },
    };

    //add new segment to the segments array, sort it by start time and update segments state
    const updatedSegments = [...segments, newSegment];
    setSegments(updatedSegments.sort((a, b) => a.startTime - b.startTime));
  } else {
    invalidPlayheadPosition ? setClipOverlap(false) : setClipOverlap(true);
    onOpen();
  }
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             handles file name error checking
//
//             returns true if the clips filename is empty
//             this boolean is used by chakra-UI <FormControl>
//             to display an error message and red highlight the input field
//
//
export const handleFileNameChange = (
  id: string,
  evt: ChangeEvent<HTMLInputElement>,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  //used for two way bind of filename input element to correct segment in segments
  //also used to track the the error boolean for the file name input
  const newSegState = segments.map((seg) => {
    //if the current segment id matches the id passed from the segment then bind the new value entered to the segment object
    //assign the fileNameError to true if the file name input is empty
    if (seg.id === id) {
      return {
        ...seg,
        fileName: evt.target.value,
        labelText: evt.target.value,
        formErrors: {
          fileNameError: evt.target.value === "" ? true : false,
          startTimeError: false,
          endTimeError: false,
          isCreated: false,
        },
      };
    }
    //otherwise return the segment unchanged
    return seg;
  });
  //use the updated segment to update the segments state
  setSegments(newSegState);
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             Delete all segments
//
//
export const deleteAllSegments = (
  peaks: PeaksInstance,
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  peaks.segments.removeAll();
  setSegments([]);
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             Create all segments
//
//
// console logs the segments after all edits
//set segments to empty array and destroy peaks instance to free resources
export const createAllSegments = (
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>,
  segments: TestSegmentProps[],
  setAllClipsCreated: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const updatedSegments = segments.map((seg) => {
    return {
      ...seg,
      formErrors: {
        fileNameError: seg.formErrors.fileNameError,
        startTimeError: false,
        endTimeError: false,
        isCreated: true,
      },
      editable: false,
      color: "#384115",
    };
  });

  setSegments(updatedSegments);
  setAllClipsCreated(true);
  console.log(
    "Exporting clip data and destroying Peaks instance",
    updatedSegments
  );
  // setSegments([]);
  // peaks?.destroy();
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             Create a single segment
//
//
export const createSingleSegment = (
  id: string,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  const newSegState = segments.map((seg, idx: number) => {
    if (seg.id === id) {
      return {
        ...seg,
        formErrors: {
          fileNameError: seg.formErrors.fileNameError,
          startTimeError: false,
          endTimeError: false,
          isCreated: seg.formErrors.isCreated ? false : true,
        },
        editable: seg.editable ? false : true,
        color: seg.color === "#1E1541" ? "#384115" : "#1E1541",
      };
    }
    //otherwise return the segment unchanged
    return seg;
  });

  //logging the clip
  console.log("Clip Created - ", newSegState);
  //use the updated segment to update the segments state
  setSegments(newSegState);
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             Delete a single segment
//
//
export const deleteSingleSegment = (
  id: string,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  //search for the segment to delete based on id passed into function
  const segmentToDelete = segments.find((seg) => {
    return seg.id === id;
  });

  //filter segments to create a new array with all segments that dont match id
  const upatedSegments = segments.filter((seg) => {
    return seg.id !== segmentToDelete!.id;
  });

  //update the date of segments with the new array
  setSegments(upatedSegments);
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//
//
//

//////////////////////////////////////////////////////////////////////
//
//             handles start time error checking
//
//             start time needs to be greater than previous segments end time
//
//             !!This needs some more work!!
//
//
// export const handleStartTimeChange = (
//   id: string,
//   evt: ChangeEvent<HTMLInputElement>,
//   segments: TestSegmentProps[],
//   setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
// ) => {
//   //used for two way bind of start time input element to correct segment in segments
//   const newSegState = segments.map((seg) => {
//     if (seg.id === id) {
//       return {
//         ...seg,
//         startTime:
//           parseInt(evt.target.value) < seg.endTime!
//             ? parseInt(evt.target.value)
//             : 0,
//       };
//     }
//     //otherwise return the segment unchanged
//     return seg;
//   });
//   //use the updated segment to update the segments state
//   setSegments(newSegState);
// };
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             handles end time error checking
//
//             end time needs to be less than next segments start time
//
//             !!This needs some more work!!
//
//
// export const handleEndTimeChange = (
//   id: string,
//   evt: ChangeEvent<HTMLInputElement>,
//   segments: TestSegmentProps[],
//   setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>,
//   myPeaks: PeaksInstance
// ) => {
//   //used for two way bind of end time input element to correct segment in segments
//   const newSegState = segments.map((seg, idx: number) => {
//     if (seg.id === id) {
//       return {
//         ...seg,
//         endTime:
//           parseInt(evt.target.value) > seg.startTime &&
//           parseInt(evt.target.value) < segments[idx + 1].startTime
//             ? parseInt(evt.target.value)
//             : myPeaks.player.getDuration()!,
//       };
//     }

//     //otherwise return the segment unchanged
//     return seg;
//   });
//   //use the updated segment to update the segments state
//   setSegments(newSegState);
// };
//////////////////////////////////////////////////////////////////////
