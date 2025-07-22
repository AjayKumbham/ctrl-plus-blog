from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
import re
from app.auth import AuthorizedUser

router = APIRouter(prefix="/blog")

class BlogPost(BaseModel):
    id: int
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    published_date: datetime
    created_at: datetime
    updated_at: datetime
    categories: List[str] = []
    tags: List[str] = []
    is_published: bool
    view_count: int

class BlogPostSummary(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    published_date: datetime
    categories: List[str] = []
    tags: List[str] = []
    view_count: int

class BlogPostsResponse(BaseModel):
    posts: List[BlogPostSummary]
    total: int
    page: int
    per_page: int
    total_pages: int

class CreateBlogPostRequest(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    categories: List[str] = []
    tags: List[str] = []
    is_published: bool = False
    scheduled_date: Optional[datetime] = None
    meta_description: Optional[str] = None
    meta_keywords: List[str] = []

class UpdateBlogPostRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    categories: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    scheduled_date: Optional[datetime] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[List[str]] = None

async def get_db_connection():
    """Get database connection"""
    database_url = db.secrets.get("DATABASE_URL_DEV")
    return await asyncpg.connect(database_url)

def generate_slug(title: str) -> str:
    """Generate URL-friendly slug from title"""
    # Convert to lowercase and replace spaces/special chars with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower().strip())
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug

@router.get("/posts", response_model=BlogPostsResponse)
async def get_blog_posts(
    page: int = 1, 
    per_page: int = 10, 
    search: Optional[str] = None,
    category: Optional[str] = None
):
    """Get published blog posts with pagination and optional search/filtering"""
    conn = await get_db_connection()
    
    try:
        # Build query conditions
        conditions = ["is_published = true"]
        params = []
        param_count = 0
        
        if search:
            param_count += 1
            conditions.append(f"(title ILIKE ${param_count} OR content ILIKE ${param_count} OR excerpt ILIKE ${param_count})")
            params.append(f"%{search}%")
        
        if category:
            param_count += 1
            conditions.append(f"${param_count} = ANY(categories)")
            params.append(category)
        
        where_clause = " AND ".join(conditions)
        
        # Get total count
        count_query = f"SELECT COUNT(*) FROM blog_posts WHERE {where_clause}"
        total = await conn.fetchval(count_query, *params)
        
        # Calculate pagination
        offset = (page - 1) * per_page
        total_pages = (total + per_page - 1) // per_page
        
        # Get posts
        query = f"""
            SELECT id, title, slug, excerpt, featured_image, published_date, 
                   categories, tags, view_count
            FROM blog_posts 
            WHERE {where_clause}
            ORDER BY published_date DESC
            LIMIT {per_page} OFFSET {offset}
        """
        
        rows = await conn.fetch(query, *params)
        
        posts = [
            BlogPostSummary(
                id=row['id'],
                title=row['title'],
                slug=row['slug'],
                excerpt=row['excerpt'],
                featured_image=row['featured_image'],
                published_date=row['published_date'],
                categories=row['categories'] or [],
                tags=row['tags'] or [],
                view_count=row['view_count']
            ) for row in rows
        ]
        
        return BlogPostsResponse(
            posts=posts,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
        
    finally:
        await conn.close()

@router.get("/posts/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    """Get a single blog post by slug and increment view count"""
    conn = await get_db_connection()
    
    try:
        # Get the post
        query = """
            SELECT id, title, slug, content, excerpt, featured_image, 
                   published_date, created_at, updated_at, categories, tags, 
                   is_published, view_count
            FROM blog_posts 
            WHERE slug = $1 AND is_published = true
        """
        
        row = await conn.fetchrow(query, slug)
        
        if not row:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Increment view count
        await conn.execute(
            "UPDATE blog_posts SET view_count = view_count + 1 WHERE slug = $1", 
            slug
        )
        
        return BlogPost(
            id=row['id'],
            title=row['title'],
            slug=row['slug'],
            content=row['content'],
            excerpt=row['excerpt'],
            featured_image=row['featured_image'],
            published_date=row['published_date'],
            created_at=row['created_at'],
            updated_at=row['updated_at'],
            categories=row['categories'] or [],
            tags=row['tags'] or [],
            is_published=row['is_published'],
            view_count=row['view_count'] + 1  # Return the incremented count
        )
        
    finally:
        await conn.close()

@router.get("/categories")
async def get_categories():
    """Get all unique categories from published posts"""
    conn = await get_db_connection()
    
    try:
        query = """
            SELECT DISTINCT unnest(categories) as category
            FROM blog_posts 
            WHERE is_published = true AND categories IS NOT NULL
            ORDER BY category
        """
        
        rows = await conn.fetch(query)
        categories = [row['category'] for row in rows if row['category']]
        
        return {"categories": categories}
        
    finally:
        await conn.close()

@router.get("/tags")
async def get_tags():
    """Get all unique tags from published posts"""
    conn = await get_db_connection()
    
    try:
        query = """
            SELECT DISTINCT unnest(tags) as tag
            FROM blog_posts 
            WHERE is_published = true AND tags IS NOT NULL
            ORDER BY tag
        """
        
        rows = await conn.fetch(query)
        tags = [row['tag'] for row in rows if row['tag']]
        
        return {"tags": tags}
        
    finally:
        await conn.close()

@router.post("/posts", response_model=BlogPost)
async def create_blog_post(post_data: CreateBlogPostRequest, user: AuthorizedUser):
    """Create a new blog post"""
    conn = await get_db_connection()
    
    try:
        # Generate slug from title
        base_slug = generate_slug(post_data.title)
        slug = base_slug
        
        # Ensure slug is unique
        counter = 1
        while True:
            existing = await conn.fetchval(
                "SELECT id FROM blog_posts WHERE slug = $1", slug
            )
            if not existing:
                break
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Insert the post
        query = """
            INSERT INTO blog_posts (
                title, slug, content, excerpt, featured_image, 
                categories, tags, is_published, published_date,
                meta_description, meta_keywords, author_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) RETURNING *
        """
        
        published_date = post_data.scheduled_date if post_data.scheduled_date else datetime.now()
        
        row = await conn.fetchrow(
            query,
            post_data.title,
            slug,
            post_data.content,
            post_data.excerpt,
            post_data.featured_image,
            post_data.categories,
            post_data.tags,
            post_data.is_published,
            published_date if post_data.is_published else None,
            post_data.meta_description,
            post_data.meta_keywords,
            user.sub
        )
        
        return BlogPost(
            id=row['id'],
            title=row['title'],
            slug=row['slug'],
            content=row['content'],
            excerpt=row['excerpt'],
            featured_image=row['featured_image'],
            published_date=row['published_date'] or row['created_at'],
            created_at=row['created_at'],
            updated_at=row['updated_at'],
            categories=row['categories'] or [],
            tags=row['tags'] or [],
            is_published=row['is_published'],
            view_count=row['view_count']
        )
        
    finally:
        await conn.close()

@router.put("/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: int, post_data: UpdateBlogPostRequest, user: AuthorizedUser):
    """Update an existing blog post"""
    conn = await get_db_connection()
    
    try:
        # Check if post exists and user owns it
        existing_post = await conn.fetchrow(
            "SELECT * FROM blog_posts WHERE id = $1 AND author_id = $2",
            post_id, user.sub
        )
        
        if not existing_post:
            raise HTTPException(status_code=404, detail="Blog post not found or access denied")
        
        # Build update query dynamically
        updates = []
        params = []
        param_count = 0
        
        if post_data.title is not None:
            param_count += 1
            updates.append(f"title = ${param_count}")
            params.append(post_data.title)
            
            # Update slug if title changed
            new_slug = generate_slug(post_data.title)
            if new_slug != existing_post['slug']:
                # Ensure new slug is unique
                base_slug = new_slug
                counter = 1
                while True:
                    existing_slug = await conn.fetchval(
                        "SELECT id FROM blog_posts WHERE slug = $1 AND id != $2", 
                        new_slug, post_id
                    )
                    if not existing_slug:
                        break
                    new_slug = f"{base_slug}-{counter}"
                    counter += 1
                
                param_count += 1
                updates.append(f"slug = ${param_count}")
                params.append(new_slug)
        
        for field in ['content', 'excerpt', 'featured_image', 'meta_description']:
            value = getattr(post_data, field)
            if value is not None:
                param_count += 1
                updates.append(f"{field} = ${param_count}")
                params.append(value)
        
        for field in ['categories', 'tags', 'meta_keywords']:
            value = getattr(post_data, field)
            if value is not None:
                param_count += 1
                updates.append(f"{field} = ${param_count}")
                params.append(value)
        
        if post_data.is_published is not None:
            param_count += 1
            updates.append(f"is_published = ${param_count}")
            params.append(post_data.is_published)
            
            # Update published_date if publishing for the first time
            if post_data.is_published and not existing_post['published_date']:
                published_date = post_data.scheduled_date or datetime.now()
                param_count += 1
                updates.append(f"published_date = ${param_count}")
                params.append(published_date)
        
        if not updates:
            # No updates provided, return existing post
            return BlogPost(**dict(existing_post))
        
        # Add updated_at
        param_count += 1
        updates.append(f"updated_at = ${param_count}")
        params.append(datetime.now())
        
        # Add post_id for WHERE clause
        param_count += 1
        params.append(post_id)
        
        query = f"""
            UPDATE blog_posts 
            SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING *
        """
        
        row = await conn.fetchrow(query, *params)
        
        return BlogPost(
            id=row['id'],
            title=row['title'],
            slug=row['slug'],
            content=row['content'],
            excerpt=row['excerpt'],
            featured_image=row['featured_image'],
            published_date=row['published_date'] or row['created_at'],
            created_at=row['created_at'],
            updated_at=row['updated_at'],
            categories=row['categories'] or [],
            tags=row['tags'] or [],
            is_published=row['is_published'],
            view_count=row['view_count']
        )
        
    finally:
        await conn.close()

@router.delete("/posts/{post_id}")
async def delete_blog_post(post_id: int, user: AuthorizedUser):
    """Delete a blog post"""
    conn = await get_db_connection()
    
    try:
        # Check if post exists and user owns it
        result = await conn.execute(
            "DELETE FROM blog_posts WHERE id = $1 AND author_id = $2",
            post_id, user.sub
        )
        
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Blog post not found or access denied")
        
        return {"message": "Blog post deleted successfully"}
        
    finally:
        await conn.close()

@router.get("/posts/drafts", response_model=BlogPostsResponse)
async def get_draft_posts(user: AuthorizedUser, page: int = 1, per_page: int = 10):
    """Get user's draft posts"""
    conn = await get_db_connection()
    
    try:
        # Get total count
        total = await conn.fetchval(
            "SELECT COUNT(*) FROM blog_posts WHERE author_id = $1 AND is_published = false",
            user.sub
        )
        
        # Calculate pagination
        offset = (page - 1) * per_page
        total_pages = (total + per_page - 1) // per_page
        
        # Get posts
        query = """
            SELECT id, title, slug, excerpt, featured_image, created_at as published_date, 
                   categories, tags, view_count
            FROM blog_posts 
            WHERE author_id = $1 AND is_published = false
            ORDER BY updated_at DESC
            LIMIT $2 OFFSET $3
        """
        
        rows = await conn.fetch(query, user.sub, per_page, offset)
        
        posts = [
            BlogPostSummary(
                id=row['id'],
                title=row['title'],
                slug=row['slug'],
                excerpt=row['excerpt'],
                featured_image=row['featured_image'],
                published_date=row['published_date'],
                categories=row['categories'] or [],
                tags=row['tags'] or [],
                view_count=row['view_count']
            ) for row in rows
        ]
        
        return BlogPostsResponse(
            posts=posts,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
        
    finally:
        await conn.close()
