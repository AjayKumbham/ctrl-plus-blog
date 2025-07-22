/** BlogPost */
export interface BlogPost {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Slug */
  slug: string;
  /** Content */
  content: string;
  /** Excerpt */
  excerpt?: string | null;
  /** Featured Image */
  featured_image?: string | null;
  /**
   * Published Date
   * @format date-time
   */
  published_date: string;
  /**
   * Created At
   * @format date-time
   */
  created_at: string;
  /**
   * Updated At
   * @format date-time
   */
  updated_at: string;
  /**
   * Categories
   * @default []
   */
  categories?: string[];
  /**
   * Tags
   * @default []
   */
  tags?: string[];
  /** Is Published */
  is_published: boolean;
  /** View Count */
  view_count: number;
}

/** BlogPostSummary */
export interface BlogPostSummary {
  /** Id */
  id: number;
  /** Title */
  title: string;
  /** Slug */
  slug: string;
  /** Excerpt */
  excerpt?: string | null;
  /** Featured Image */
  featured_image?: string | null;
  /**
   * Published Date
   * @format date-time
   */
  published_date: string;
  /**
   * Categories
   * @default []
   */
  categories?: string[];
  /**
   * Tags
   * @default []
   */
  tags?: string[];
  /** View Count */
  view_count: number;
}

/** BlogPostsResponse */
export interface BlogPostsResponse {
  /** Posts */
  posts: BlogPostSummary[];
  /** Total */
  total: number;
  /** Page */
  page: number;
  /** Per Page */
  per_page: number;
  /** Total Pages */
  total_pages: number;
}

/** CreateBlogPostRequest */
export interface CreateBlogPostRequest {
  /** Title */
  title: string;
  /** Content */
  content: string;
  /** Excerpt */
  excerpt?: string | null;
  /** Featured Image */
  featured_image?: string | null;
  /**
   * Categories
   * @default []
   */
  categories?: string[];
  /**
   * Tags
   * @default []
   */
  tags?: string[];
  /**
   * Is Published
   * @default false
   */
  is_published?: boolean;
  /** Scheduled Date */
  scheduled_date?: string | null;
  /** Meta Description */
  meta_description?: string | null;
  /**
   * Meta Keywords
   * @default []
   */
  meta_keywords?: string[];
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** UpdateBlogPostRequest */
export interface UpdateBlogPostRequest {
  /** Title */
  title?: string | null;
  /** Content */
  content?: string | null;
  /** Excerpt */
  excerpt?: string | null;
  /** Featured Image */
  featured_image?: string | null;
  /** Categories */
  categories?: string[] | null;
  /** Tags */
  tags?: string[] | null;
  /** Is Published */
  is_published?: boolean | null;
  /** Scheduled Date */
  scheduled_date?: string | null;
  /** Meta Description */
  meta_description?: string | null;
  /** Meta Keywords */
  meta_keywords?: string[] | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export interface GetBlogPostsParams {
  /**
   * Page
   * @default 1
   */
  page?: number;
  /**
   * Per Page
   * @default 10
   */
  per_page?: number;
  /** Search */
  search?: string | null;
  /** Category */
  category?: string | null;
}

export type GetBlogPostsData = BlogPostsResponse;

export type GetBlogPostsError = HTTPValidationError;

export type CreateBlogPostData = BlogPost;

export type CreateBlogPostError = HTTPValidationError;

export interface GetBlogPostParams {
  /** Slug */
  slug: string;
}

export type GetBlogPostData = BlogPost;

export type GetBlogPostError = HTTPValidationError;

export type GetCategoriesData = any;

export type GetTagsData = any;

export interface UpdateBlogPostParams {
  /** Post Id */
  postId: number;
}

export type UpdateBlogPostData = BlogPost;

export type UpdateBlogPostError = HTTPValidationError;

export interface DeleteBlogPostParams {
  /** Post Id */
  postId: number;
}

export type DeleteBlogPostData = any;

export type DeleteBlogPostError = HTTPValidationError;

export interface GetDraftPostsParams {
  /**
   * Page
   * @default 1
   */
  page?: number;
  /**
   * Per Page
   * @default 10
   */
  per_page?: number;
}

export type GetDraftPostsData = BlogPostsResponse;

export type GetDraftPostsError = HTTPValidationError;
