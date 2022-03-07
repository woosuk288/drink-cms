import algoliasearch, { SearchClient } from 'algoliasearch';

import {
  FirestoreTextSearchController,
  performAlgoliaTextSearch,
} from '@camberi/firecms';

let client: SearchClient | undefined = undefined;
// process is defined for react-scripts builds
if (typeof process !== 'undefined') {
  if (
    process?.env.REACT_APP_ALGOLIA_APP_ID &&
    process?.env.REACT_APP_ALGOLIA_SEARCH_KEY
  ) {
    client = algoliasearch(
      process.env.REACT_APP_ALGOLIA_APP_ID,
      process.env.REACT_APP_ALGOLIA_SEARCH_KEY
    );
  }
}
// import.meta is defined for vite builds
// else if (typeof import.meta !== "undefined") {
//     if (import.meta?.env?.VITE_ALGOLIA_APP_ID && import.meta?.env?.VITE_ALGOLIA_SEARCH_KEY) {
//         client = algoliasearch(import.meta.env.VITE_ALGOLIA_APP_ID as string, import.meta.env.VITE_ALGOLIA_SEARCH_KEY as string);
//     }
// }
else {
  console.error(
    'REACT_APP_ALGOLIA_APP_ID or REACT_APP_ALGOLIA_SEARCH_KEY env variables not specified'
  );
  console.error('Text search not enabled');
}

const productsIndex = client && client.initIndex('products');
const usersIndex = client && client.initIndex('users');
const blogIndex = client && client.initIndex('blog');

export const textSearchController: FirestoreTextSearchController = ({
  path,
  searchString,
}) => {
  if (path === 'products')
    return (
      productsIndex && performAlgoliaTextSearch(productsIndex, searchString)
    );
  if (path === 'users')
    return usersIndex && performAlgoliaTextSearch(usersIndex, searchString);
  if (path === 'blog')
    return blogIndex && performAlgoliaTextSearch(blogIndex, searchString);
  return undefined;
};
