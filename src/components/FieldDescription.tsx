import * as React from "react";

export const FieldDescription = ({ description }: { description: string }) => (
  <small className="mb-0 form-text text-muted">{description}</small>
);
