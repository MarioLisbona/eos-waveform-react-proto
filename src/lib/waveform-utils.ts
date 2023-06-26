import { PeaksInstance, SegmentDragEvent } from "peaks.js";
import WaveformViewClickEvent from "peaks.js";
import { TestSegmentProps } from "../types";
import { ChangeEvent, MouseEvent } from "react";
import {
  createNewSegmentObject,
  findGap,
  insertNewSegment,
} from "./general-utils";

//////////////////////////////////////////////////////////////////////
//
//
//              Playhead seeks to the stat time of the clip
//              when a clip element is clicked in the list
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
//             Edit segment start and end points
//
//             Handles a clip start or end point being dragged
//             to a new position on the zoomview window
//
//
export const editClipStartEndPoints = (
  evt: SegmentDragEvent,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  const newSegState = segments.map((seg) => {
    if (seg.id === evt.segment.id && evt.startMarker) {
      console.log("moved start marker");
      return {
        ...seg,
        startTime: evt.segment.startTime,
      };
    } else if (seg.id === evt.segment.id && !evt.startMarker) {
      console.log("moved end marker");
      return {
        ...seg,
        endTime: evt.segment.endTime,
      };
    }
    // otherwise return the segment unchanged
    return seg;
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
  myPeaks: PeaksInstance
) => {
  const firstClip = segments.length === 0;
  const secondClip = segments.length === 1;
  const mediaLength = myPeaks.player.getDuration()!;

  if (firstClip) {
    const newSegment = createNewSegmentObject(
      segments,
      firstClip,
      secondClip,
      mediaLength,
      undefined,
      undefined
    );
    console.log("no clips - creating first clip", { newSegment });
    //update the segments state
    setSegments([newSegment]);

    //move the playhead to the start of the new segment
    myPeaks.player.seek(newSegment.startTime);
  } else if (secondClip) {
    const newSegment = createNewSegmentObject(
      segments,
      firstClip,
      secondClip,
      mediaLength,
      undefined,
      undefined
    );
    console.log("1 clip - creating second clip", { newSegment });
    //update the segments state
    setSegments([...segments, newSegment]);

    //move the playhead to the start of the new segment
    myPeaks.player.seek(newSegment.startTime);
  } else {
    //find a gap greater or equal to 10 seconds between existing clip segments
    const tenSecondGapIdx = findGap(segments, 10);

    if (tenSecondGapIdx != -1) {
      //create a new 8 second segment between 2 segments with a large enough gap
      const newSegment = createNewSegmentObject(
        segments,
        firstClip,
        secondClip,
        mediaLength,
        tenSecondGapIdx,
        8
      );

      //slice the new segment into the existing segments array at the correct index
      const updatedSegments = insertNewSegment(
        segments,
        tenSecondGapIdx,
        newSegment
      );

      //update the segments state
      setSegments(updatedSegments);

      //move the playhead to the start of the new segment
      myPeaks.player.seek(newSegment.startTime);
    } else if (tenSecondGapIdx == -1) {
      alert("No 10 second gaps, finding a 5 second gap...");

      //find a gap greater or equal to 5 seconds between existing clip segments
      const fiveSecondGapIdx = findGap(segments, 5);

      if (fiveSecondGapIdx != -1) {
        //create a new 4 second segment between 2 segments with a large enough gap
        const newSegment = createNewSegmentObject(
          segments,
          firstClip,
          secondClip,
          mediaLength,
          fiveSecondGapIdx,
          4
        );

        //slice the new segment into the existing segments array at the correct index
        const updatedSegments = insertNewSegment(
          segments,
          fiveSecondGapIdx,
          newSegment
        );

        //update the segments state
        setSegments(updatedSegments);

        //move the playhead to the start of the new segment
        myPeaks.player.seek(newSegment.startTime);
      } else if (fiveSecondGapIdx == -1) {
        alert(
          "There are no gaps available for a new clip. You will need to delete one"
        );
      }
    }
  }
};
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
//
//             Create new segment on double click
//
//             Handles a adding a new segment when the zoomview window
//             is double clicked. A new 8 second clip will be created
//             where the user has double clicked. The double click location
//             will be the center point of the new 8 second segment
//
//
export const clickToAddSegment = (
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>,
  myPeaks: PeaksInstance,
  evt: WaveformViewClickEvent
) => {
  //create playhead and upper and lower boundaries based on playhead position
  const playheadPosition = evt.time;
  const segUpperBound = playheadPosition + 8;
  const segLowerBound = playheadPosition;
  const mediaEndTime = myPeaks.player.getDuration();

  //asses whether the upper and lower boundaries of the playhead fit in the gap between clips
  //clip idx is returned
  const gapIdx = segments.findIndex((seg, idx, arr) => {
    if (idx === 0) {
      return playheadPosition > 0 && segUpperBound < arr[idx].startTime;
    }
    if (idx === arr.length - 1) {
      return (
        playheadPosition > arr[idx].endTime && segUpperBound < mediaEndTime
      );
    }
    if (idx + 1 < arr.length) {
      return (
        arr[idx + 1].startTime > segUpperBound &&
        arr[idx].endTime < segLowerBound
      );
    }
  });

  //if the return value is not -1 a gap has been found
  //create a new segment
  if (gapIdx != -1) {
    const newSegment = {
      id: segments.length.toString(),
      fileName: `clip-${parseInt(segments.length.toString()) + 1}`,
      startTime: playheadPosition,
      endTime: playheadPosition + 8,
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
    //slice the new segment into the existing segments array at the correct index
    const updatedSegments = insertNewSegment(segments, gapIdx, newSegment);

    //update the segments
    setSegments(updatedSegments);

    //move the playhead to the start of the new segment
    myPeaks.player.seek(newSegment.startTime);
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
          fileNameError: evt.target.value == "" ? true : false,
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
//             handles start time error checking
//
//             start time needs to be greater than previous segments end time
//
//             !!This needs some more work!!
//
//
export const handleStartTimeChange = (
  id: string,
  evt: ChangeEvent<HTMLInputElement>,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>
) => {
  //used for two way bind of start time input element to correct segment in segments
  const newSegState = segments.map((seg) => {
    if (seg.id === id) {
      return {
        ...seg,
        startTime:
          parseInt(evt.target.value) < seg.endTime!
            ? parseInt(evt.target.value)
            : 0,
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
//             handles end time error checking
//
//             end time needs to be less than next segments start time
//
//             !!This needs some more work!!
//
//
export const handleEndTimeChange = (
  id: string,
  evt: ChangeEvent<HTMLInputElement>,
  segments: TestSegmentProps[],
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>,
  myPeaks: PeaksInstance
) => {
  //used for two way bind of end time input element to correct segment in segments
  const newSegState = segments.map((seg, idx: number) => {
    if (seg.id === id) {
      return {
        ...seg,
        endTime:
          parseInt(evt.target.value) > seg.startTime &&
          parseInt(evt.target.value) < segments[idx + 1].startTime
            ? parseInt(evt.target.value)
            : myPeaks.player.getDuration()!,
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

// console logs the segments after all edits
//set segments to empty array and destroy peaks instance to free resources
export const createAllSegments = (
  peaks: PeaksInstance | undefined,
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>,
  segments: TestSegmentProps[]
) => {
  console.log("Exporting clip data and destroying Peaks instance", segments);
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
  peaks: PeaksInstance | undefined,
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
    return seg.id != segmentToDelete!.id;
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
