from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json

from .models import StudySession


def study_sessions(request):
    if request.method == "GET":

        sessions = StudySession.objects.all().order_by(
            "study_date",
            "study_time"
        )

        data = []

        for session in sessions:
            data.append({
                "id": session.id,
                "subject": session.subject,
                "topic": session.topic,
                "date": session.study_date.isoformat(),
                "time": session.study_time.strftime("%H:%M"),
                "duration": session.duration,
                "status": session.status,
                "completedAt": (
                    session.completed_at.isoformat()
                    if session.completed_at
                    else None
                ),
            })

        return JsonResponse(data, safe=False)

    return JsonResponse(
        {"error": "Method not allowed"},
        status=405
    )


@csrf_exempt
def create_study_session(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405
        )

    try:
        data = json.loads(request.body)

        session = StudySession.objects.create(
            subject=data["subject"],
            topic=data["topic"],
            study_date=data["date"],
            study_time=data["time"],
            duration=int(data["duration"]),
            status=data.get("status", "Pending")
        )

        return JsonResponse({
            "success": True,
            "id": session.id,
            "message": "Study session created successfully"
        })

    except Exception as e:
        return JsonResponse(
            {
                "success": False,
                "error": str(e)
            },
            status=400
        )


@csrf_exempt
def complete_study_session(request, session_id):

    if request.method != "POST":
        return JsonResponse(
            {"error": "POST request required"},
            status=405
        )

    try:
        session = StudySession.objects.get(
            id=session_id
        )

        session.status = "Completed"
        session.completed_at = timezone.now()
        session.save()

        return JsonResponse({
            "success": True,
            "message": "Study session completed"
        })

    except StudySession.DoesNotExist:
        return JsonResponse(
            {"error": "Study session not found"},
            status=404
        )