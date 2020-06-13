import React, { Component } from "react";
import Link from "./Link";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { useQuery } from "@apollo/react-hooks";

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const _updateCacheAfterVote = (store, createVote, linkId) => {
  const data = store.readQuery({ query: FEED_QUERY });

  const votedLink = data.feed.links.find((link) => link.id === linkId);
  votedLink.votes = createVote.link.votes;

  store.writeQuery({ query: FEED_QUERY, data });
};

const LinkList = () => {
  const { loading, error, data } = useQuery(FEED_QUERY);
  if (loading) {
    return <div>Fetching</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  const linksToRender = data.feed.links;
  return (
    <div>
      {linksToRender.map((link, idx) => (
        <Link
          key={link.id}
          link={link}
          index={idx}
          updateStoreAfterVote={_updateCacheAfterVote}
        />
      ))}
    </div>
  );
};
export default LinkList;
