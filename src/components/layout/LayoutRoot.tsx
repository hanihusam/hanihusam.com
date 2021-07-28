import React from 'react'

import { Box } from '../ui'

const LayoutRoot: React.FC = ({ children, ...rest }) => (
  <Box
    as="main"
    backgroundColor="bgPrimary"
    color="textColorPrimary"
    display="flex"
    flexDirection="column"
    minHeight="100vh"
    overflowX="hidden"
    position="relative"
    {...rest}
  >
    {children}
  </Box>
)

export default LayoutRoot
