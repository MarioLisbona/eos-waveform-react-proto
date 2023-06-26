import {
  OverviewOptionsConfigProps,
  ZoomviewOptionsConfigProps,
} from "../types";

export const zoomviewOptionsConfig = (
  zoomviewWaveformRef: React.RefObject<HTMLDivElement>
) => {
  return {
    container: zoomviewWaveformRef.current,

    // Color for the zoomable waveform
    // You can also use a 2 stop gradient here. See setWaveformColor()
    waveformColor: "#BEBBBB",

    // Color for the played region of the zoomable waveform
    // You can also use a 2 stop gradient here. See setWaveformColor()
    playedWaveformColor: "#BEBBBB",

    // Color of the playhead
    playheadColor: "#0085FF",

    // Color of the playhead text
    playheadTextColor: "#0085FF",

    // Tolerance for clicks in the zoomview to be interpreted as
    // dragging the playhead (pixels)
    playheadClickTolerance: 3,

    // Returns a string for the playhead timestamp label
    // formatPlayheadTime: function,

    // Show current time next to the playhead
    showPlayheadTime: true,

    // Precision of time label of playhead and point/segment markers
    timeLabelPrecision: 2,

    // Color of the axis gridlines
    axisGridlineColor: "#EDEDED",

    // Color of the axis labels
    axisLabelColor: "#A7A7A7",

    // Returns a string for the axis label timestamps
    // formatAxisTime: function,

    // Show or hide the axis label timestamps
    showAxisLabels: true,

    // Font family for axis labels, playhead, and point and segment markers
    fontFamily: "Roboto",

    // Font size for axis labels, playhead, and point and segment markers
    fontSize: 16,

    // Font style for axis labels, playhead, and point and segment markers
    // (either 'normal', 'bold', or 'italic')
    fontStyle: "bold",

    // Mouse-wheel mode: either 'none' or 'scroll'
    wheelMode: "scroll",
  };
};

export const setPeaksConfig = (
  overviewWaveformRef: React.RefObject<HTMLDivElement>,
  zoomviewWaveformRef: React.RefObject<HTMLDivElement>,
  audioElementRef: React.RefObject<HTMLAudioElement>,
  overviewOptionsConfig: OverviewOptionsConfigProps,
  zoomviewOptionsConfig: ZoomviewOptionsConfigProps,
  waveformDataUrl: string
) => {
  return {
    //setting config options for overview and zoomview
    overview: overviewOptionsConfig(overviewWaveformRef),
    zoomview: zoomviewOptionsConfig(zoomviewWaveformRef),
    //assigning the current audio element
    mediaElement: audioElementRef.current!,
    //assigning the precomputed waveform data
    dataUri: {
      arraybuffer: waveformDataUrl,
    },
    // To avoid computation when changing zoom level, Peaks.js maintains a cache
    // of waveforms at different zoom levels. This is enabled by default, but
    // can be disabled by setting waveformCache to false
    waveformCache: true,
    // Bind keyboard controls
    keyboard: true,
    // Keyboard nudge increment in seconds (left arrow/right arrow)
    nudgeIncrement: 0.01,

    //When the playhead reaches a point or segment boundary, a cue event is emitted.
    emitCueEvents: false,
  };
};

export const overviewOptionsConfig = (
  overviewWaveformRef: React.RefObject<HTMLDivElement>
) => {
  return {
    container: overviewWaveformRef.current,

    // Color for the overview waveform
    // You can also use a 2 stop gradient here. See setWaveformColor()
    waveformColor: "#BEBBBB",

    // Color for the played region of the overview waveform
    // You can also use a 2 stop gradient here. See setWaveformColor()
    playedWaveformColor: "#BEBBBB",

    // Color for the overview waveform rectangle
    // that shows what the zoomable view shows
    highlightColor: "grey",

    // Stroke color for the zoomed region
    highlightStrokeColor: "transparent",

    // Opacity for the zoomed region
    highlightOpacity: 0.5,

    // Corner Radius for the zoomed region
    highlightCornerRadius: 2,

    // The default number of pixels from the top and bottom of the canvas
    // that the overviewHighlight takes up
    highlightOffset: 11,

    // Color of the playhead
    playheadColor: "#0085FF",

    // Color of the playhead text
    playheadTextColor: "#0085FF",

    // Returns a string for the playhead timestamp label
    // formatPlayheadTime: function,

    // Show current time next to the play head
    showPlayheadTime: true,

    // Precision of time label of play head and point/segment markers
    timeLabelPrecision: 2,

    // Color of the axis gridlines
    axisGridlineColor: "#EDEDED",

    // Color of the axis labels
    axisLabelColor: "#A7A7A7",

    // Returns a string for the axis label timestamps
    // formatAxisTime: function,

    // Show or hide the axis label timestamps
    showAxisLabels: true,

    // Font family for axis labels, playhead, and point and segment markers
    fontFamily: "Roboto",

    // Font size for axis labels, playhead, and point and segment markers
    fontSize: 12,

    // Font style for axis labels, playhead, and point and segment markers
    // (either 'normal', 'bold', or 'italic')
    fontStyle: "bold",
  };
};
