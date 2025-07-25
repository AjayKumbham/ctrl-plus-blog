"""Fastapi dependency to extract user that has been authenticated by middleware.

Usage:

    from app.auth import AuthorizedUser

    @router.get("/example-data")
    def get_example_data(user: AuthorizedUser):
        return example_read_data_for_user(userId=user.sub)
"""

from typing import Annotated

from fastapi import Depends


AuthorizedUser = Annotated[User, Depends(get_authorized_user)]
