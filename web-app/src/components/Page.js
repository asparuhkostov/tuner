import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "../config/themes";

import { Footer } from "./";

const ResponsiveContainer = styled.div`
  width: 100vw;
  overflow: hidden;
`;

const Page = ({ children }) => (
  <ThemeProvider theme={theme.main}>
    <ResponsiveContainer>
      <div children={children}></div>
      <Footer />
    </ResponsiveContainer>
  </ThemeProvider>
);

export { Page };
