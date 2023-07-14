import { TestSegmentProps } from "../../../types";
import { PeaksInstance } from "peaks.js";
import Timecode from "react-timecode";
import {
  Box,
  Grid,
  GridItem,
  Input,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Tooltip,
} from "@chakra-ui/react";
import {
  // deleteSingleSegment,
  createSingleSegment,
  handleFileNameChange,
  // handlePlayheadSeek,
} from "../../../lib/waveform-utils";
import {
  HandlePlayheadSeekProps,
  DeleteSingleSegmentProps,
} from "../../../types";

export default function ClipGrid({
  segments,
  setSegments,
  // myPeaks,
  handlePlayheadSeek,
  deleteSingleSegment,
}: {
  segments: TestSegmentProps[];
  setSegments: React.Dispatch<React.SetStateAction<TestSegmentProps[]>>;
  myPeaks: PeaksInstance;
  handlePlayheadSeek: HandlePlayheadSeekProps;
  deleteSingleSegment: DeleteSingleSegmentProps;
}) {
  return (
    //create an overflow scrollable box to contain clip information
    <Box display="block" overflowY="scroll" maxH={"35vh"}>
      {/* Map over the elements in the segments array and create a grid item for each clip */}
      {segments.length > 0 &&
        segments.map((seg, idx) => (
          <Grid
            templateColumns="repeat(8, 1fr)"
            gap={6}
            w={"100%"}
            key={idx}
            mb={".5rem"}
            p={".5rem"}
            borderRadius={".3rem"}
            _hover={{
              bgColor: "rgba(0, 0, 0, 0.04)",
              outline: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <GridItem colStart={1} colEnd={3}>
              <FormControl isInvalid={seg.formErrors.fileNameError}>
                <Input
                  isDisabled={seg.formErrors.isCreated}
                  onClick={() => handlePlayheadSeek(seg.id, true)}
                  value={seg.fileName}
                  onChange={(evt) =>
                    handleFileNameChange(seg.id!, evt, segments, setSegments)
                  }
                />
                {seg.formErrors.fileNameError && (
                  <FormErrorMessage>File Name is required.</FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
            <GridItem colStart={3} colEnd={5}>
              <Tooltip
                hasArrow
                placement="left"
                openDelay={250}
                closeDelay={50}
                label="Click for clip start"
                bg="#191C43"
              >
                <Flex
                  onClick={() => handlePlayheadSeek(seg.id, true)}
                  cursor={"pointer"}
                  ps={"1rem"}
                  borderRadius={"0.3rem"}
                  height={"40px"}
                  border={"1px solid lightgray"}
                  align={"center"}
                >
                  <Timecode format="HH:mm:ss" time={seg.startTime * 1000} />
                </Flex>
              </Tooltip>
            </GridItem>
            <GridItem colStart={5} colEnd={7}>
              <Tooltip
                hasArrow
                placement="left"
                openDelay={250}
                closeDelay={50}
                label="Click for clip end"
                bg="#191C43"
              >
                <Flex
                  onClick={() => handlePlayheadSeek(seg.id)}
                  cursor={"pointer"}
                  ps={"1rem"}
                  borderRadius={"0.3rem"}
                  height={"40px"}
                  border={"1px solid lightgray"}
                  align={"center"}
                >
                  <Timecode format="HH:mm:ss" time={seg.endTime * 1000} />
                </Flex>
              </Tooltip>
            </GridItem>
            <GridItem colStart={7} colEnd={9}>
              <Flex w={"100%"} justify={"flex-end"}>
                <Button
                  isDisabled={seg.formErrors.isCreated || seg.fileName === ""}
                  variant={"waveformOutlined"}
                  onClick={() =>
                    createSingleSegment(seg.id!, segments, setSegments)
                  }
                >
                  Create
                </Button>
                <Button
                  variant={"waveformOutlined"}
                  onClick={() => deleteSingleSegment(seg.id!)}
                >
                  Delete
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        ))}
    </Box>
  );
}
