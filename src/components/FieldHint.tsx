import * as React from "react";
import { Tooltip } from "reactstrap";
import { generateRandomId } from "../utils/strings";
import Icon from "./Icon";

export const FieldHint = ({ hint }: { hint: string }) => {
  const [randomId] = React.useState(generateRandomId());
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  return (
    <div className="d-inline-block pl-2">
      <div id={randomId}>
        <Icon icon="help-circle" className="icon-sm align-top" />
      </div>
      <Tooltip
        placement="bottom"
        target={randomId}
        isOpen={isTooltipOpen}
        toggle={() => setIsTooltipOpen(!isTooltipOpen)}
      >
        <span style={{ fontSize: "16px" }}>{hint}</span>
      </Tooltip>
    </div>
  );
};
