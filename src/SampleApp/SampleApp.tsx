import React from 'react';

import { getAnalytics } from 'firebase/analytics';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Authenticator,
  buildCollection,
  CMSView,
  EntityCollection,
  FirebaseCMSApp,
  Navigation,
  NavigationBuilder,
  NavigationBuilderProps,
} from '@camberi/firecms';

import { IconButton, Tooltip } from '@mui/material';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

import { firebaseConfig } from '../firebase_config';
import { ExampleCMSView } from './ExampleCMSView';
import logo from './images/demo_logo.png';
import { textSearchController } from './text_search';
import {
  localeSchema,
  productAdditionalColumn,
  productCallbacks,
  productExtraActionBuilder,
  productSchema,
} from './schemas/products_schema';

import { usersSchema } from './schemas/users_schema';
import {
  blogSchema,
  sampleAdditionalExportColumn,
} from './schemas/blog_schema';
import { testCallbacks, testEntitySchema } from './schemas/test_schema';
import { customSchemaOverrideHandler } from './schemas/custom_schema_resolver';

import 'typeface-rubik';
import 'typeface-space-mono';
import { Coffee, Company, Locale, Product } from './types';
import { coffeeCallbacks, coffeeSchema } from './schemas/coffee_schema';
import { companiesSchema } from './schemas/company_schema';

function SampleApp() {
  const localeCollection: EntityCollection<Locale> = buildCollection({
    name: 'Locales',
    path: 'locales',
    schema: localeSchema,
    defaultSize: 'm',
  });

  const productsCollection = buildCollection<Product>({
    path: 'products',
    schema: productSchema,
    // inlineEditing: false,
    callbacks: productCallbacks,
    name: 'Products',
    group: 'Main',
    description: 'List of the products currently sold in our shop',
    textSearchEnabled: true,
    additionalColumns: [productAdditionalColumn],
    filterCombinations: [{ category: 'desc', available: 'desc' }],
    permissions: ({ authController }) => ({
      edit: true,
      create: true,
      // we use some custom logic by storing user data in the `extra`
      // field of the user
      delete: authController.extra?.roles.includes('admin'),
    }),
    extraActions: productExtraActionBuilder,
    subcollections: [localeCollection],
    excludedProperties: ['images'],
  });

  const coffeesCollection = buildCollection<Coffee>({
    path: 'coffees',
    schema: coffeeSchema,
    callbacks: coffeeCallbacks,
    name: 'Coffees',
    group: 'Main',
    description: 'List of the coffee currently sold in our shop',
    textSearchEnabled: true,
    filterCombinations: [{ created_at: 'desc' }],
    permissions: ({ authController }) => ({
      edit: authController.extra?.roles.includes('admin'),
      create: authController.extra?.roles.includes('admin'),
      // we use some custom logic by storing user data in the `extra`
      // field of the user
      delete: authController.extra?.roles.includes('admin'),
    }),
    initialFilter: {
      // uid: ['==', 'ptyL86Mqu8gBqhobO5UVU37EBFx1'],
    },
  });

  const companiesCollection = buildCollection<Company>({
    path: 'companies',
    schema: companiesSchema,
    name: 'Companies',
    group: 'Admin',
    description: 'List of the coffee currently sold in our shop',
    textSearchEnabled: true,
    // filterCombinations: [{ created_at: 'desc' }],
    permissions: ({ authController }) => ({
      edit: false,
      create: false,
      // we use some custom logic by storing user data in the `extra`
      // field of the user
      delete: false,
    }),
  });

  const usersCollection = buildCollection({
    path: 'users',
    schema: usersSchema,
    name: 'Users',
    group: 'Admin',
    description: 'Registered users',
    textSearchEnabled: true,
    additionalColumns: [
      {
        id: 'sample_additional',
        title: 'Sample additional',
        builder: ({ entity }) =>
          `Generated column: ${entity.values.first_name}`,
        dependencies: ['first_name'],
      },
    ],
    properties: [
      'first_name',
      'last_name',
      'email',
      'liked_products',
      'picture',
      'phone',
      'sample_additional',
    ],
  });

  const blogCollection = buildCollection({
    path: 'blog',
    schema: blogSchema,
    name: 'Blog',
    group: 'Content',
    exportable: {
      additionalColumns: [sampleAdditionalExportColumn],
    },
    defaultSize: 'l',
    properties: [
      'name',
      'header_image',
      'status',
      'content',
      'tags',
      'publish_date',
    ],
    description:
      'Collection of blog entries included in our [awesome blog](https://www.google.com)',
    textSearchEnabled: true,
    permissions: ({ authController }) => ({
      edit: authController.extra?.roles.includes('admin'),
      create: authController.extra?.roles.includes('admin'),
      // we use some custom logic by storing user data in the `extra`
      // field of the user
      delete: authController.extra?.roles.includes('admin'),
    }),
    initialFilter: {
      //   status: ['==', 'published'],
    },
  });

  const testCollection = buildCollection({
    path: 'test_entity',
    schema: testEntitySchema,
    callbacks: testCallbacks,
    name: 'Test entity',
    additionalColumns: [
      {
        id: 'full_name',
        title: 'Full Name',
        builder: ({ entity }) => {
          let values = entity.values;
          return typeof values.name === 'string'
            ? values.name.toUpperCase()
            : 'Nope';
        },
        dependencies: ['name'],
      },
    ],
    subcollections: [
      {
        path: 'test_subcollection',
        schema: testEntitySchema,
        name: 'Test entity',
      },
    ],
  });

  const drinkdepthLink = (
    <Tooltip title="drinkdepth.com 이동">
      <IconButton
        href={'https://drinkdepth.com'}
        rel="noopener noreferrer"
        target="_blank"
        component={'a'}
        size="large"
      >
        <LocalCafeIcon />
      </IconButton>
    </Tooltip>
  );

  const customViews: CMSView[] = [
    {
      path: ['additional', 'additional/:id'],
      name: 'Additional',
      group: 'Content',
      description:
        'This is an example of an additional view that is defined by the user',
      view: <ExampleCMSView path={'users'} collection={usersCollection} />,
    },
  ];

  const onFirebaseInit = (config: Object) => {
    // Just calling analytics enables screen tracking
    getAnalytics();
  };

  const myAuthenticator: Authenticator<FirebaseUser> = async ({
    user,
    authController,
  }) => {
    if (user?.email?.includes('flanders')) {
      throw Error('Stupid Flanders!');
    }

    // This is an example of retrieving async data related to the user
    // and storing it in the user extra field
    // const sampleUserData = await Promise.resolve({
    //   roles: ['admin'],
    // });

    const userRoleData =
      user?.uid === 'OpFd3p9XfhXrY4mxeavWjnViLYB3' ||
      user?.uid === 'ptyL86Mqu8gBqhobO5UVU37EBFx1'
        ? { roles: ['admin'] }
        : { roles: [] };

    authController.setExtra(userRoleData);
    console.log('Allowing access to', user);
    return !!user;
  };

  const navigation: NavigationBuilder<FirebaseUser> = async ({
    user,
    authController,
  }: NavigationBuilderProps) => {
    if (authController.extra)
      console.log(
        'Custom data stored in the authController',
        authController.extra
      );

    const navigation: Navigation = {
      collections: [coffeesCollection, /* usersCollection, */ blogCollection],
      views: customViews,
    };

    if (process.env.NODE_ENV !== 'production') {
      navigation.collections.push(
        // buildCollection(testCollection),
        // productsCollection,
        companiesCollection
      );
    }

    return navigation;
  };

  return (
    <FirebaseCMSApp
      name={'CMS Drink Depth'}
      authentication={myAuthenticator}
      signInOptions={[
        'password',
        // 'anonymous',
        'google.com',
        // 'facebook.com',
        // 'github.com',
        // 'twitter.com',
        // 'microsoft.com',
        'apple.com',
      ]}
      textSearchController={textSearchController}
      //   allowSkipLogin={true}
      logo={logo}
      navigation={navigation}
      schemaOverrideHandler={customSchemaOverrideHandler}
      firebaseConfig={firebaseConfig}
      onFirebaseInit={onFirebaseInit}
      toolbarExtraWidget={drinkdepthLink}
      //   primaryColor="#4f9cff"
      locale="ko"
    />
  );
}

export default SampleApp;
