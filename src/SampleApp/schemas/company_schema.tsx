import { buildSchema } from '@camberi/firecms';
import { Company } from '../types';

export const companiesSchema = buildSchema<Company>({
  name: 'Company',

  properties: {
    businessNumber: {
      title: '사업자번호',
      dataType: 'string',
    },
    company_name: {
      title: '상호(회사명)',
      dataType: 'string',
    },
    president_name: {
      title: '대표자성명',
      dataType: 'string',
    },
    opening_date: {
      title: '개업일자',
      dataType: 'string',
    },
    business_licence: {
      title: '사업자 등록증',
      dataType: 'string',
      config: {
        storageMeta: {
          storagePath: 'test',
          acceptedFiles: ['application/pdf'],
        },
      },
    },
    //

    logo: {
      title: '로고 이미지',
      dataType: 'string',
      config: {
        storageMeta: {
          mediaType: 'image',
          storagePath: 'images',
          acceptedFiles: ['image/*'],
          metadata: {
            cacheControl: 'max-age=1000000',
          },
        },
      },
    },

    description: {
      title: '회사 소개 or 설명',
      dataType: 'string',
    },

    address: {
      title: '주소',
      dataType: 'string',
    },

    email: {
      title: '회사 이메일',
      dataType: 'string',
      validation: {
        email: true,
      },
    },
    telephone: {
      title: '회사 전화',
      dataType: 'string',
    },

    images: {
      dataType: 'array',
      title: 'Images',
      of: {
        dataType: 'string',
        config: {
          storageMeta: {
            mediaType: 'image',
            storagePath: 'images',
            acceptedFiles: ['image/*'],
            metadata: {
              cacheControl: 'max-age=1000000',
            },
          },
        },
      },
      validation: {
        min: 0,
        max: 4,
      },
      description: 'This fields allows uploading multiple images at once',
    },

    uid: {
      title: '회사 전화',
      dataType: 'string',
      readOnly: true,
    },

    created_at: {
      dataType: 'timestamp',
      title: '생성일',
      autoValue: 'on_create',
      readOnly: true,
    },

    // liked_products: {
    //     dataType: "array",
    //     title: "Liked products",
    //     description: "Products this user has liked",
    //     of: {
    //         dataType: "reference",
    //         path: "products"
    //     }
    // },
  },
});
