// import CustomColorTextField from "../custom_field/CustomColorTextField";
import {
  buildProperty,
  buildSchema,
  ExportMappingFunction,
} from '@camberi/firecms';
import { BlogEntryPreview } from '../custom_schema_view/BlogEntryPreview';

export type BlogEntry = {
  name: string;
  image_url: string;
  content: any[];
  // gold_text: string,
  created_at: Date;
  publish_date: Date;
  // reviewed: boolean,
  status: string;
  tags: string[];
};

export const blogSchema = buildSchema<BlogEntry>({
  name: 'Blog entry',
  views: [
    {
      path: 'preview',
      name: 'Preview',
      builder: (props) => <BlogEntryPreview {...props} />,
    },
  ],
  properties: {
    name: buildProperty({
      title: '제목',
      validation: { required: true },
      dataType: 'string',
    }),
    image_url: buildProperty({
      title: '이미지',
      dataType: 'string',
      config: {
        storageMeta: {
          mediaType: 'image',
          storagePath: 'images',
          acceptedFiles: ['image/*'],
          metadata: {
            cacheControl: 'max-age=1000000',
          },
          storeUrl: true,
        },
      },
    }),
    status: buildProperty(({ values }) => ({
      title: 'Status',
      validation: { required: true },
      dataType: 'string',
      columnWidth: 140,
      config: {
        enumValues: {
          published: {
            label: 'Published',
            disabled: !values.image_url || !values.name,
          },
          draft: 'Draft',
        },
      },
    })),
    created_at: {
      title: '생성일자',
      dataType: 'timestamp',
      autoValue: 'on_create',
    },
    content: buildProperty({
      title: '본문 내용',
      description:
        'Example of a complex array with multiple properties as children',
      validation: { required: true },
      dataType: 'array',
      columnWidth: 400,
      oneOf: {
        typeField: 'type',
        valueField: 'value',
        properties: {
          // images: {
          //   title: 'Images',
          //   dataType: 'array',
          //   of: {
          //     dataType: 'string',
          //     config: {
          //       storageMeta: {
          //         mediaType: 'image',
          //         storagePath: 'images',
          //         acceptedFiles: ['image/*'],
          //         metadata: {
          //           cacheControl: 'max-age=1000000',
          //         },
          //         storeUrl: true,
          //       },
          //     },
          //   },
          //   description:
          //     'This fields allows uploading multiple images at once and reordering',
          // },
          image: {
            title: '이미지 첨부',
            dataType: 'string',
            config: {
              storageMeta: {
                mediaType: 'image',
                storagePath: 'images',
                acceptedFiles: ['image/*'],
                metadata: {
                  cacheControl: 'max-age=1000000',
                },
                storeUrl: true,
              },
            },
          },
          text: {
            dataType: 'string',
            title: 'Markdown Text',
            config: {
              markdown: true,
            },
          },
          products: {
            title: 'Products',
            dataType: 'array',
            of: {
              dataType: 'reference',
              path: 'products',
              previewProperties: ['name', 'main_image'],
            },
          },
        },
      },
    }),
    // gold_text: buildProperty({
    //     title: "Gold text",
    //     description: "This field is using a custom component defined by the developer",
    //     dataType: "string",
    //     config: {
    //         Field: CustomColorTextField,
    //         customProps: {
    //             color: "gold"
    //         }
    //     }
    // }),

    // reviewed: buildProperty({
    //     title: "Reviewed",
    //     dataType: "boolean"
    // }),
    tags: {
      title: 'Tags',
      description: 'Example of generic array',
      dataType: 'array',
      of: {
        dataType: 'string',
        config: {
          previewAsTag: true,
        },
      },
    },
    publish_date: buildProperty({
      title: 'Publish date',
      dataType: 'timestamp',
    }),
  },
  defaultValues: {
    status: 'draft',
    // tags: ['default tag'],
  },
});

/**
 * Sample field that will be added to the export
 */
export const sampleAdditionalExportColumn: ExportMappingFunction = {
  key: 'extra',
  builder: async ({ entity }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 'Additional exported value ' + entity.id;
  },
};
