from django.urls import path

from .views import (
    library_resources,
    upload_library_resource
)


urlpatterns = [
    path("", library_resources, name="library-resources"),

    path(
        "upload/",
        upload_library_resource,
        name="library-upload"
    ),
]