import * as React from "react";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Link } from "gatsby";

import { Query } from "react-apollo";
import { GetUserNodes } from "../../generated/graphql/GetUserNodes";
import { UserProfileConfig } from "../../generated/graphql/UserProfileConfig";
import { getMenu, getSiteConfig } from "../../graphql/gatsby_fragments";
import { GET_USER_NODES } from "../../graphql/hasura_queries";

const UserProfileTemplate = ({
  data,
  userId
}: {
  data: UserProfileConfig;
  userId: string;
}) => {
  return (
    <Layout
      menu={getMenu(data)}
      siteConfig={getSiteConfig(data)}
      title="Dashboard"
    >
      <SEO title="Home" meta={[]} keywords={[]} />
      <Query<GetUserNodes> query={GET_USER_NODES}>
        {({
          loading: userNodesLoading,
          error: userNodesError,
          data: userNodes
        }) => {
          if (userNodesLoading) {
            return <p>Carico i dati...</p>;
          }
          if (userNodesError) {
            return (
              <p>
                Errore nel caricamento dei dati:{" "}
                {JSON.stringify(userNodesError)}
              </p>
            );
          }
          if (!userNodes) {
            return (
              <p>
                {data}
                {userId}
              </p>
            );
          }
          return (
            <table className="table table-hover table-bordered table-striped">
              <thead>
                <tr>
                  <th>title</th>
                  <th>type</th>
                  <th>created</th>
                  <th>updated</th>
                  <th>status</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {userNodes.node.map(node => {
                  return (
                    <tr key={node.id}>
                      <td>
                        {node.title}
                        <br />
                        <small>{node.id}</small>
                      </td>
                      <td>{node.type}</td>
                      <td>{new Date(node.created_at).toLocaleDateString()}</td>
                      <td>{new Date(node.updated_at).toLocaleDateString()}</td>
                      <td>{node.status}</td>
                      <td>
                        <Link
                          to={`/form/${node.type.replace("_", "-")}/${node.id}`}
                        >
                          edit
                        </Link>{" "}
                        <Link to={`/view/${node.id}`}>view</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        }}
      </Query>
    </Layout>
  );
};

export default UserProfileTemplate;
