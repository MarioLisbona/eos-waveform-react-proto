// import * as React from "react";
import { Flex, Text } from "@chakra-ui/react";
import SectionContainer from "./components/SectionContainer";
import WaveForm from "./components/waveform";

export const App = () => (
  <SectionContainer>
    <Flex direction={"column"} align={"center"}>
      <Text textStyle={"context"}>EOS Waveform Prototype</Text>
      <WaveForm />
    </Flex>
  </SectionContainer>
);
