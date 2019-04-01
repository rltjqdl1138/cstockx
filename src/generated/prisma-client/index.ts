// Code generated by Prisma (prisma@1.29.2). DO NOT EDIT.
// Please don't change this file manually but run `prisma generate` to update it.
// For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

import { DocumentNode } from "graphql";
import {
  makePrismaClientClass,
  BaseClientOptions,
  Model
} from "prisma-client-lib";
import { typeDefs } from "./prisma-schema";

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export interface Exists {
  product: (where?: ProductWhereInput) => Promise<boolean>;
  uRL: (where?: URLWhereInput) => Promise<boolean>;
}

export interface Node {}

export type FragmentableArray<T> = Promise<Array<T>> & Fragmentable;

export interface Fragmentable {
  $fragment<T>(fragment: string | DocumentNode): Promise<T>;
}

export interface Prisma {
  $exists: Exists;
  $graphql: <T = any>(
    query: string,
    variables?: { [key: string]: any }
  ) => Promise<T>;

  /**
   * Queries
   */

  product: (where: ProductWhereUniqueInput) => ProductPromise;
  products: (
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<Product>;
  productsConnection: (
    args?: {
      where?: ProductWhereInput;
      orderBy?: ProductOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => ProductConnectionPromise;
  uRL: (where: URLWhereUniqueInput) => URLPromise;
  uRLs: (
    args?: {
      where?: URLWhereInput;
      orderBy?: URLOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => FragmentableArray<URL>;
  uRLsConnection: (
    args?: {
      where?: URLWhereInput;
      orderBy?: URLOrderByInput;
      skip?: Int;
      after?: String;
      before?: String;
      first?: Int;
      last?: Int;
    }
  ) => URLConnectionPromise;
  node: (args: { id: ID_Output }) => Node;

  /**
   * Mutations
   */

  createProduct: (data: ProductCreateInput) => ProductPromise;
  updateProduct: (
    args: { data: ProductUpdateInput; where: ProductWhereUniqueInput }
  ) => ProductPromise;
  updateManyProducts: (
    args: { data: ProductUpdateManyMutationInput; where?: ProductWhereInput }
  ) => BatchPayloadPromise;
  upsertProduct: (
    args: {
      where: ProductWhereUniqueInput;
      create: ProductCreateInput;
      update: ProductUpdateInput;
    }
  ) => ProductPromise;
  deleteProduct: (where: ProductWhereUniqueInput) => ProductPromise;
  deleteManyProducts: (where?: ProductWhereInput) => BatchPayloadPromise;
  createURL: (data: URLCreateInput) => URLPromise;
  updateURL: (
    args: { data: URLUpdateInput; where: URLWhereUniqueInput }
  ) => URLPromise;
  updateManyURLs: (
    args: { data: URLUpdateManyMutationInput; where?: URLWhereInput }
  ) => BatchPayloadPromise;
  upsertURL: (
    args: {
      where: URLWhereUniqueInput;
      create: URLCreateInput;
      update: URLUpdateInput;
    }
  ) => URLPromise;
  deleteURL: (where: URLWhereUniqueInput) => URLPromise;
  deleteManyURLs: (where?: URLWhereInput) => BatchPayloadPromise;

  /**
   * Subscriptions
   */

  $subscribe: Subscription;
}

export interface Subscription {
  product: (
    where?: ProductSubscriptionWhereInput
  ) => ProductSubscriptionPayloadSubscription;
  uRL: (
    where?: URLSubscriptionWhereInput
  ) => URLSubscriptionPayloadSubscription;
}

export interface ClientConstructor<T> {
  new (options?: BaseClientOptions): T;
}

/**
 * Types
 */

export type ProductOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "uuid_ASC"
  | "uuid_DESC"
  | "brand_ASC"
  | "brand_DESC"
  | "category_ASC"
  | "category_DESC"
  | "shoe_ASC"
  | "shoe_DESC"
  | "name_ASC"
  | "name_DESC"
  | "title_ASC"
  | "title_DESC"
  | "urlKey_ASC"
  | "urlKey_DESC"
  | "urlForCheck_ASC"
  | "urlForCheck_DESC"
  | "imgURL_ASC"
  | "imgURL_DESC"
  | "releaseDate_ASC"
  | "releaseDate_DESC"
  | "retailPrice_ASC"
  | "retailPrice_DESC"
  | "rawData_ASC"
  | "rawData_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC";

export type URLOrderByInput =
  | "id_ASC"
  | "id_DESC"
  | "url_ASC"
  | "url_DESC"
  | "ProductAmount_ASC"
  | "ProductAmount_DESC"
  | "lastPage_ASC"
  | "lastPage_DESC"
  | "createdAt_ASC"
  | "createdAt_DESC"
  | "updatedAt_ASC"
  | "updatedAt_DESC"
  | "isComplete_ASC"
  | "isComplete_DESC";

export type MutationType = "CREATED" | "UPDATED" | "DELETED";

export interface URLCreateInput {
  url: String;
  ProductAmount: Int;
  lastPage: Int;
  isComplete: Boolean;
}

export interface URLWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  url?: String;
  url_not?: String;
  url_in?: String[] | String;
  url_not_in?: String[] | String;
  url_lt?: String;
  url_lte?: String;
  url_gt?: String;
  url_gte?: String;
  url_contains?: String;
  url_not_contains?: String;
  url_starts_with?: String;
  url_not_starts_with?: String;
  url_ends_with?: String;
  url_not_ends_with?: String;
  ProductAmount?: Int;
  ProductAmount_not?: Int;
  ProductAmount_in?: Int[] | Int;
  ProductAmount_not_in?: Int[] | Int;
  ProductAmount_lt?: Int;
  ProductAmount_lte?: Int;
  ProductAmount_gt?: Int;
  ProductAmount_gte?: Int;
  lastPage?: Int;
  lastPage_not?: Int;
  lastPage_in?: Int[] | Int;
  lastPage_not_in?: Int[] | Int;
  lastPage_lt?: Int;
  lastPage_lte?: Int;
  lastPage_gt?: Int;
  lastPage_gte?: Int;
  createdAt?: DateTimeInput;
  createdAt_not?: DateTimeInput;
  createdAt_in?: DateTimeInput[] | DateTimeInput;
  createdAt_not_in?: DateTimeInput[] | DateTimeInput;
  createdAt_lt?: DateTimeInput;
  createdAt_lte?: DateTimeInput;
  createdAt_gt?: DateTimeInput;
  createdAt_gte?: DateTimeInput;
  updatedAt?: DateTimeInput;
  updatedAt_not?: DateTimeInput;
  updatedAt_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_not_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_lt?: DateTimeInput;
  updatedAt_lte?: DateTimeInput;
  updatedAt_gt?: DateTimeInput;
  updatedAt_gte?: DateTimeInput;
  isComplete?: Boolean;
  isComplete_not?: Boolean;
  AND?: URLWhereInput[] | URLWhereInput;
  OR?: URLWhereInput[] | URLWhereInput;
  NOT?: URLWhereInput[] | URLWhereInput;
}

export interface ProductUpdateInput {
  uuid?: String;
  brand?: String;
  category?: String;
  shoe?: String;
  name?: String;
  title?: String;
  urlKey?: String;
  urlForCheck?: String;
  imgURL?: String;
  releaseDate?: DateTimeInput;
  retailPrice?: Int;
  rawData?: Json;
}

export type ProductWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface URLUpdateInput {
  url?: String;
  ProductAmount?: Int;
  lastPage?: Int;
  isComplete?: Boolean;
}

export interface ProductSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: ProductWhereInput;
  AND?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
  OR?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
  NOT?: ProductSubscriptionWhereInput[] | ProductSubscriptionWhereInput;
}

export type URLWhereUniqueInput = AtLeastOne<{
  id: ID_Input;
}>;

export interface ProductCreateInput {
  uuid: String;
  brand: String;
  category: String;
  shoe: String;
  name: String;
  title: String;
  urlKey: String;
  urlForCheck: String;
  imgURL?: String;
  releaseDate?: DateTimeInput;
  retailPrice?: Int;
  rawData: Json;
}

export interface ProductWhereInput {
  id?: ID_Input;
  id_not?: ID_Input;
  id_in?: ID_Input[] | ID_Input;
  id_not_in?: ID_Input[] | ID_Input;
  id_lt?: ID_Input;
  id_lte?: ID_Input;
  id_gt?: ID_Input;
  id_gte?: ID_Input;
  id_contains?: ID_Input;
  id_not_contains?: ID_Input;
  id_starts_with?: ID_Input;
  id_not_starts_with?: ID_Input;
  id_ends_with?: ID_Input;
  id_not_ends_with?: ID_Input;
  uuid?: String;
  uuid_not?: String;
  uuid_in?: String[] | String;
  uuid_not_in?: String[] | String;
  uuid_lt?: String;
  uuid_lte?: String;
  uuid_gt?: String;
  uuid_gte?: String;
  uuid_contains?: String;
  uuid_not_contains?: String;
  uuid_starts_with?: String;
  uuid_not_starts_with?: String;
  uuid_ends_with?: String;
  uuid_not_ends_with?: String;
  brand?: String;
  brand_not?: String;
  brand_in?: String[] | String;
  brand_not_in?: String[] | String;
  brand_lt?: String;
  brand_lte?: String;
  brand_gt?: String;
  brand_gte?: String;
  brand_contains?: String;
  brand_not_contains?: String;
  brand_starts_with?: String;
  brand_not_starts_with?: String;
  brand_ends_with?: String;
  brand_not_ends_with?: String;
  category?: String;
  category_not?: String;
  category_in?: String[] | String;
  category_not_in?: String[] | String;
  category_lt?: String;
  category_lte?: String;
  category_gt?: String;
  category_gte?: String;
  category_contains?: String;
  category_not_contains?: String;
  category_starts_with?: String;
  category_not_starts_with?: String;
  category_ends_with?: String;
  category_not_ends_with?: String;
  shoe?: String;
  shoe_not?: String;
  shoe_in?: String[] | String;
  shoe_not_in?: String[] | String;
  shoe_lt?: String;
  shoe_lte?: String;
  shoe_gt?: String;
  shoe_gte?: String;
  shoe_contains?: String;
  shoe_not_contains?: String;
  shoe_starts_with?: String;
  shoe_not_starts_with?: String;
  shoe_ends_with?: String;
  shoe_not_ends_with?: String;
  name?: String;
  name_not?: String;
  name_in?: String[] | String;
  name_not_in?: String[] | String;
  name_lt?: String;
  name_lte?: String;
  name_gt?: String;
  name_gte?: String;
  name_contains?: String;
  name_not_contains?: String;
  name_starts_with?: String;
  name_not_starts_with?: String;
  name_ends_with?: String;
  name_not_ends_with?: String;
  title?: String;
  title_not?: String;
  title_in?: String[] | String;
  title_not_in?: String[] | String;
  title_lt?: String;
  title_lte?: String;
  title_gt?: String;
  title_gte?: String;
  title_contains?: String;
  title_not_contains?: String;
  title_starts_with?: String;
  title_not_starts_with?: String;
  title_ends_with?: String;
  title_not_ends_with?: String;
  urlKey?: String;
  urlKey_not?: String;
  urlKey_in?: String[] | String;
  urlKey_not_in?: String[] | String;
  urlKey_lt?: String;
  urlKey_lte?: String;
  urlKey_gt?: String;
  urlKey_gte?: String;
  urlKey_contains?: String;
  urlKey_not_contains?: String;
  urlKey_starts_with?: String;
  urlKey_not_starts_with?: String;
  urlKey_ends_with?: String;
  urlKey_not_ends_with?: String;
  urlForCheck?: String;
  urlForCheck_not?: String;
  urlForCheck_in?: String[] | String;
  urlForCheck_not_in?: String[] | String;
  urlForCheck_lt?: String;
  urlForCheck_lte?: String;
  urlForCheck_gt?: String;
  urlForCheck_gte?: String;
  urlForCheck_contains?: String;
  urlForCheck_not_contains?: String;
  urlForCheck_starts_with?: String;
  urlForCheck_not_starts_with?: String;
  urlForCheck_ends_with?: String;
  urlForCheck_not_ends_with?: String;
  imgURL?: String;
  imgURL_not?: String;
  imgURL_in?: String[] | String;
  imgURL_not_in?: String[] | String;
  imgURL_lt?: String;
  imgURL_lte?: String;
  imgURL_gt?: String;
  imgURL_gte?: String;
  imgURL_contains?: String;
  imgURL_not_contains?: String;
  imgURL_starts_with?: String;
  imgURL_not_starts_with?: String;
  imgURL_ends_with?: String;
  imgURL_not_ends_with?: String;
  releaseDate?: DateTimeInput;
  releaseDate_not?: DateTimeInput;
  releaseDate_in?: DateTimeInput[] | DateTimeInput;
  releaseDate_not_in?: DateTimeInput[] | DateTimeInput;
  releaseDate_lt?: DateTimeInput;
  releaseDate_lte?: DateTimeInput;
  releaseDate_gt?: DateTimeInput;
  releaseDate_gte?: DateTimeInput;
  retailPrice?: Int;
  retailPrice_not?: Int;
  retailPrice_in?: Int[] | Int;
  retailPrice_not_in?: Int[] | Int;
  retailPrice_lt?: Int;
  retailPrice_lte?: Int;
  retailPrice_gt?: Int;
  retailPrice_gte?: Int;
  createdAt?: DateTimeInput;
  createdAt_not?: DateTimeInput;
  createdAt_in?: DateTimeInput[] | DateTimeInput;
  createdAt_not_in?: DateTimeInput[] | DateTimeInput;
  createdAt_lt?: DateTimeInput;
  createdAt_lte?: DateTimeInput;
  createdAt_gt?: DateTimeInput;
  createdAt_gte?: DateTimeInput;
  updatedAt?: DateTimeInput;
  updatedAt_not?: DateTimeInput;
  updatedAt_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_not_in?: DateTimeInput[] | DateTimeInput;
  updatedAt_lt?: DateTimeInput;
  updatedAt_lte?: DateTimeInput;
  updatedAt_gt?: DateTimeInput;
  updatedAt_gte?: DateTimeInput;
  AND?: ProductWhereInput[] | ProductWhereInput;
  OR?: ProductWhereInput[] | ProductWhereInput;
  NOT?: ProductWhereInput[] | ProductWhereInput;
}

export interface ProductUpdateManyMutationInput {
  uuid?: String;
  brand?: String;
  category?: String;
  shoe?: String;
  name?: String;
  title?: String;
  urlKey?: String;
  urlForCheck?: String;
  imgURL?: String;
  releaseDate?: DateTimeInput;
  retailPrice?: Int;
  rawData?: Json;
}

export interface URLSubscriptionWhereInput {
  mutation_in?: MutationType[] | MutationType;
  updatedFields_contains?: String;
  updatedFields_contains_every?: String[] | String;
  updatedFields_contains_some?: String[] | String;
  node?: URLWhereInput;
  AND?: URLSubscriptionWhereInput[] | URLSubscriptionWhereInput;
  OR?: URLSubscriptionWhereInput[] | URLSubscriptionWhereInput;
  NOT?: URLSubscriptionWhereInput[] | URLSubscriptionWhereInput;
}

export interface URLUpdateManyMutationInput {
  url?: String;
  ProductAmount?: Int;
  lastPage?: Int;
  isComplete?: Boolean;
}

export interface NodeNode {
  id: ID_Output;
}

export interface URLConnection {
  pageInfo: PageInfo;
  edges: URLEdge[];
}

export interface URLConnectionPromise
  extends Promise<URLConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<URLEdge>>() => T;
  aggregate: <T = AggregateURLPromise>() => T;
}

export interface URLConnectionSubscription
  extends Promise<AsyncIterator<URLConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<URLEdgeSubscription>>>() => T;
  aggregate: <T = AggregateURLSubscription>() => T;
}

export interface ProductConnection {
  pageInfo: PageInfo;
  edges: ProductEdge[];
}

export interface ProductConnectionPromise
  extends Promise<ProductConnection>,
    Fragmentable {
  pageInfo: <T = PageInfoPromise>() => T;
  edges: <T = FragmentableArray<ProductEdge>>() => T;
  aggregate: <T = AggregateProductPromise>() => T;
}

export interface ProductConnectionSubscription
  extends Promise<AsyncIterator<ProductConnection>>,
    Fragmentable {
  pageInfo: <T = PageInfoSubscription>() => T;
  edges: <T = Promise<AsyncIterator<ProductEdgeSubscription>>>() => T;
  aggregate: <T = AggregateProductSubscription>() => T;
}

export interface URLPreviousValues {
  id: ID_Output;
  url: String;
  ProductAmount: Int;
  lastPage: Int;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
  isComplete: Boolean;
}

export interface URLPreviousValuesPromise
  extends Promise<URLPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  url: () => Promise<String>;
  ProductAmount: () => Promise<Int>;
  lastPage: () => Promise<Int>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
  isComplete: () => Promise<Boolean>;
}

export interface URLPreviousValuesSubscription
  extends Promise<AsyncIterator<URLPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  url: () => Promise<AsyncIterator<String>>;
  ProductAmount: () => Promise<AsyncIterator<Int>>;
  lastPage: () => Promise<AsyncIterator<Int>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  isComplete: () => Promise<AsyncIterator<Boolean>>;
}

export interface URL {
  id: ID_Output;
  url: String;
  ProductAmount: Int;
  lastPage: Int;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
  isComplete: Boolean;
}

export interface URLPromise extends Promise<URL>, Fragmentable {
  id: () => Promise<ID_Output>;
  url: () => Promise<String>;
  ProductAmount: () => Promise<Int>;
  lastPage: () => Promise<Int>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
  isComplete: () => Promise<Boolean>;
}

export interface URLSubscription
  extends Promise<AsyncIterator<URL>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  url: () => Promise<AsyncIterator<String>>;
  ProductAmount: () => Promise<AsyncIterator<Int>>;
  lastPage: () => Promise<AsyncIterator<Int>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  isComplete: () => Promise<AsyncIterator<Boolean>>;
}

export interface URLEdge {
  node: URL;
  cursor: String;
}

export interface URLEdgePromise extends Promise<URLEdge>, Fragmentable {
  node: <T = URLPromise>() => T;
  cursor: () => Promise<String>;
}

export interface URLEdgeSubscription
  extends Promise<AsyncIterator<URLEdge>>,
    Fragmentable {
  node: <T = URLSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface ProductSubscriptionPayload {
  mutation: MutationType;
  node: Product;
  updatedFields: String[];
  previousValues: ProductPreviousValues;
}

export interface ProductSubscriptionPayloadPromise
  extends Promise<ProductSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = ProductPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = ProductPreviousValuesPromise>() => T;
}

export interface ProductSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<ProductSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = ProductSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = ProductPreviousValuesSubscription>() => T;
}

export interface ProductEdge {
  node: Product;
  cursor: String;
}

export interface ProductEdgePromise extends Promise<ProductEdge>, Fragmentable {
  node: <T = ProductPromise>() => T;
  cursor: () => Promise<String>;
}

export interface ProductEdgeSubscription
  extends Promise<AsyncIterator<ProductEdge>>,
    Fragmentable {
  node: <T = ProductSubscription>() => T;
  cursor: () => Promise<AsyncIterator<String>>;
}

export interface AggregateURL {
  count: Int;
}

export interface AggregateURLPromise
  extends Promise<AggregateURL>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateURLSubscription
  extends Promise<AsyncIterator<AggregateURL>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

export interface ProductPreviousValues {
  id: ID_Output;
  uuid: String;
  brand: String;
  category: String;
  shoe: String;
  name: String;
  title: String;
  urlKey: String;
  urlForCheck: String;
  imgURL?: String;
  releaseDate?: DateTimeOutput;
  retailPrice?: Int;
  rawData: Json;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
}

export interface ProductPreviousValuesPromise
  extends Promise<ProductPreviousValues>,
    Fragmentable {
  id: () => Promise<ID_Output>;
  uuid: () => Promise<String>;
  brand: () => Promise<String>;
  category: () => Promise<String>;
  shoe: () => Promise<String>;
  name: () => Promise<String>;
  title: () => Promise<String>;
  urlKey: () => Promise<String>;
  urlForCheck: () => Promise<String>;
  imgURL: () => Promise<String>;
  releaseDate: () => Promise<DateTimeOutput>;
  retailPrice: () => Promise<Int>;
  rawData: () => Promise<Json>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
}

export interface ProductPreviousValuesSubscription
  extends Promise<AsyncIterator<ProductPreviousValues>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  uuid: () => Promise<AsyncIterator<String>>;
  brand: () => Promise<AsyncIterator<String>>;
  category: () => Promise<AsyncIterator<String>>;
  shoe: () => Promise<AsyncIterator<String>>;
  name: () => Promise<AsyncIterator<String>>;
  title: () => Promise<AsyncIterator<String>>;
  urlKey: () => Promise<AsyncIterator<String>>;
  urlForCheck: () => Promise<AsyncIterator<String>>;
  imgURL: () => Promise<AsyncIterator<String>>;
  releaseDate: () => Promise<AsyncIterator<DateTimeOutput>>;
  retailPrice: () => Promise<AsyncIterator<Int>>;
  rawData: () => Promise<AsyncIterator<Json>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
}

export interface Product {
  id: ID_Output;
  uuid: String;
  brand: String;
  category: String;
  shoe: String;
  name: String;
  title: String;
  urlKey: String;
  urlForCheck: String;
  imgURL?: String;
  releaseDate?: DateTimeOutput;
  retailPrice?: Int;
  rawData: Json;
  createdAt: DateTimeOutput;
  updatedAt: DateTimeOutput;
}

export interface ProductPromise extends Promise<Product>, Fragmentable {
  id: () => Promise<ID_Output>;
  uuid: () => Promise<String>;
  brand: () => Promise<String>;
  category: () => Promise<String>;
  shoe: () => Promise<String>;
  name: () => Promise<String>;
  title: () => Promise<String>;
  urlKey: () => Promise<String>;
  urlForCheck: () => Promise<String>;
  imgURL: () => Promise<String>;
  releaseDate: () => Promise<DateTimeOutput>;
  retailPrice: () => Promise<Int>;
  rawData: () => Promise<Json>;
  createdAt: () => Promise<DateTimeOutput>;
  updatedAt: () => Promise<DateTimeOutput>;
}

export interface ProductSubscription
  extends Promise<AsyncIterator<Product>>,
    Fragmentable {
  id: () => Promise<AsyncIterator<ID_Output>>;
  uuid: () => Promise<AsyncIterator<String>>;
  brand: () => Promise<AsyncIterator<String>>;
  category: () => Promise<AsyncIterator<String>>;
  shoe: () => Promise<AsyncIterator<String>>;
  name: () => Promise<AsyncIterator<String>>;
  title: () => Promise<AsyncIterator<String>>;
  urlKey: () => Promise<AsyncIterator<String>>;
  urlForCheck: () => Promise<AsyncIterator<String>>;
  imgURL: () => Promise<AsyncIterator<String>>;
  releaseDate: () => Promise<AsyncIterator<DateTimeOutput>>;
  retailPrice: () => Promise<AsyncIterator<Int>>;
  rawData: () => Promise<AsyncIterator<Json>>;
  createdAt: () => Promise<AsyncIterator<DateTimeOutput>>;
  updatedAt: () => Promise<AsyncIterator<DateTimeOutput>>;
}

export interface BatchPayload {
  count: Long;
}

export interface BatchPayloadPromise
  extends Promise<BatchPayload>,
    Fragmentable {
  count: () => Promise<Long>;
}

export interface BatchPayloadSubscription
  extends Promise<AsyncIterator<BatchPayload>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Long>>;
}

export interface PageInfo {
  hasNextPage: Boolean;
  hasPreviousPage: Boolean;
  startCursor?: String;
  endCursor?: String;
}

export interface PageInfoPromise extends Promise<PageInfo>, Fragmentable {
  hasNextPage: () => Promise<Boolean>;
  hasPreviousPage: () => Promise<Boolean>;
  startCursor: () => Promise<String>;
  endCursor: () => Promise<String>;
}

export interface PageInfoSubscription
  extends Promise<AsyncIterator<PageInfo>>,
    Fragmentable {
  hasNextPage: () => Promise<AsyncIterator<Boolean>>;
  hasPreviousPage: () => Promise<AsyncIterator<Boolean>>;
  startCursor: () => Promise<AsyncIterator<String>>;
  endCursor: () => Promise<AsyncIterator<String>>;
}

export interface URLSubscriptionPayload {
  mutation: MutationType;
  node: URL;
  updatedFields: String[];
  previousValues: URLPreviousValues;
}

export interface URLSubscriptionPayloadPromise
  extends Promise<URLSubscriptionPayload>,
    Fragmentable {
  mutation: () => Promise<MutationType>;
  node: <T = URLPromise>() => T;
  updatedFields: () => Promise<String[]>;
  previousValues: <T = URLPreviousValuesPromise>() => T;
}

export interface URLSubscriptionPayloadSubscription
  extends Promise<AsyncIterator<URLSubscriptionPayload>>,
    Fragmentable {
  mutation: () => Promise<AsyncIterator<MutationType>>;
  node: <T = URLSubscription>() => T;
  updatedFields: () => Promise<AsyncIterator<String[]>>;
  previousValues: <T = URLPreviousValuesSubscription>() => T;
}

export interface AggregateProduct {
  count: Int;
}

export interface AggregateProductPromise
  extends Promise<AggregateProduct>,
    Fragmentable {
  count: () => Promise<Int>;
}

export interface AggregateProductSubscription
  extends Promise<AsyncIterator<AggregateProduct>>,
    Fragmentable {
  count: () => Promise<AsyncIterator<Int>>;
}

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 
*/
export type Int = number;

export type Json = any;

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean;

export type Long = string;

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number;
export type ID_Output = string;

/*
DateTime scalar input type, allowing Date
*/
export type DateTimeInput = Date | string;

/*
DateTime scalar output type, which is always a string
*/
export type DateTimeOutput = string;

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string;

/**
 * Model Metadata
 */

export const models: Model[] = [
  {
    name: "Product",
    embedded: false
  },
  {
    name: "URL",
    embedded: false
  }
];

/**
 * Type Defs
 */

export const Prisma = makePrismaClientClass<ClientConstructor<Prisma>>({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
export const prisma = new Prisma();
