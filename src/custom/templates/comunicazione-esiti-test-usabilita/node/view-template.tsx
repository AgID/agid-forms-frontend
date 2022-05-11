/**
 * Template for node of type "comunicazione-esiti-test-usabilita".
 */
import { format } from "date-fns";
import * as React from "react";

import { LoadableViewTemplateProps } from "../../../../components/LoadableView";
import { get } from "../../../../utils/safe_access";

const ViewTemplate = ({
  node,
  values
}: LoadableViewTemplateProps) => {
  return (
    <div className="py-lg-4">
      <p className="w-paragraph neutral-2-color-b5">
        redatta il {format(node.updated_at, "DD.MM.YYYY")}
      </p>

      <div className="pb-4">
        <p className="w-paragraph neutral-2-color-b5">
          <strong>
            {get(
              node,
              n => n.node_revision_group.group_ipa_pa.des_amm,
              ""
            )}
          </strong>{" "}
          ha effettuato un test di usabilità per il proprio sito
          web <strong>{values["website-name"]}</strong> in data {" "}
          <strong>
            {format(values["test-date"], "DD.MM.YYYY")}
          </strong>
        </p>
        <p>
          <a href={values["website-url"]}>{values["website-url"]}</a>
        </p>
      </div>
    </div>
  );
};

export default ViewTemplate;
