'use client';
import { Box, Container, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

const SectionContainer = ({ children }: { children: React.ReactNode }) => {
  const px = useBreakpointValue({
    base: '16px',
    sm: '20px',
    md: '50px',
    lg: '80px',
  });
  const py = useBreakpointValue({
    base: '34px',
    lg: '46px',
  });

  return (
    <Box w={'100wv'} px={px} py={py}>
      <Container maxW="1300px" p={'0'}>
        {children}
      </Container>
    </Box>
  );
};

export default SectionContainer;
