import classNames from "classnames";
import * as React from "react";

import Icons from "../icons/icons.svg";

type IconProps = { className?: string; icon: string };

const Icon = ({ className, icon }: IconProps) => (
  <svg className={classNames("icon", className)}>
    <use xlinkHref={`${Icons}#it-${icon}`} />
  </svg>
);

export default Icon;
