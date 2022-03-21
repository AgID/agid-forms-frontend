/**
 * Template for node of type "comunicazione-modello-sviluppo-web".
 */
import { format } from "date-fns";
import * as React from "react";

import { LoadableViewTemplateProps } from "../../../../components/LoadableView";
import { get } from "../../../../utils/safe_access";

const ViewTemplate = ({
  form,
  node,
  values
}: LoadableViewTemplateProps) => {
  return (
    <div className="py-lg-4">
      <p className="w-paragraph neutral-2-color-b5">
        redatta il {format(node.updated_at, "DD.MM.YYYY")}
      </p>
      {form.sections!.map(section => {
        if (!section) {
          return null;
        }
        return (
          <div key={section.name || ""} className="view-section">
            {section.title && (
              <h2 className="h3 mb-2 mb-lg-4">{section.title}</h2>
            )}

            {section.name === "section-0" && (
              <div className="pb-4">
                <p className="w-paragraph neutral-2-color-b5">
                  <strong>
                    {get(
                      node,
                      n => n.node_revision_group.group_ipa_pa.des_amm,
                      ""
                    )}
                  </strong>{" "}
                  si impegna ad aderire alle Linee guida di design dei servizi
                  digitali della{" "}
                  <abbr title="pubblica amministrazione">PA</abbr> per il sito
                  web <strong>{values["website-url"]}</strong> entro il giorno{" "}
                  <strong>
                    {format(values["adjustment-date"], "DD.MM.YYYY")}
                  </strong>
                </p>
                <p>
                  <a href={values["website-url"]}>{values["website-url"]}</a>
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ViewTemplate;
