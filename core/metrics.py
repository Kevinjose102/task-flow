from prometheus_client import Counter

request_counter = Counter(
    "http_requests_total",
    "Total HTTP Requests"
)

login_counter = Counter(
    "login_attempts_total",
    "Total Login Attempts"
)

