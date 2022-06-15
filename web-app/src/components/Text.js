import React from "react";
import styled from "styled-components";
import { theme } from "../config/themes";

const StyledParagraph = styled.p`
  display: inline;
  ${props => props.paragraph && `line-height: 1.75;`}
  ${props => props.color && `color: ${props.color};`}
  ${props => props.large && `font-size: 1.2em;`}
`;

const Text = props => {
  const { color, large, paragraph, theme } = props;
  const resolvedColor = theme ? theme[color] : null;

  return (
    <StyledParagraph
      color={resolvedColor}
      paragraph={paragraph}
      large={large}
      children={props.children}
    />
  );
};

Text.defaultProps = {
  theme: theme.main
};

export { Text };
