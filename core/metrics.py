from prometheus_client import Counter

login_attempts_total = Counter(
    "login_attempts_total",
    "Total Login Attempts"
)

successful_logins_total = Counter(
    "successful_logins_total",
    "Successful Login Attempts"
)

failed_logins_total = Counter(
    "failed_logins_total",
    "Failed Login Attempts"
)

rate_limited_requests_total = Counter(
    "rate_limited_requests_total",
    "Rate Limited Requests"
)

projects_created_total = Counter(
    "projects_created_total",
    "Projects Created"
)

projects_deleted_total = Counter(
    "projects_deleted_total",
    "Projects Deleted"
)

tasks_created_total = Counter(
    "tasks_created_total",
    "Tasks Created"
)

tasks_completed_total = Counter(
    "tasks_completed_total",
    "Tasks Completed"
)

tasks_deleted_total = Counter(
    "tasks_deleted_total",
    "Tasks Deleted"
)