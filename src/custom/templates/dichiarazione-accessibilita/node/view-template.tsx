/**
 * Template for node of type "dichiarazione-accessibilità".
 *
 * TODO: multilang
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
import ViewGroup from "../../../../components/ViewGroup";
import { GetNode_published } from "../../../../generated/graphql/GetNode";
import {
  PublishNode,
  PublishNodeVariables
} from "../../../../generated/graphql/PublishNode";
import {
  GET_LATEST_NODE_WITH_PUBLISHED,
  GET_NODE_REVISION_WITH_PUBLISHED,
  PUBLISH_NODE
} from "../../../../graphql/hasura";
import { FieldT, FormGroupT, getSelectedLabel } from "../../../../utils/forms";
import { get } from "../../../../utils/safe_access";

const InlineViewGroup = ({
  group,
  values
}: {
  group: FormGroupT;
  values: Record<string, string>;
  inline?: boolean;
}) => ViewGroup({ group, values, inline: true });

const getComplianceString = (complianceStatus: string, isWebSite: boolean) => {
  switch (complianceStatus) {
    case "compliant":
      return `${
        isWebSite ? "Questo sito web" : "Questa applicazione"
      } è conforme.`;
    case "partially-compliant":
      return `${
        isWebSite ? "Questo sito web" : "Questa applicazione"
      } è parzialmente conforme, in ragione dei casi di non conformità e/o delle deroghe elencate di seguito.`;
    case "non-compliant":
      return `${
        isWebSite ? "Questo sito web" : "Questa applicazione"
      } non è conforme.`;
    default:
      return "";
  }
};

const Groups: Record<
  string,
  ({
    group,
    values,
    fields,
    node
  }: {
    group: FormGroupT;
    values: Record<string, string>;
    fields: Record<string, FieldT>;
    node: GetNode_published;
  }) => JSX.Element
> = {
  "content-compliance": ({ group, values }) => {
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">
          {getComplianceString(
            values["compliance-status"],
            values["device-type"] === "website"
          )}
        </p>
      </div>
    );
  },
  "content-not-accessible": ({ group, values, fields }) => {
    const accessibilityFields: ReadonlyArray<any> = [
      "reason-42004",
      "reason-disproportionate-burden",
      "reason-no-law"
    ];
    const hasInaccessibleContent = accessibilityFields
      .map(fieldName => values[fieldName])
      .some(_ => _);
    return hasInaccessibleContent ? (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">
          I contenuti di seguito elencati non sono accessibili per i seguenti
          motivi:
        </p>
        {accessibilityFields.map(
          fieldName =>
            values[fieldName] && (
              <div key={fieldName} className="mb-4">
                <h4
                  className="w-paragraph font-weight-bold neutral-2-color-b5 mb-2"
                  style={{ fontSize: "18px " }}
                >
                  {fields[fieldName].title}
                </h4>
                <p className="w-paragraph pl-lg-4">
                  {values[`${fieldName}-text`]}
                </p>
              </div>
            )
        )}
      </div>
    ) : (
      <></>
    );
  },
  "content-alt": ({ group, values }) =>
    values["accessible-alternatives"] ? (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">{values["accessible-alternatives"]}</p>
      </div>
    ) : (
      <></>
    ),
  "content-methodology": ({ group, values, fields, node }) => {
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">
          La dichiarazione è stata redatta il{" "}
          {format(node.created_at, "DD.MM.YYYY")}.
        </p>
        <p className="w-paragraph">
          La dichiarazione è stata effettuata utilizzando una valutazione
          conforme alle prescrizioni della direttiva (UE) 2016/2012 mediante{" "}
          <strong>
            {(
              getSelectedLabel(
                fields["methodology-details"],
                values["methodology-details"]
              ) || ""
            ).toLowerCase()}
          </strong>
        </p>
        <p className="w-paragraph">
          La dichiarazione è stata aggiornata il{" "}
          {format(node.updated_at, "DD.MM.YYYY")} a seguito di una revisione{" "}
          {values["device-type"] === "website"
            ? "del sito web"
            : "dell'applicazione mobile"}
          .
        </p>
      </div>
    );
  },
  "feedback-and-contacts": ViewGroup,
  "implementation-procedure": ViewGroup,
  "application-information": InlineViewGroup,
  "application-org": InlineViewGroup,
  "application-manager": ({ group, values, fields }) => {
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">
          {group.title}{" "}
          <strong>
            {values["manager-present"] ? "" : "non"}{" "}
            {fields["manager-present"].title}
          </strong>{" "}
          e{values["manager-appointed"] ? "d" : ""}
          <strong>
            {values["manager-appointed"] ? "" : " non"}{" "}
            {fields["manager-appointed"].title}
          </strong>
        </p>
      </div>
    );
  }
};

const PublishModal = ({
  nodeLink,
  isWebsite
}: {
  nodeLink: string;
  isWebsite: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Modal isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
      <ModalHeader toggle={() => setIsOpen(!isOpen)} tag="h2" className="px-5">
        Pubblica il link {isWebsite ? " sul sito" : " nello store"}
      </ModalHeader>
      <ModalBody className="px-5 pb-5">
        <p className="pb-4" style={{ borderBottom: "1px solid #ccc" }}>
          {isWebsite && (
            <>
              Copia e incolla - il link in calce - nel footer del tuo sito web.{" "}
              <br /> A seguito di questa operazione verrà effettuata una
              verifica automatica.
            </>
          )}
          {!isWebsite && (
            <>
              Pubblica nello store della tua app il link in calce, in "Altre
              informazioni" nella sezione "Sviluppatore".
            </>
          )}
        </p>
        <p className="font-weight-bold pt-4">
          <a href={nodeLink}>{nodeLink}</a>
        </p>
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
  fields,
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
      query Hostname {
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
    <div className="px-lg-5 py-lg-4">
      {!publishedVersion && (
        <div className="alert alert-warning my-3">
          <p>{t("draft_version")}</p>
        </div>
      )}

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
                  si impegna a rendere{" "}
                  <strong>
                    {values["device-type"] === "website"
                      ? "il proprio sito web"
                      : "la propria applicazione mobile"}{" "}
                  </strong>
                  accessibile, conformemente al D.lgs 10 agosto 2018, n. 106 che
                  ha recepito la direttiva UE 2016/2102 del Parlamento europeo e
                  del Consiglio. La presente dichiarazione di accessibilità si
                  applica a “
                  {values["device-type"] === "website"
                    ? values["website-name"]
                    : values["app-name"]}
                  ” .
                </p>
                <p>
                  <a
                    href={
                      values["device-type"] === "website"
                        ? values["website-url"]
                        : values["app-url"]
                    }
                    className="font-weight-bold"
                  >
                    {values["device-type"] === "website"
                      ? values["website-url"]
                      : values["app-url"]}
                  </a>
                </p>
              </div>
            )}

            {section.name !== "section-0" && section.description && (
              <p className="w-paragraph neutral-1-color-b6">
                {section.description}
              </p>
            )}

            {section.groups!.map(group => {
              const GroupEl =
                group && group.name ? Groups[group.name] : undefined;
              return group && group.name && GroupEl ? (
                <GroupEl
                  group={group}
                  values={values}
                  fields={fields}
                  node={node}
                  key={group.name}
                />
              ) : null;
            })}
          </div>
        );
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
            isWebsite={values["device-type"] === "website"}
          />
        )}
    </div>
  );
};

export default ViewTemplate;
