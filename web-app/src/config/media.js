//github.com/styled-components/styled-components/blob/master/packages/styled-components/docs/tips-and-tricks.md#media-templates

import { css } from "styled-components";

const sizes = {
  desktop: 1170,
  tablet: 992,
  phone: 768,
};

export default Object.keys(sizes).reduce((accumulator, label) => {
  const emSize = sizes[label] / 16;
  accumulator[label] = (...args) => css`
    @media (max-width: ${emSize}em) {
      ${css(...args)};
    }
  `;
  return accumulator;
}, {});
