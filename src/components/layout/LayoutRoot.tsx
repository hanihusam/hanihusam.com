import React from 'react'
import { Box } from 'src/styles/components'

const LayoutRoot: React.FC = ({ children }) => (
  <Box
    as="main"
    display="flex"
    flexDirection="column"
    position="relative"
    minHeight="100vh"
    overflowX="hidden"
    color="textColorPrimary"
    backgroundColor="bgPrimary"
  >
    {children}
  </Box>
)

export default LayoutRoot
