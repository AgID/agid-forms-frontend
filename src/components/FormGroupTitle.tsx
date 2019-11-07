import * as React from "react";

const FormGroupTitle = ({ title }: { title: string | null }) => (
  <h3 className="display-3 font-variant-small-caps primary-color-a9 my-2 mt-lg-3 mb-lg-4 text-spaced-xs">
    {title || ""}
  </h3>
);

export default FormGroupTitle;
