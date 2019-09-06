import * as React from "react";
import Helmet from "react-helmet";

const BodyStyles = ({ backgroundColor }: { backgroundColor: string }) => (
  <Helmet>
    <style>
      {`
      @media (min-width: 768px) {
        body {
          background-color: ${backgroundColor} !important
        }
      }
  `}
    </style>
  </Helmet>
);

export default BodyStyles;
