import { Flex, Button, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { OverviewContainer, ZoomviewContainer } from "./styled";
import Peaks, {
  PeaksInstance,
  PeaksOptions,
  SegmentDragEvent,
  WaveformViewMouseEvent,
} from "peaks.js";
import {
  setPeaksConfig,
  overviewOptionsConfig,
  zoomviewOptionsConfig,
} from "../../lib/waveform-config";
import ClipGrid from "./components/ClipGrid";
//testSegments, testSegmentsSmall alternate on use depending on dataset being used
// eslint-disable-next-line
import { testSegments, testSegmentsSmall } from "../../data/segmentData";
import { AudioDataProps, TestSegmentProps } from "../../types";
import {
  deleteAllSegments,
  createAllSegments,
  handleAddSegment,
  editClipStartPoint,
  editClipEndPoint,
  createTopTail,
} from "../../lib/waveform-utils";
import ClipGridHeader from "./components/ClipGridHeader";
import InvalidTCPositionModal from "./modals/InvalidTCPositionModal";
import InvalidTopTailEndTimeModal from "./modals/InvalidTopTailEndTimeModal";

export default function WaveForm() {
  //booleans to open modal for invalid playhead positions when adding segments
  const {
    isOpen: isInvalidTCPModalOpen,
    onClose: onInvalidTCPModalClose,
    onOpen: onInvalidTCPModalOpen,
  } = useDisclosure();

  //booleans to open modal for invalid playhead position for adding endtime to Top and Tail clip
  const {
    isOpen: isInvalidTopTailModalOpen,
    onClose: onInvalidTopTailModalClose,
    onOpen: onInvalidTopTailModalOpen,
  } = useDisclosure();

  //////////////////////////////////////////////////////////////////////
  //
  //
  //              Two audio files for testing
  //
  //
  // const data: AudioDataProps = {
  //   //------> use testSegments data to set segment state
  //   audioUrl: "EOS-test.mp3",
  //   audioContentType: "audio/mpeg",
  //   waveformDataUrl: "EOS-test.dat",
  // };
  const data: AudioDataProps = {
    //------> use testSegmentsSmall data set to set segment state
    audioUrl: "instrumental.mp3",
    audioContentType: "audio/mpeg",
    waveformDataUrl: "instrumental.dat",
  };
  //////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////
  //
  //
  //               Initialising peaks
  //
  //
  //create references to peaks.js containers
  const zoomviewWaveformRef = React.createRef<HTMLDivElement>();
  const overviewWaveformRef = React.createRef<HTMLDivElement>();
  const audioElementRef = React.createRef<HTMLAudioElement>();

  // state for peaks instance
  const [myPeaks, setMyPeaks] = useState<PeaksInstance | undefined>();
  const [segments, setSegments] =
    useState<TestSegmentProps[]>(testSegmentsSmall);

  //boolean state used for conditional modal message for invalid position to create clip
  const [clipOverlap, setClipOverlap] = useState<boolean>(false);
  //boolean state used to disable Create All button if an empty file name is present
  const [invalidFilenamePresent, setInvalidFilenamePresent] =
    useState<boolean>(true);

  // create function to create instance of peaks
  // useCallback means this will only render a single instance of peaks
  const initPeaks = useCallback(() => {
    //setting options here by invoking setPeaksConfig()
    const options: PeaksOptions = setPeaksConfig(
      overviewWaveformRef,
      zoomviewWaveformRef,
      audioElementRef,
      overviewOptionsConfig,
      zoomviewOptionsConfig,
      data.waveformDataUrl
    );

    //assigning the source for the audio element
    audioElementRef.current!.src = data.audioUrl;

    //If there is an existing peaks instance,
    //call destroy method and set undefined for myPeaks
    if (myPeaks) {
      myPeaks.destroy();
      setMyPeaks(undefined);
    }

    //create an instance of peaks
    Peaks.init(options, (err, peaks) => {
      if (err) {
        console.error("Failed to initialize Peaks instance: " + err.message);
        return;
      }

      //set instance of peaks to myPeaks state
      setMyPeaks(peaks);

      //set the amplitude scale for the zoomview  and overview container
      const zoomview = peaks?.views.getView("zoomview");
      const overview = peaks?.views.getView("overview");
      zoomview?.setAmplitudeScale(0.8);
      overview?.setAmplitudeScale(0.5);

      //if there is no instance of peaks, return
      if (!peaks) {
        return;
      }
    });
    // eslint-disable-next-line
  }, []);

  //call initPeaks on initial mount of WaveForm component
  useEffect(() => {
    if (initPeaks) {
      initPeaks();
    }
  }, [initPeaks]);
  //////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////
  //
  //
  //         functions used for peaks instance.on events
  //
  //
  //sets the new start time for a segment if the start point is dragged
  //sets the new end time for a segment if the end point is dragged
  // eslint-disable-next-line
  const handleClipDragEnd = (evt: SegmentDragEvent) => {
    evt.startMarker
      ? editClipStartPoint(evt, segments, setSegments)
      : editClipEndPoint(evt, segments, setSegments);
  };

  //Adds a new segment to the zoomview on double clicked
  // eslint-disable-next-line
  const handleZoomviewDblClick = () => {
    segments.length >= 1 &&
      handleAddSegment(
        segments,
        setSegments,
        myPeaks!,
        onInvalidTCPModalOpen,
        setClipOverlap
      );
  };

  // eslint-disable-next-line
  const handleOverviewClick = (evt: WaveformViewMouseEvent) => {
    //This conditional disables the single click the top and tail clip is created but
    //will still allow it to be called one more time to create an updated ent time
    //This means the double click to create clip can be placed anywhere on the overview timeline
    //after first clip is created
    if (
      segments.length < 1 ||
      myPeaks?.player.getDuration()! === segments[0].endTime
    ) {
      createTopTail(
        evt.time,
        myPeaks?.player.getDuration()!,
        segments,
        setSegments,
        onInvalidTopTailModalOpen
      );
    }
  };
  //////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////
  //
  //
  //         useEffect to handle updates to peaks and segments states
  //
  //
  useEffect(() => {
    // //sort the data in chronological order by startTime
    segments.sort((a, b) => a.startTime - b.startTime);

    //searches segments array and returns true if any filename field is empty
    //update state for invalidFilenamePresent
    const invalidFilenamePresent =
      segments.find((segments) => segments.fileName === "") !== undefined;
    setInvalidFilenamePresent(invalidFilenamePresent);

    //remove all peaks segments then add with new segments state to avoids duplicates
    myPeaks?.segments.removeAll();
    myPeaks?.segments.add(segments);
  }, [myPeaks, segments]);

  useEffect(() => {
    //event handlers
    myPeaks?.on("segments.dragend", handleClipDragEnd);
    myPeaks?.on("zoomview.dblclick", handleZoomviewDblClick);
    myPeaks?.on("overview.dblclick", handleZoomviewDblClick);
    myPeaks?.on("overview.click", handleOverviewClick);

    return () => {
      //cleanup
      myPeaks?.off("segments.dragend", handleClipDragEnd);
      myPeaks?.off("zoomview.dblclick", handleZoomviewDblClick);
      myPeaks?.off("overview.dblclick", handleZoomviewDblClick);
      myPeaks?.off("overview.click", handleOverviewClick);
    };
  }, [myPeaks, handleClipDragEnd, handleZoomviewDblClick, handleOverviewClick]);

  return (
    <>
      {/* Moodal to display when clip creation location is invalid */}
      <InvalidTCPositionModal
        isOpen={isInvalidTCPModalOpen}
        onClose={onInvalidTCPModalClose}
        clipOverlap={clipOverlap}
        myPeaks={myPeaks!}
      />
      {/* Moodal to display when Top and Tail end time is set before start time */}
      <InvalidTopTailEndTimeModal
        isOpen={isInvalidTopTailModalOpen}
        onClose={onInvalidTopTailModalClose}
        myPeaks={myPeaks!}
      />
      <Flex
        justify={"center"}
        align={"center"}
        width={"100%"}
        direction={"column"}
        p={"1rem"}
      >
        <ZoomviewContainer ref={zoomviewWaveformRef}></ZoomviewContainer>
        <OverviewContainer ref={overviewWaveformRef}></OverviewContainer>
        <audio ref={audioElementRef} hidden>
          <source src={data.audioUrl} type={data.audioContentType} />
          Your browser does not support the audio element.
        </audio>
      </Flex>
      <Flex mb={"1rem"} px={"3rem"} w={"100%"} justify={"space-between"}>
        <Flex>
          <Button variant={"waveformBlue"} me={"1rem"}>
            Add Top-n-Tail
          </Button>
          <Button
            variant={"waveformBlue"}
            onClick={() =>
              handleAddSegment(
                segments,
                setSegments,
                myPeaks!,
                onInvalidTCPModalOpen,
                setClipOverlap
              )
            }
          >
            Add Segment
          </Button>
        </Flex>
        <Flex>
          <Button
            isDisabled={invalidFilenamePresent || segments.length < 1}
            variant={"waveformBlue"}
            me={"1rem"}
            onClick={() => createAllSegments(setSegments, segments)}
          >
            Create All
          </Button>
          <Button
            isDisabled={segments.length < 1}
            variant={"waveformBlue"}
            onClick={() => deleteAllSegments(myPeaks!, setSegments)}
          >
            Delete All
          </Button>
        </Flex>
      </Flex>
      {segments.length !== 0 ? <ClipGridHeader /> : "There are no clips loaded"}
      {segments.length > 0 && (
        <ClipGrid
          segments={segments}
          setSegments={setSegments}
          myPeaks={myPeaks!}
        />
      )}
    </>
  );
}
