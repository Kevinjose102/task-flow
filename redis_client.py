import os
import redis

# Check if a full REDIS_URL is provided (which Railway provides by default)
redis_url = os.getenv("REDIS_URL")

if redis_url:
    redis_client = redis.from_url(redis_url, decode_responses=True)
else:
    redis_client = redis.Redis(
        host=os.getenv("REDIS_HOST", "redis"),
        port=int(os.getenv("REDIS_PORT", 6379)),
        decode_responses=True
    )