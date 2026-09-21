from django.urls import path

from .views import (
    study_sessions,
    create_study_session,
    complete_study_session,
)


urlpatterns = [
    path(
        "",
        study_sessions,
        name="study-sessions"
    ),

    path(
        "create/",
        create_study_session,
        name="create-study-session"
    ),

    path(
        "<int:session_id>/complete/",
        complete_study_session,
        name="complete-study-session"
    ),
]