/**
 * Template for node of type "comunicazione-esiti-test-usabilita".
 */
import { format } from "date-fns";
import * as React from "react";

import { Link, navigate } from "gatsby";
import { useState } from "react";
import { Mutation } from "react-apollo";
import { Trans, useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import ApolloErrors from "../../../../components/ApolloErrors";

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

const PublishModal = ({ dashboardLink }: { dashboardLink: string }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => setIsOpen(!isOpen)}
      onClosed={() => navigate("/form/comunicazione-esiti-test-usabilita")}
      contentClassName="rounded"
    >
      <ModalHeader toggle={() => setIsOpen(!isOpen)} tag="h2" className="px-5">
        Comunicazione acquisita!
      </ModalHeader>
      <ModalBody className="px-5 pb-5">
        <div className="d-flex">
          <div>
            <p className="pt-4 w-paragraph">
              Hai appena comunicato all'Agenzia per l'Italia Digitale l'esito
              del test di usabilità effettuato sul sito istituzionale della tua
              PA.
            </p>

            <p className="pt-4 w-paragraph">
              Vai alla <Link to={dashboardLink}>gestione comunicazioni</Link> o{" "}
              <Link to="/form/comunicazione-esiti-test-usabilita">
                invia una nuova comunicazione
              </Link>
            </p>
          </div>
          <div style={{ width: "150px" }}>
            <img src={"/images/modals/dichiarazione_acquisita.svg"} alt="" />
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
            <Trans i18nKey="submit" />
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
  setCtaClicked
}: LoadableViewTemplateProps) => {
  const { t } = useTranslation();
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

      <div className="text-center">
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
      {publishedVersion && ctaClicked && (
        // node.version === publishedVersion - 1 &&
        <PublishModal dashboardLink={`/dashboard/comunicazione-esiti-test-usabilita`} />
      )}
    </div>
  );
};

export default ViewTemplate;
