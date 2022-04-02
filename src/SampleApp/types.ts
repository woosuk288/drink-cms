import { EntityReference } from '@camberi/firecms';

export type Product = {
  name: string;
  main_image: string;
  category: string;
  available: boolean;
  price: number;
  currency: string;
  public: boolean;
  brand: string;
  description: string;
  amazon_link: string;
  images: string[];
  related_products: EntityReference[];
  publisher: {
    name: string;
    external_id: string;
  };
  available_locales: string[];
  uppercase_name: string;
  added_on: Date;
};

export type Locale = {
  name: string;
  description: string;
  selectable?: boolean;
  video: string;
};

export type Coffee = {
  name: string;
  image_url: string;
  description: string;
  tags: string[];
  taste_body: string;
  taste_sweet: string;
  taste_bitter: string;
  taste_sour: string;
  type: string;
  roasting: string;
  roasting_date: Date;
  process: string;

  public: boolean;
  brand: string;
  company: EntityReference;
  related_coffee: EntityReference[];

  uid: string;
  created_at: Date;
};

export type Company = {
  // id: string;
  businessNumber: string;
  company_name: string;
  president_name: string;
  opening_date: string;
  business_licence: string;
  telephone: string;

  // is_valid: boolean;
  uid: string;
  updatedd_at?: string;
  created_at: Date; //string;

  logo: string;
  description: string;
  address: string;
  email: string;
  images: string[];
};
