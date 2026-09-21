from django.db import models


class LibraryResource(models.Model):

    LEVEL_CHOICES = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    title = models.CharField(max_length=200)

    category = models.CharField(max_length=100)

    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES
    )

    description = models.TextField()

    file = models.FileField(
        upload_to="library/"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title