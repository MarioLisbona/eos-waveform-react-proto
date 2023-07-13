import { useState, useCallback } from "react";
import Peaks, { PeaksInstance, PeaksOptions } from "peaks.js";
import { AudioDataProps } from "../types";
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
  const data: AudioDataProps = {
    //------> use testSegmentsSmall data set to set segment state
    audioUrl: "instrumental.mp3",
    audioContentType: "audio/mpeg",
    waveformDataUrl: "instrumental.dat",
  };
  // state for peaks instance
  const [myPeaks, setMyPeaks] = useState<PeaksInstance | undefined>();

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

  return { initPeaks, myPeaks };
};
