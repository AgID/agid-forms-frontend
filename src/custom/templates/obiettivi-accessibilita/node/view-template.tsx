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
import ViewField from "../../../../components/ViewField";
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
          const groupEnabled =
            group && group.name ? values[`abilita-${group.name}`] : undefined;
          return group && group.name && groupEnabled ? (
            <div className="fieldset mb-3 mb-lg-5" key={group.name!}>
              {group.title && <FormGroupTitle title={group.title} />}
              {group.description && <p className="w-paragraph">{group.description}</p>}
              {group.fields &&
                group.fields.filter(field => {
                  return field && field.name && field.name.indexOf("abilita-") !== 0;
                }).map(field =>
                  field && field.name ? (
                    <ViewField
                      inline={false}
                      key={field.name}
                      field={field}
                      value={values[field.name]}
                    />
                  ) : null
                )}
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
