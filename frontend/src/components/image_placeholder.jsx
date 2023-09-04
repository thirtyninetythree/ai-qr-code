import React from 'react';
import { Box, Skeleton } from '@mui/material';

const ImagePlaceholder = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={500}
      height={500}
      bgcolor="#f0f0f0"
    >
      <Skeleton
        variant="rectangular"
        width={300}
        height={300}
        animation="wave"
      />
    </Box>
  );
};

export default ImagePlaceholder;
