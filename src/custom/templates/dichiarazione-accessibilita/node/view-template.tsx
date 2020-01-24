/**
 * Template for node of type "dichiarazione-accessibilità".
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
import { formatFieldValue } from "../../../../components/ViewField";
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

const getWcagString = (wcagVersion: string) => {
  switch (wcagVersion) {
    case "wcag-21":
      return "ai requisiti previsti dall’allegato A alla norma UNI EN 301549:2018 (WCAG 2.1)";
    case "wcag-20":
      return "ai requisiti previsti dall’ex A DM 5 luglio 2005 (WCAG 2.0)";
    default:
      return "";
  }
};

const getComplianceString = (
  complianceStatus: string,
  isWebSite: boolean,
  wcagVersion: string
) => {
  switch (complianceStatus) {
    case "compliant":
      return `${
        isWebSite
          ? "Questo <strong>sito web</strong>"
          : "Questa <strong>applicazione</strong>"
      } è <strong>conforme</strong>${getWcagString(wcagVersion)}.`;
    case "partially-compliant":
      return `${
        isWebSite
          ? "Questo <strong>sito web</strong>"
          : "Questa <strong>applicazione</strong>"
      } è <strong>parzialmente conforme<strong>,${getWcagString(
        wcagVersion
      )} in ragione dei casi di non conformità e/o delle deroghe elencate di seguito.`;
    case "non-compliant":
      return `${
        isWebSite
          ? "Questo <strong>sito web</strong>"
          : "Questa <strong>applicazione</strong>"
      } <strong>non è conforme</strong> ${getWcagString(wcagVersion)}.`;
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
        <p
          className="w-paragraph"
          dangerouslySetInnerHTML={{
            __html: getComplianceString(
              values["compliance-status"],
              values["device-type"] === "website",
              values["specs-version"]
            )
          }}
        />
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
                  {formatFieldValue(values[`${fieldName}-text`])}
                </p>
              </div>
            )
        )}
      </div>
    ) : (
      <React.Fragment key="not-accessible" />
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
          <strong>{format(node.updated_at, "DD.MM.YYYY")}</strong> a seguito di
          una revisione{" "}
          <strong>
            {values["device-type"] === "website"
              ? "del sito web"
              : "dell'applicazione mobile"}
          </strong>
          .
        </p>
      </div>
    );
  },
  "feedback-and-contacts": ({ values, node }) => (
    <>
      <FormGroupTitle title="Feedback e recapiti" />
      <p className="w-paragraph">{values.feedback}</p>
      <p className="w-paragraph">
        <strong>Url del contatto Link al meccanismo di feedback</strong>:{" "}
        <a href={values["feedback-url"]}>{values["feedback-url"]}</a>
      </p>
      <p className="w-paragraph">
        <strong>
          Email della persona responsabile dell’accessibiltà (RTD)
        </strong>
        : {values["manager-email"]}
      </p>
      <FormGroupTitle title="Procedura di attuazione" />
      <p className="w-paragraph">
        Procedura di attuazione ai sensi dell’art. 3-quinquies, comma 3, L. 9
        gennaio 2004, n. 4 s.m.i..
        <br />
        <br /> L’utente può inviare il reclamo al Difensore civico per il
        digitale, istituito ai sensi dell’art. 17 comma 1-quater CAD,
        esclusivamente a seguito di risposta insoddisfacente o mancata risposta
        al feedback notificato al soggetto erogatore.
      </p>
      <p>
        <Link
          to={
            `/form/procedura-attuazione?device-type=${values["device-type"]}&` +
            `website-url=${encodeURIComponent(
              values["website-url"]
            )}&app-name=${encodeURIComponent(values["app-name"])}&` +
            `app-url=${encodeURIComponent(
              values["app-url"]
            )}&reported-pa=${encodeURIComponent(
              node.node_revision_group!.group_ipa_pa!.des_amm
            )}`
          }
        >
          Reclamo al Difensore civico per il digitale
        </Link>
      </p>
    </>
  ),
  "implementation-procedure": ViewGroup,
  "application-information": ({ group, values }) => {
    return InlineViewGroup({
      group: {
        ...group,
        title: values["device-type"] === "website" ? "informazioni sul sito" : "informazioni sull'appplicazione mobile"
      },
      values: values
    });
  },
  "application-org": InlineViewGroup,
  "application-manager": ({ group, values, fields }) => {
    return (
      <div className="mb-lg-5">
        <FormGroupTitle title={group.title} />
        <p className="w-paragraph">
          {group.title}{" "}
          <strong>
            {values["manager-present"] === "si" ? "" : "non"}{" "}
            {fields["manager-present"].title}
          </strong>{" "}
          e{values["manager-appointed"] === "si" ? "d" : ""}
          <strong>
            {values["manager-appointed"] === "si" ? "" : " non"}{" "}
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
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      contentClassName="rounded"
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)} tag="h2" className="px-5">
        Pubblica il link {isWebsite ? " sul sito" : " nello store"}
      </ModalHeader>
      <ModalBody className="px-5 pb-5">
        <div className="d-flex">
          <div>
            <p className="pb-4" style={{ borderBottom: "1px solid #ccc" }}>
              {isWebsite && (
                <>
                  Copia e incolla - il link in calce - nel footer del tuo sito
                  web. <br /> A seguito di questa operazione verrà effettuata
                  una verifica automatica.
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
      query HostnameAcc {
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
            {section.title && section.name !== "section-0" && (
              <h2 className="h3 mb-2 mb-lg-4">{section.title}</h2>
            )}

            {section.name === "section-0" && (
              <div className="pb-4">
                <h2>Dichiarazione di accessibilità</h2>
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
                  del Consiglio. <br />
                  <br />
                  La presente dichiarazione di accessibilità si applica a “
                  <strong>
                    {values["device-type"] === "website"
                      ? values["website-name"]
                      : values["app-name"]}
                  </strong>
                  ”.
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
