import {
  CheckHealthData,
  CreateBlogPostData,
  CreateBlogPostRequest,
  DeleteBlogPostData,
  GetBlogPostData,
  GetBlogPostsData,
  GetCategoriesData,
  GetDraftPostsData,
  GetTagsData,
  UpdateBlogPostData,
  UpdateBlogPostRequest,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Get published blog posts with pagination and optional search/filtering
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_blog_posts
   * @summary Get Blog Posts
   * @request GET:/routes/blog/posts
   */
  export namespace get_blog_posts {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBlogPostsData;
  }

  /**
   * @description Create a new blog post
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name create_blog_post
   * @summary Create Blog Post
   * @request POST:/routes/blog/posts
   */
  export namespace create_blog_post {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateBlogPostRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateBlogPostData;
  }

  /**
   * @description Get a single blog post by slug and increment view count
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_blog_post
   * @summary Get Blog Post
   * @request GET:/routes/blog/posts/{slug}
   */
  export namespace get_blog_post {
    export type RequestParams = {
      /** Slug */
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBlogPostData;
  }

  /**
   * @description Get all unique categories from published posts
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_categories
   * @summary Get Categories
   * @request GET:/routes/blog/categories
   */
  export namespace get_categories {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetCategoriesData;
  }

  /**
   * @description Get all unique tags from published posts
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_tags
   * @summary Get Tags
   * @request GET:/routes/blog/tags
   */
  export namespace get_tags {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTagsData;
  }

  /**
   * @description Update an existing blog post
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name update_blog_post
   * @summary Update Blog Post
   * @request PUT:/routes/blog/posts/{post_id}
   */
  export namespace update_blog_post {
    export type RequestParams = {
      /** Post Id */
      postId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateBlogPostRequest;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateBlogPostData;
  }

  /**
   * @description Delete a blog post
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name delete_blog_post
   * @summary Delete Blog Post
   * @request DELETE:/routes/blog/posts/{post_id}
   */
  export namespace delete_blog_post {
    export type RequestParams = {
      /** Post Id */
      postId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteBlogPostData;
  }

  /**
   * @description Get user's draft posts
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_draft_posts
   * @summary Get Draft Posts
   * @request GET:/routes/blog/posts/drafts
   */
  export namespace get_draft_posts {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDraftPostsData;
  }
}
