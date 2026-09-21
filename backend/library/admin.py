from django.contrib import admin
from .models import LibraryResource


@admin.register(LibraryResource)
class LibraryResourceAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "category",
        "level",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "category",
        "level",
        "created_at",
    )

    search_fields = (
        "title",
        "category",
        "description",
    )

    ordering = (
        "-created_at",
    )