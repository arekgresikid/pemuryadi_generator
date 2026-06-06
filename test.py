import httpx
from openai import OpenAI

class LoggingTransport(httpx.BaseTransport):
    def handle_request(self, request):
        print(f"Request URL: {request.url}")
        return httpx.Response(200, json={"choices": [{"message": {"content": "Hello", "role": "assistant"}}]})

client = OpenAI(base_url="https://gen.pollinations.ai", api_key="test", http_client=httpx.Client(transport=LoggingTransport()))
client.chat.completions.create(model="openai", messages=[{"role": "user", "content": "hi"}])
