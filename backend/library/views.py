from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import LibraryResource


def library_resources(request):
    resources = LibraryResource.objects.all().order_by("-created_at")

    data = []

    for resource in resources:
        data.append({
            "id": resource.id,
            "title": resource.title,
            "category": resource.category,
            "level": resource.level,
            "description": resource.description,
            "file": resource.file.url if resource.file else None,
            "created_at": resource.created_at.strftime("%Y-%m-%d"),
            "updated_at": resource.updated_at.strftime("%Y-%m-%d"),
        })

    return JsonResponse(data, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def upload_library_resource(request):

    title = request.POST.get("title", "").strip()
    category = request.POST.get("category", "").strip()
    level = request.POST.get("level", "").strip()
    description = request.POST.get("description", "").strip()

    uploaded_file = request.FILES.get("file")

    # Check required fields
    if not title or not category or not level or not description or not uploaded_file:
        return JsonResponse({
            "success": False,
            "message": "All fields are required."
        }, status=400)

    # Only PDF
    if not uploaded_file.name.lower().endswith(".pdf"):
        return JsonResponse({
            "success": False,
            "message": "Only PDF files are allowed."
        }, status=400)

    # Maximum 10 MB
    if uploaded_file.size > 10 * 1024 * 1024:
        return JsonResponse({
            "success": False,
            "message": "PDF must be 10 MB or smaller."
        }, status=400)

    # Save resource
    resource = LibraryResource.objects.create(
        title=title,
        category=category,
        level=level,
        description=description,
        file=uploaded_file,
    )

    return JsonResponse({
        "success": True,
        "message": "PDF uploaded successfully.",
        "resource": {
            "id": resource.id,
            "title": resource.title,
            "category": resource.category,
            "level": resource.level,
            "description": resource.description,
            "file": resource.file.url if resource.file else None,
        }
    }, status=201)