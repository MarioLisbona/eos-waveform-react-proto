import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const brandPrimary = defineStyle({
  background: "brandRed",
  color: "white",
  fontSize: { base: "16px", lg: "18px" },
  h: { base: "48px", lg: "58px" },
  minW: { base: "100%", sm: "fit-content" },
  fontWeight: { base: "500", lg: "600" },
  lineHeight: "1",
  borderRadius: "100",
  transition: "background 0.5s ease",
  _hover: {
    background: "red.500",
  },
});

const brandPrimaryMobileNav = defineStyle({
  background: "brandRed",
  color: "white",
  fontSize: "16px",
  h: "40px",
  minW: "fit-content",
  fontWeight: "500",
  lineHeight: "1",
  borderRadius: "100",
  transition: "background 0.5s ease",
  _hover: {
    background: "red.500",
  },
});

const waveformBlue = defineStyle({
  background: "brandBlue",
  p: "10px 12px",
  color: "white",
  fontSize: { base: "6px", lg: "12px" },
  h: { base: "16px", lg: "32px" },
  minW: { base: "100%", sm: "fit-content", lg: "130px" },
  fontWeight: { base: "500", lg: "600" },
  lineHeight: "1",
  borderRadius: "100",
  transition: "background 0.5s ease",
  _hover: {
    background: "red.500",
  },
});

const waveformOutlined = defineStyle({
  fontSize: { base: "16px", lg: "14px" },
  h: "37px",
  minW: { base: "100%", sm: "fit-content", lg: "105px" },
  fontWeight: { base: "500", lg: "600" },
  lineHeight: "1",
  border: "1px solid rgba(0, 0, 0, 0.6)",
  transition: "color 0.5s ease",
  _hover: {
    color: "brandRed",
    borderColor: "brandRed",
  },
  borderRadius: "4px",
  mx: "1rem",
});

const brandOutlined = defineStyle({
  colorScheme: "brandRed",
  // textStyle: 'context',
  fontSize: { base: "16px", lg: "18px" },
  h: "30px",
  minW: { base: "100%", sm: "fit-content" },
  fontWeight: { base: "500", lg: "600" },
  lineHeight: "1",
  border: "1px solid rgba(0, 0, 0, 0.6)",
  transition: "color 0.5s ease",
  _hover: {
    color: "brandRed",
    borderColor: "brandRed",
  },
  borderRadius: "100",
  mx: "1rem",
});

const brandClear = defineStyle({
  // textStyle: 'context',
  fontSize: ["12px", "14px", "16px", "18px"],
  fontWeight: ["400", "500", "600"],
  lineHeight: ["1.25", "1.35"],
  height: ["36px", "40px", "44px", "48px"],
  minWidth: "fit-content",
  transition: "color 0.5s ease",
  _hover: {
    color: "brandRed",
  },
});

const brandFooter = defineStyle({
  color: "white",
  fontSize: ["12px", "14px", "16px", "18px"],
  fontWeight: ["400", "500", "600"],
  lineHeight: ["1.25", "1.35"],
  height: ["36px", "40px", "44px", "48px"],
  minWidth: "fit-content",
  transition: "color 0.5s ease",
  _hover: { color: "rgba(0, 0, 0, 0.6)" },
});

export const brandButton = defineStyleConfig({
  variants: {
    brandPrimary,
    brandPrimaryMobileNav,
    waveformBlue,
    waveformOutlined,
    brandOutlined,
    brandClear,
    brandFooter,
  },
  defaultProps: {
    size: "lg",
    variant: "brandPrimary",
  },
});
