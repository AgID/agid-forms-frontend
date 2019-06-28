import * as React from "react";
import Helmet from "react-helmet";

const BodyStyles = ({ backgroundColor }: { backgroundColor: string }) => (
  <Helmet>
    <style>
      {`
    body {
      background-color: ${backgroundColor} !important
    }
  `}
    </style>
  </Helmet>
);

export default BodyStyles;
