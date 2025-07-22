import {
  CheckHealthData,
  CreateBlogPostData,
  CreateBlogPostError,
  CreateBlogPostRequest,
  DeleteBlogPostData,
  DeleteBlogPostError,
  DeleteBlogPostParams,
  GetBlogPostData,
  GetBlogPostError,
  GetBlogPostParams,
  GetBlogPostsData,
  GetBlogPostsError,
  GetBlogPostsParams,
  GetCategoriesData,
  GetDraftPostsData,
  GetDraftPostsError,
  GetDraftPostsParams,
  GetTagsData,
  UpdateBlogPostData,
  UpdateBlogPostError,
  UpdateBlogPostParams,
  UpdateBlogPostRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get published blog posts with pagination and optional search/filtering
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_blog_posts
   * @summary Get Blog Posts
   * @request GET:/routes/blog/posts
   */
  get_blog_posts = (query: GetBlogPostsParams, params: RequestParams = {}) =>
    this.request<GetBlogPostsData, GetBlogPostsError>({
      path: `/routes/blog/posts`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Create a new blog post
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name create_blog_post
   * @summary Create Blog Post
   * @request POST:/routes/blog/posts
   */
  create_blog_post = (data: CreateBlogPostRequest, params: RequestParams = {}) =>
    this.request<CreateBlogPostData, CreateBlogPostError>({
      path: `/routes/blog/posts`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get a single blog post by slug and increment view count
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_blog_post
   * @summary Get Blog Post
   * @request GET:/routes/blog/posts/{slug}
   */
  get_blog_post = ({ slug, ...query }: GetBlogPostParams, params: RequestParams = {}) =>
    this.request<GetBlogPostData, GetBlogPostError>({
      path: `/routes/blog/posts/${slug}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all unique categories from published posts
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_categories
   * @summary Get Categories
   * @request GET:/routes/blog/categories
   */
  get_categories = (params: RequestParams = {}) =>
    this.request<GetCategoriesData, any>({
      path: `/routes/blog/categories`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all unique tags from published posts
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_tags
   * @summary Get Tags
   * @request GET:/routes/blog/tags
   */
  get_tags = (params: RequestParams = {}) =>
    this.request<GetTagsData, any>({
      path: `/routes/blog/tags`,
      method: "GET",
      ...params,
    });

  /**
   * @description Update an existing blog post
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name update_blog_post
   * @summary Update Blog Post
   * @request PUT:/routes/blog/posts/{post_id}
   */
  update_blog_post = (
    { postId, ...query }: UpdateBlogPostParams,
    data: UpdateBlogPostRequest,
    params: RequestParams = {},
  ) =>
    this.request<UpdateBlogPostData, UpdateBlogPostError>({
      path: `/routes/blog/posts/${postId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Delete a blog post
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name delete_blog_post
   * @summary Delete Blog Post
   * @request DELETE:/routes/blog/posts/{post_id}
   */
  delete_blog_post = ({ postId, ...query }: DeleteBlogPostParams, params: RequestParams = {}) =>
    this.request<DeleteBlogPostData, DeleteBlogPostError>({
      path: `/routes/blog/posts/${postId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description Get user's draft posts
   *
   * @tags dbtn/module:blog_posts, dbtn/hasAuth
   * @name get_draft_posts
   * @summary Get Draft Posts
   * @request GET:/routes/blog/posts/drafts
   */
  get_draft_posts = (query: GetDraftPostsParams, params: RequestParams = {}) =>
    this.request<GetDraftPostsData, GetDraftPostsError>({
      path: `/routes/blog/posts/drafts`,
      method: "GET",
      query: query,
      ...params,
    });
}
