/**
 * Template for node of type "obiettivi-accessibilita".
 */
import { format } from "date-fns";
import * as React from "react";

import { graphql, Link, useStaticQuery } from "gatsby";
import { useState } from "react";
import { Mutation } from "react-apollo";
import { Trans, useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import ApolloErrors from "../../../../components/ApolloErrors";
import FormGroupTitle from "../../../../components/FormGroupTitle";
import { LoadableViewTemplateProps } from "../../../../components/LoadableView";
import {
  PublishNode,
  PublishNodeVariables
} from "../../../../generated/graphql/PublishNode";
import {
  GET_LATEST_NODE_WITH_PUBLISHED,
  GET_NODE_REVISION_WITH_PUBLISHED,
  PUBLISH_NODE
} from "../../../../graphql/hasura";
import { get } from "../../../../utils/safe_access";

const getInterventionString = (fieldValues: Array<string>|string) => {
  return Array.isArray(fieldValues) && fieldValues.map((fieldValue: string) => {
    switch (fieldValue) {
      case "formazione_aspetti-normativi":
        return "Formazione - Aspetti normativi";
      case "formazione_aspetti-tecnici":
        return "Formazione - Aspetti tecnici";
      case "organizzazione-del-lavoro_creazione-di-un-gruppo-apposito-accessibilita":
        return "Organizzazione del lavoro - Creazione di un gruppo apposito sull'accessibilità";
      case "organizzazione-del-lavoro_miglioramento-iter-pubblicazione-e-ruoli-redazionali":
        return "Organizzazione del lavoro - Miglioramento dell'iter di pubblicazione su web e ruoli redazionali";
      case "organizzazione-del-lavoro_nomina-rtd":
        return "Organizzazione del lavoro - Nomina del Responsabile della Transizione al digitale";
      case "organizzazione-del-lavoro_piano-telelavoro":
        return "Organizzazione del lavoro - Piano per l’utilizzo del telelavoro";
      case "organizzazione-del-lavoro_piano-acquisto-soluzioni-hardware-software":
        return "Organizzazione del lavoro - Piano per l'acquisto di soluzioni hardware e software";
      case "postazioni-di-lavoro_attuazione-specifiche-tecniche":
        return "Postazioni di lavoro - Attuazione specifiche tecniche";
      case "siti-web-app-mobili_interventi-tipo-adeguativo-correttivo":
        return "Siti web e/o app mobili - Interventi di tipo adeguativo e/o correttivo";
      case "siti-web-app-mobili_adeguamento_criteri_accessibilita":
        return "Sito web e/o app mobili - Adeguamento ai criteri di accessibilità";
      case "siti-web-app-mobili_adeguamento-lg-design":
        return "Sito web e/o app mobili - Adeguamento alle 'Linee guida di design siti web della PA'";
      case "siti-web-app-mobili_analisi_usabilita":
        return "Sito web e/o app mobili - Analisi dell'usabilità";
      case "siti-web-app-mobili_interventi-sui-documenti":
        return "Sito web e/o app mobili - Interventi sui documenti (es. pdf di documenti-immagine inaccessibili)";
      case "siti-web-app-mobili_miglioramento-moduli-formulari":
        return "Sito web - Miglioramento moduli e formulari presenti sul sito/i";
      case "siti-web-app-mobili_sviluppo-rifacimento-sito":
        return "Sito web e/o app mobili - Sviluppo, o rifacimento, del sito/i";
      default:
        return "";
    }
  }).join(", ");
};

const PublishModal = ({
  nodeLink
}: {
  nodeLink: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      contentClassName="rounded"
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)} tag="h2" className="px-5">
        Pubblica il link sul sito istituzionale
      </ModalHeader>
      <ModalBody className="px-5 pb-5">
        <div className="d-flex">
          <div>
            <p className="pb-4" style={{ borderBottom: "1px solid #ccc" }}>
              Copia e incolla il link nella apposita sezione del tuo sito
              web.
            </p>
            <p className="font-weight-bold pt-4">
              <a href={nodeLink}>{nodeLink}</a>
            </p>
          </div>
          <div style={{ width: "150px" }}>
            <img src={"/images/modals/copiaeincollacodice.svg"} alt="" />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

const PublishCta = ({
  nodeId,
  nodeVersion,
  onCompleted
}: {
  nodeId: number;
  nodeVersion: number;
  onCompleted: (data: PublishNode) => void;
}) => {
  return (
    <Mutation<PublishNode, PublishNodeVariables>
      mutation={PUBLISH_NODE}
      refetchQueries={[
        {
          query: GET_LATEST_NODE_WITH_PUBLISHED,
          variables: { id: nodeId }
        },
        {
          query: GET_NODE_REVISION_WITH_PUBLISHED,
          variables: { id: nodeId, version: nodeVersion }
        }
      ]}
      onCompleted={onCompleted}
    >
      {(publishNode, { loading: publishLoading, error: publishError }) => {
        if (publishLoading) {
          return (
            <p>
              <Trans i18nKey="sending_data" />
            </p>
          );
        }
        if (publishError) {
          return (
            <p className="text-danger">
              <Trans i18nKey="errors.error_sending_data" />
              <br />
              <ApolloErrors errors={publishError} />
            </p>
          );
        }
        return (
          <Button
            color="primary"
            onClick={() =>
              publishNode({
                variables: {
                  id: nodeId,
                  version: nodeVersion + 1
                }
              })
            }
          >
            <Trans i18nKey="publish_node" />
          </Button>
        );
      }}
    </Mutation>
  );
};

const ViewTemplate = ({
  form,
  node,
  values,
  publishedVersion,
  ctaClicked,
  setCtaClicked,
  links
}: LoadableViewTemplateProps) => {
  const { t } = useTranslation();

  const { hostnameData } = useStaticQuery(
    graphql`
      query HostnameObj {
        hostnameData: allConfigYaml(filter: { title: { ne: null } }) {
          edges {
            node {
              hostname
            }
          }
        }
      }
    `
  );

  const hostname = get(
    hostnameData,
    hd => (hd.edges[0].node.hostname as unknown) as string,
    ""
  );

  return (
    <div className="py-lg-4">
      <h2 className="h3 neutral-2-color-b5">
        {get(
          node,
          n => n.node_revision_group.group_ipa_pa.des_amm,
          ""
        )}
      </h2>
      {!publishedVersion && (
        <div className="alert alert-warning my-3">
          <p>{t("draft_version")}</p>
        </div>
      )}

      <p className="w-paragraph neutral-2-color-b5">
        compilati in data {format(node.updated_at, "DD/MM/YYYY")}
      </p>
      {form.sections!.map(section => {
        if (!section) {
          return null;
        }

        const SectionGroups = section.groups!.map(group => {
          if (group && group.name && group.name == "gruppo-anno") {
            return (
              <React.Fragment key={group.name}>
                <div className="mb-4">
                  <p className="w-paragraph font-weight-bold neutral-2-color-b5 mb-2">
                    Anno {values["anno"]}
                  </p>
                </div>
              </React.Fragment>
            );
          }
          const groupEnabled =
            group &&
            group.name &&
            values[`intervento-${group.name}`]
            && values[`intervento-${group.name}`].length;

          return group && group.name && groupEnabled ? (
            <div className="fieldset mb-3 mb-lg-5" key={group.name!}>
              {group.title && <FormGroupTitle title={group.title} />}
              {group.description && <p className="w-paragraph">{group.description}</p>}
              {group.fields && group.fields.map(field => {
                if (field && field.name && field.name == `intervento-${group.name}`) {
                  return (
                    <React.Fragment key={field.name}>
                      <div className="mb-4">
                        <p className="w-paragraph font-weight-bold neutral-2-color-b5 mb-2">
                          {field.title}
                        </p>
                        <p className="w-paragraph">{getInterventionString(values[field.name])}</p>
                      </div>
                    </React.Fragment>
                  );
                }
                if (field && field.name && field.name == `tempi-adeguamento-${group.name}`) {
                  return (
                    <React.Fragment key={field.name}>
                      <div className="mb-4">
                        <p className="w-paragraph font-weight-bold neutral-2-color-b5 mb-2">
                          {field.title}
                        </p>
                        <p className="w-paragraph">{(new Date(values[field.name])).toLocaleDateString()}</p>
                      </div>
                    </React.Fragment>
                  );
                }
                return;
              })}
            </div>
          ) : null;
        }).filter(group => group);

        return SectionGroups.length ? (
          <div key={section.name || ""} className="view-section">
            {section.title && section.name !== "section-0" && (
              <h3 className="mb-2 mb-lg-4">{section.title}</h3>
            )}

            {section.name !== "section-0" && section.description && (
              <p className="w-paragraph neutral-1-color-b6">
                {section.description}
              </p>
            )}

            {SectionGroups}
          </div>
        ) : null;
      })}

      <div className="text-center">
        {links.map(link => (
          <div className="btn btn-outline-primary mx-4" key={link.to}>
            <Link to={link.to} className="text-decoration-none">
              {link.title}
            </Link>
          </div>
        ))}
        {(!publishedVersion || node.version > publishedVersion) && (
          <PublishCta
            nodeId={node.id}
            nodeVersion={node.version}
            onCompleted={() => {
              setCtaClicked(true);
            }}
          />
        )}
      </div>
      {publishedVersion &&
        ctaClicked &&
        node.version === publishedVersion - 1 && (
          <PublishModal
            nodeLink={`https://${hostname}/view/${node.id}`}
          />
        )}
    </div>
  );
};

export default ViewTemplate;
