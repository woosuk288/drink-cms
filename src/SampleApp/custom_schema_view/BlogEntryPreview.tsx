import React, { useEffect, useState } from 'react';
import {
  Box,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import {
  Entity,
  EntityCustomViewParams,
  EntityReference,
  EntityValues,
  ErrorView,
  Markdown,
  useDataSource,
  useStorageSource,
} from '@camberi/firecms';
import { Product } from '../types';
import { productSchema } from '../schemas/products_schema';
import PostHead from './PostHead';
import { BlogEntry } from '../schemas/blog_schema';
import styled from '@emotion/styled';

export function BlogEntryPreview({
  modifiedValues,
}: EntityCustomViewParams<BlogEntry>) {
  // const storage = useStorageSource();

  // const [headerUrl, setHeaderUrl] = useState<string | undefined>();
  // useEffect(() => {
  //   if (modifiedValues?.header_image) {
  //     storage
  //       .getDownloadURL(modifiedValues.header_image)
  //       .then((res) => setHeaderUrl(res));
  //   }
  // }, [storage, modifiedValues?.header_image]);

  return (
    <Box>
      {/* {headerUrl && <img
                alt={"Header"}
                style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover"
                }}
                src={headerUrl}
            />} */}

      <PostHead
        headerUrl={modifiedValues?.image_url ?? ''}
        title={modifiedValues?.name ?? ''}
        publish_date={modifiedValues?.publish_date?.toLocaleDateString() ?? ''}
        tags={modifiedValues?.tags ?? []}
      />

      <MarkdownRenderer>
        {modifiedValues?.content &&
          modifiedValues.content
            .filter((e: any) => !!e)
            .map((entry: any, index: number) => {
              if (entry.type === 'text')
                return (
                  <Text
                    key={`preview_text_${index}`}
                    markdownText={entry.value}
                  />
                );
              if (entry.type === 'image')
                return (
                  // <Images
                  //   key={`preview_images_${index}`}
                  //   storagePaths={entry.value}
                  // />
                  <a href={entry.value} target="_blank" rel="noreferrer">
                    <img
                      key={`preview_images_${index}`}
                      src={entry.value}
                      alt="preview"
                    />
                  </a>
                );
              if (entry.type === 'products')
                return (
                  <Products
                    key={`preview_products_${index}`}
                    references={entry.value}
                  />
                );
              return <ErrorView error={'Unexpected value in blog entry'} />;
            })}
      </MarkdownRenderer>
    </Box>
  );
}

const MarkdownRenderer = styled.div`
  // Renderer Style
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  padding: 100px 0;

  // Markdown Style
  line-height: 1.8;
  font-size: 16px;
  font-weight: 400;

  // Apply Padding Attribute to All Elements
  p,
  blockquote,
  ul ol,
  dl,
  table,
  pre,
  details {
    margin-top: 0;
    margin-bottom: 16px;
  }

  // Adjust Heading Element Style
  h1,
  h2,
  h3 {
    line-height: 1.5;
  }

  * + h1 {
    margin-top: 80px;
  }
  * + h2 {
    margin-top: 64px;
  }
  * + h3 {
    margin-top: 48px;
  }

  hr + h1,
  hr + h2,
  hr + h3 {
    margin-top: 0;
  }

  h1 {
    font-weight: 800;
    margin-bottom: 30px;
    font-size: 30px;
  }

  h2 {
    font-size: 25px;
    font-weight: 700;
    margin-bottom: 25px;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  // Adjust Quotation Element Style
  blockquote {
    margin: 30px 0;
    padding: 5px 15px;
    border-left: 2px solid #000000;
    font-weight: 800;
  }

  // Adjust List Element Style
  ol,
  ul {
    margin-left: 20px;
    padding: 30px 0;
  }

  // Adjust Horizontal Rule style
  hr {
    border: 1px solid #000000;
    margin: 100px 0;
  }

  // Adjust Link Element Style
  a {
    color: #4263eb;
    text-decoration: underline;
  }

  // Adjust Code Style
  pre[class*='language-'] {
    margin: 30px 0;
    padding: 15px;
    font-size: 15px;

    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.5);
      border-radius: 3px;
    }
  }

  code[class*='language-'],
  pre[class*='language-'] {
    tab-size: 2;
  }

  img {
    max-width: 100%;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 40px 16px;
    img {
      width: 100%;
    }

    hr {
      margin: 50px 0;
    }
  }
`;

export function Images({ storagePaths }: { storagePaths: string[] }) {
  if (!storagePaths) return <></>;
  return (
    <Box display="flex">
      {storagePaths.map((path, index) => (
        <Box
          p={2}
          m={1}
          key={`images_${index}`}
          style={{
            width: 250,
            height: 250,
          }}
        >
          <StorageImage storagePath={path} />
        </Box>
      ))}
    </Box>
  );
}

export function StorageImage({ storagePath }: { storagePath: string }) {
  const storage = useStorageSource();
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    if (storagePath) {
      storage.getDownloadURL(storagePath).then((res) => setUrl(res));
    }
  }, [storage, storagePath]);

  if (!storagePath) return <></>;

  return (
    <img
      alt={'Generic'}
      style={{
        objectFit: 'contain',
        width: '100%',
        height: '100%',
      }}
      src={url}
    />
  );
}

export function Text({ markdownText }: { markdownText: string }) {
  if (!markdownText) return <></>;

  return (
    <Container maxWidth={'sm'}>
      <Box mt={6} mb={6}>
        <Markdown source={markdownText} />
      </Box>
    </Container>
  );
}

export function Products({ references }: { references: EntityReference[] }) {
  const [products, setProducts] = useState<Entity<Product>[] | undefined>();
  const dataSource = useDataSource();

  useEffect(() => {
    if (references) {
      Promise.all(
        references.map((ref) =>
          dataSource.fetchEntity({
            path: ref.path,
            entityId: ref.id,
            schema: productSchema,
          })
        )
      )
        .then((results) => results.filter((r) => !!r) as Entity<Product>[])
        .then((results) => setProducts(results));
    }
  }, [references, dataSource]);

  if (!references) return <></>;

  if (!products) return <CircularProgress />;

  return (
    <Box>
      {products.map((p, index) => (
        <ProductPreview
          key={`products_${index}`}
          productValues={p.values as EntityValues<Product>}
        />
      ))}
    </Box>
  );
}

export function ProductPreview({
  productValues,
}: {
  productValues: EntityValues<Product>;
}) {
  if (!productValues) return <></>;

  return (
    <CardActionArea
      style={{
        width: '400px',
        height: '400px',
        margin: '16px',
        boxShadow: 'rgb(0 0 0 / 8%) 0px 8px 12px -4px',
      }}
    >
      <CardContent
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box flexGrow={1} flexShrink={1} flexBasis={296} p={2} maxHeight={296}>
          <StorageImage storagePath={productValues.main_image} />
        </Box>
        <Typography
          gutterBottom
          variant="h6"
          noWrap
          style={{
            marginTop: '16px',
          }}
        >
          {productValues.name}
        </Typography>

        <Typography variant="body2" color="textSecondary" component="div">
          {productValues.price} {productValues.currency}
        </Typography>
      </CardContent>
    </CardActionArea>
  );
}
