import { useState, useCallback, useEffect } from "react";
import Peaks, { PeaksInstance, PeaksOptions } from "peaks.js";
import { AudioDataProps, TestSegmentProps } from "../types";
import { audioData, testSegmentsSmall } from "../data/segmentData";
import {
  setPeaksConfig,
  overviewOptionsConfig,
  zoomviewOptionsConfig,
} from "../lib/waveform-config";

export const usePeaksInstance = (
  zoomviewWaveformRef: React.RefObject<HTMLDivElement>,
  overviewWaveformRef: React.RefObject<HTMLDivElement>,
  audioElementRef: React.RefObject<HTMLAudioElement>
) => {
  // state for peaks instance
  const [myPeaks, setMyPeaks] = useState<PeaksInstance | undefined>();
  //segments state
  const [segments, setSegments] =
    useState<TestSegmentProps[]>(testSegmentsSmall);
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
      audioData.waveformDataUrl
    );

    //assigning the source for the audio element
    audioElementRef.current!.src = audioData.audioUrl;

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

  return {
    myPeaks,
    segments,
    setSegments,
    invalidFilenamePresent,
  };
};
