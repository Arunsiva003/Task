import React from 'react';
import { Heading, Box } from "@chakra-ui/react";
import AddCodeTable from './TufDash';

const DashboardPage = () => {
  return (
    <Box p={8}>
      <Heading as="h1" mb={4}>Dashboard</Heading>
      <AddCodeTable />
    </Box>
  );
};

export default DashboardPage;
