import {
  buildSchema,
  EntityCallbacks,
  EntityCustomView,
  EntityOnSaveProps,
} from '@camberi/firecms';

import { SampleProductsView } from '../custom_schema_view/SampleProductsView';
import { Coffee } from '../types';

const sampleView: EntityCustomView = {
  path: 'sample_custom_view',
  name: 'Custom view',
  builder: ({ schema, entity, modifiedValues }) => (
    <SampleProductsView entity={entity} modifiedValues={modifiedValues} />
  ),
};

export const coffeeSchema = buildSchema<Coffee>({
  name: 'Coffee',
  views: [sampleView],

  properties: {
    name: {
      dataType: 'string',
      title: '이름',
      validation: {
        required: true,
      },
    },

    image_url: {
      dataType: 'string',
      title: '사진',
      config: {
        storageMeta: {
          mediaType: 'image',
          storagePath: 'images',
          acceptedFiles: ['image/*'],
          fileName: (context) => {
            return new Date().toLocaleDateString() + context.file.name;
          },
          metadata: {
            cacheControl: 'max-age=1000000',
          },
          storeUrl: true,
        },
      },
      description: 'Upload field for images',
      validation: {
        required: true,
      },
    },
    description: {
      dataType: 'string',
      title: '한 줄 상품 설명',
      validation: {
        required: true,
      },
    },
    flavors: {
      title: '향미',
      description: '맛 or 향',
      dataType: 'array',
      of: {
        dataType: 'string',
        config: {
          previewAsTag: true,
        },
      },
      validation: {
        required: true,
        min: 0,
        max: 3,
      },
    },
    tags: {
      title: '태그',
      description: 'Example of generic array',
      dataType: 'array',
      of: {
        dataType: 'string',
        config: {
          previewAsTag: true,
        },
      },
      validation: {
        required: true,
        min: 0,
        max: 4,
      },
    },
    taste_body: {
      dataType: 'string',
      title: '바디감',
      config: {
        enumValues: {
          very_low: '매우 낮음',
          low: '낮음',
          average: '보통',
          high: '높음',
          very_high: '매우 높음',
        },
      },
    },
    taste_sweet: {
      dataType: 'string',
      title: '단맛',
      config: {
        enumValues: {
          very_low: '매우 낮음',
          low: '낮음',
          average: '보통',
          high: '높음',
          very_high: '매우 높음',
        },
      },
    },
    taste_bitter: {
      dataType: 'string',
      title: '쓴맛',
      config: {
        enumValues: {
          very_low: '매우 낮음',
          low: '낮음',
          average: '보통',
          high: '높음',
          very_high: '매우 높음',
        },
      },
    },
    taste_sour: {
      dataType: 'string',
      title: '신맛',
      config: {
        enumValues: {
          very_low: '매우 낮음',
          low: '낮음',
          average: '보통',
          high: '높음',
          very_high: '매우 높음',
        },
      },
    },
    type: {
      dataType: 'string',
      title: '종류',
      config: {
        enumValues: {
          blend: '블랜드',
          single_origin: '싱글오리진',
          decaffeination: '디카페인',
        },
      },
    },
    roasting: {
      dataType: 'string',
      title: '로스팅 정도',
      config: {
        enumValues: {
          light: '라이트',
          light_medium: '라이트미디엄',
          medium: '미디엄',
          medium_dark: '미디엄다크',
          dark: '다크',
        },
      },
    },

    roasting_date: {
      title: '로스팅 날짜',
      dataType: 'timestamp',
    },
    process: {
      dataType: 'string',
      title: '프로세스',
    },

    public: {
      dataType: 'boolean',
      title: '공개 여부',
      description: 'Should this coffee be visible in the website',
      // longDescription: "Example of a long description hidden under a tooltip. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis bibendum turpis. Sed scelerisque ligula nec nisi pellentesque, eget viverra lorem facilisis. Praesent a lectus ac ipsum tincidunt posuere vitae non risus. In eu feugiat massa. Sed eu est non velit facilisis facilisis vitae eget ante. Nunc ut malesuada erat. Nullam sagittis bibendum porta. Maecenas vitae interdum sapien, ut aliquet risus. Donec aliquet, turpis finibus aliquet bibendum, tellus dui porttitor quam, quis pellentesque tellus libero non urna. Vestibulum maximus pharetra congue. Suspendisse aliquam congue quam, sed bibendum turpis. Aliquam eu enim ligula. Nam vel magna ut urna cursus sagittis. Suspendisse a nisi ac justo ornare tempor vel eu eros."
    },
    // brand: {
    //   dataType: 'string',
    //   title: 'Brand or Company',
    //   validation: {
    //     required: true,
    //   },
    // },
    company: {
      dataType: 'reference',
      title: '회사',
      path: 'companies',
      previewProperties: ['company_name', 'president_name'],
      validation: {
        required: true,
        requiredMessage: '필수입니다.',
      },
    },

    company_id: {
      dataType: 'string',
      title: 'Company ID',

      disabled: {
        hidden: true,
      },
    },

    related_coffee: {
      dataType: 'array',
      title: '관련 상품들',
      description: 'Reference to self',
      of: {
        dataType: 'reference',
        path: 'coffees',
      },
      validation: {
        min: 0,
        max: 4,
      },
    },
    uid: {
      dataType: 'string',
      title: 'user id',

      disabled: {
        hidden: true,
      },
    },
    created_at: {
      dataType: 'timestamp',
      title: '생성일',
      autoValue: 'on_create',
      disabled: {
        hidden: true,
      },
    },
  },
  defaultValues: {
    currency: 'KOR',
    publisher: {
      name: 'Default publisher',
    },
  },
});

export const coffeeCallbacks: EntityCallbacks = {
  onPreSave: ({
    schema,
    path,
    entityId,
    values,
    status,
    context,
  }: EntityOnSaveProps<Coffee>) => {
    if (status === 'new') {
      values.uid = context.authController.user.uid;
    }

    if (!values.company?.id) {
      throw Error('회사를 선택하지 않았거나, 회사가 존재하지 않습니다.');
    }

    values.company_id = values.company.id;

    return values;
  },

  onSaveSuccess: (props) => {
    console.log('onSaveSuccess', props);
  },

  onDelete: (props) => {
    console.log('onDelete', props);
  },

  onPreDelete: (props) => {
    const email: string | undefined = props.context.authController.user?.email;
    if (!email || !email.endsWith('@camberi.com'))
      throw Error('Cofffe deletion not allowed in this demo');
  },
};
