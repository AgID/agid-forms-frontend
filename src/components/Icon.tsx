import classNames from "classnames";
import * as React from "react";

import Icons from "../icons/icons.svg";

type IconProps = { className?: string; icon: string } & React.SVGProps<
  SVGSVGElement
>;

const Icon = ({ className, icon, ...props }: IconProps) => (
  <svg className={classNames("icon", className)} {...props}>
    <use xlinkHref={`${Icons}#it-${icon}`} />
  </svg>
);

export default Icon;
