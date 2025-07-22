import os
import asyncpg
from app.env import mode, Mode

async def get_db_connection():
    if mode == Mode.PROD:
        db_url = os.environ.get("DATABASE_URL_ADMIN_PROD")
    else:
        db_url = os.environ.get("DATABASE_URL_ADMIN_DEV")
    
    conn = await asyncpg.connect(db_url)
    return conn
