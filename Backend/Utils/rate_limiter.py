import time
import asyncio

from collections import defaultdict, deque
from fastapi import HTTPException


MAX_REQUESTS = 3
WINDOW_SECONDS = 60

request_history = defaultdict(deque)
rate_limit_lock = asyncio.Lock()


async def check_rate_limit(user_id: str):
    current_time = time.monotonic()

    async with rate_limit_lock:
        requests = request_history[user_id]

        # Remove requests older than the 60-second window
        while requests and current_time - requests[0] >= WINDOW_SECONDS:
            requests.popleft()

        # Block requests beyond the limit
        if len(requests) >= MAX_REQUESTS:
            retry_after = int(
                WINDOW_SECONDS - (current_time - requests[0])
            ) + 1

            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Maximum 3 requests per minute.",
                headers={"Retry-After": str(retry_after)}
            )

        # Record the accepted request
        requests.append(current_time)