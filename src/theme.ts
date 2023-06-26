import { brandButton } from "./styles/brandButton";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brandRed: "#D92027",
    brandBlue: "#191C43",
    bgYellow: "#FDFAF1",
    bgPink: "#FDF1F1",
    bgBlue: "#F1F2FD",
    brandDarkGray: "#333333",
  },
  fonts: {
    heading: `'Magistral', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  components: { Button: brandButton },
  textStyles: {
    heading: {
      fontFamily: "heading",
      fontSize: ["38px", "48px", "56px", "64px"],
      fontWeight: "700",
      lineHeight: "125%",
    },

    subheading: {
      fontFamily: "heading",
      fontSize: ["26px", "32px", "36px", "48px"],
      fontWeight: "700",
      lineHeight: "135%",
    },
    // for body context
    context: {
      fontSize: ["16px", "18px", "22px", "24px"],
      fontWeight: "400",
      lineHeight: "175%",
      color: "rgba(0, 0, 0, 0.6)",
    },
    // for FAQ context
    smContext: {
      fontSize: ["14px", "18px", "18px", "18px"],
      color: "rgba(0, 0, 0, 0.6)",
    },
    // for the context in Divider Section (suitable for lined title and its text)
    smBold: {
      fontSize: ["20px", "20px", "20px", "24px"],
      fontWeight: "600",
      lineHeight: { base: "175%", sm: "135%" },
    },
  },
});

export default theme;
