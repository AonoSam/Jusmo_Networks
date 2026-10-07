from .models import AuditLog


def get_client_ip(request):
    """
    Prefer X-Forwarded-For when behind a proxy/load balancer (production),
    fall back to REMOTE_ADDR for local dev. Takes the first IP in the chain,
    which is the original client.
    """
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def log_action(request, action, instance=None, model_name="", object_id="", object_repr="", changes=None):
    user = getattr(request, "user", None)
    is_authenticated = user is not None and user.is_authenticated

    if instance is not None:
        model_name = model_name or instance.__class__.__name__
        object_id = object_id or str(getattr(instance, "pk", ""))
        object_repr = object_repr or str(instance)[:255]

    AuditLog.objects.create(
        actor=user if is_authenticated else None,
        actor_username=user.username if is_authenticated else "",
        action=action,
        model_name=model_name,
        object_id=object_id,
        object_repr=object_repr,
        changes=changes,
        ip_address=get_client_ip(request),
        user_agent=request.META.get("HTTP_USER_AGENT", "")[:255],
    )