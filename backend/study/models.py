from django.db import models


class StudySession(models.Model):

    subject = models.CharField(max_length=100)

    topic = models.CharField(max_length=200)

    study_date = models.DateField()

    study_time = models.TimeField()

    duration = models.PositiveIntegerField(
        help_text="Study duration in minutes"
    )

    status = models.CharField(
        max_length=20,
        default="Pending"
    )

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.subject} - {self.topic}"