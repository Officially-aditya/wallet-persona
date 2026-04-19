Chat Completions API

Generate responses to text prompts using the standard chat completion format.

Endpoint

POST
https://api.oxlo.ai/v1/chat/completions
Parameters

Name	Type	Required	Description
model	string	Yes	ID of the model to use (e.g., mistral-7b, llama-3-8b).
messages	array	Yes	A list of messages comprising the conversation so far.
max_tokens	integer	No	Maximum number of tokens to generate. Defaults to 256.
temperature	float	No	Sampling temperature between 0 and 2. Defaults to 0.7.
stream	boolean	No	Whether to stream back partial progress. Defaults to false.
Full Reference: For the complete list of parameters including top_p, frequency_penalty, top_k,repeat_penalty, min_p, Mirostat, and more — see the Parameters Reference.

Example Request

bash

curl https://api.oxlo.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "mistral-7b",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'
Example Response

json

{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "mistral-7b",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello there, how may I assist you today?"
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
Error Handling

Code	Description
401	Unauthorized. Invalid or missing API key.
403	Forbidden. Access denied (e.g., plan limit reached, or model requires upgrade).
429	Too Many Requests. Rate limit exceeded.
502	Bad Gateway. Worker unreachable or returned an invalid response.
503	Service Unavailable. All workers busy or queue full.
504	Gateway Timeout. Model took too long to generate a response.

Models

List of available models with their features, capabilities, and API identifiers.

API Model ID is the exact string to use in your API requests, e.g. "model": "deepseek-v3.2"
Text & Chat

MODEL NAME	API MODEL ID	TIER	PRIMARY USE CASE	ROUGH EQUIVALENT
DeepSeek-R1-0528	deepseek-r1-0528	Premium	Frontier-class reasoning and analysis	GPT-4.1 / Claude Opus tier
GPT-OSS 120B	gpt-oss-120b	Premium	Complex reasoning and long-context tasks	GPT-4o tier
Kimi-K2-Thinking	kimi-k2-thinking	Premium	Deep reasoning and long-form analysis	GPT-4 reasoning tier
Kimi-K2.5	kimi-k2.5	Premium	Balanced reasoning with improved speed	Claude Sonnet tier
Llama 3.3 70B	llama-3.3-70b	Premium	High-quality chat and summarization	GPT-4-class tier
Qwen 3 32B	qwen-3-32b	Premium	Multilingual reasoning	Claude Sonnet tier
DeepSeek R1 70B	deepseek-r1-70b	Pro	Advanced reasoning, structured outputs	GPT-4-class reasoning tier
DeepSeek V3 0324	deepseek-v3-0324	Pro	Enhanced general-purpose chat	GPT-4o Mini tier
GPT-OSS 20B	gpt-oss-20b	Pro	Balanced chat and reasoning	GPT-4o Mini tier
Llama 3.1 8B	llama-3.1-8b	Pro	Fast general chat	GPT-4o Mini tier
Llama-4-Maverick-17B	llama-4-maverick-17b	Pro	Versatile MoE model for diverse tasks	GPT-4o tier
Ministral-14B	ministral-14b	Pro	Fast reasoning and structured outputs	GPT-4o Mini tier
Qwen 2.5 7B	qwen-2.5-7b	Pro	Lightweight multilingual tasks	GPT-3.5 tier
DeepSeek R1 8B	deepseek-r1-8b	Free	Lightweight reasoning and chat	GPT-4o Mini tier
DeepSeek V3.2	deepseek-v3.2	Free	General-purpose chat and analysis	GPT-4o Mini / Claude Sonnet tier
Llama 3.2 3B	llama-3.2-3b	Free	Lightweight tasks and fast responses	GPT-3.5 tier
Mistral 7B	mistral-7b	Free	Fast lightweight generation	GPT-3.5 tier
Coding

MODEL NAME	API MODEL ID	TIER	PRIMARY USE CASE	ROUGH EQUIVALENT
DeepSeek Coder 33B	deepseek-coder-33b	Pro	Advanced code reasoning and generation	GPT-4-class coding
Image Generation

MODEL NAME	API MODEL ID	TIER	PRIMARY USE CASE	ROUGH EQUIVALENT
Oxlo Image Pro	oxlo-image-pro	Premium	High-quality text-to-image	DALL·E 3 / Flux Pro tier
Flux.1 Schnell	flux.1-schnell	Pro	Fast image generation	SD Turbo tier
SDXL Lightning	sdxl	Pro	Fast 4-step image generation	SDXL tier
Stable Diffusion 1.5	stable-diffusion-1.5	Free	Lightweight image generation	Early SD tier
Audio

MODEL NAME	API MODEL ID	TIER	PRIMARY USE CASE	ROUGH EQUIVALENT
Whisper Medium	whisper-medium	Free	Speech transcription	Whisper medium tier
Whisper Large	whisper-large	Free	High-accuracy transcription	Whisper large tier
Whisper Large v3	whisper-large-v3	Free	Production-grade transcription	Whisper large-v3 tier
Kokoro 82M	kokoro-82m	Free	Voice synthesis (TTS)	Standard TTS API tier
Embeddings

MODEL NAME	API MODEL ID	TIER	PRIMARY USE CASE	ROUGH EQUIVALENT
BGE-Large	bge-large	Free	Semantic search and RAG	text-embedding-large tier
E5-Large	e5-large	Free	Semantic clustering and retrieval	embedding-large tier
Computer Vision

MODEL NAME	API MODEL ID	TIER	PRIMARY USE CASE	ROUGH EQUIVALENT
YOLOv9	yolo-v9	Free	Real-time object detection	Real-time CV API tier
YOLOv11	yolo-v11	Free	Advanced object detection	Advanced CV detection tier
Rough Equivalent indicates general performance tier comparison and does not imply identical architecture or behavior.
ON THIS PAGE

Text & Chat
Coding
Image Generation
Audio
Embeddings
Computer Vision

Parameters Reference

Every model on Oxlo supports customizable inference parameters. This page documents every available parameter across all model categories, with valid ranges, defaults, and usage examples.

Tip: All parameters are optional. If omitted, sensible defaults are used. You can also try parameters interactively in the Playground.

Chat Completions
Parameters for POST /v1/chat/completions. Compatible with OpenAI, Anthropic, and OpenRouter SDKs.

Core Parameters

Parameter	Type	Default	Range	Description
model	string	—	—	Model ID to use (e.g. deepseek-v3.2, mistral-7b).
messages	array	—	—	Array of message objects with role and content fields.
temperature	float	0.7	0 – 2	Controls randomness. Lower values make output more deterministic; higher values more creative.
max_tokens	integer	256	1 – 131072	Maximum number of tokens to generate in the response.
top_p	float	1.0	0 – 1	Nucleus sampling: only considers tokens with cumulative probability above this threshold. Use either temperature or top_p, not both.
stop	string | string[]	null	max 4	Up to 4 sequences where the model will stop generating further tokens.
stream	boolean	false	—	Whether to stream back partial progress as server-sent events.
Penalty Parameters

These parameters control repetition and diversity in the generated text.

Parameter	Type	Default	Range	Description
frequency_penalty	float	0	-2 – 2	Penalize tokens proportionally to how often they appear. Positive values reduce repetition.
presence_penalty	float	0	-2 – 2	Penalize tokens that have appeared at all. Encourages the model to talk about new topics.
repeat_penalty	float	1.1	0 – 3	Multiplicative penalty applied to repeated token sequences. 1.0 means no penalty.
Advanced Sampling

Fine-grained control over the token prediction process. These are particularly useful for research and advanced use cases.

Parameter	Type	Default	Range	Description
top_k	integer	0	0 – 500	Only sample from the top K most likely tokens. 0 disables top-k filtering.
min_p	float	0.05	0 – 1	Minimum probability threshold relative to the most likely token. Tokens below this are excluded.
typical_p	float	1.0	0 – 1	Locally typical sampling. 1.0 disables it. Lower values make output more predictable.
tfs_z	float	1.0	0 – 1	Tail-free sampling parameter. 1.0 disables it. Lower values cut off the tail of the distribution.
mirostat_mode	integer	0	0, 1, 2	Mirostat sampling mode. 0 = disabled, 1 = Mirostat v1, 2 = Mirostat v2.
mirostat_tau	float	5.0	0 – 10	Target entropy (perplexity) for Mirostat. Lower = more focused output.
mirostat_eta	float	0.1	0 – 1	Mirostat learning rate. Controls how quickly the algorithm adapts.
seed	integer	random	0 – 2^31	Random seed for reproducible outputs. Same seed + same params = same output.
n	integer	1	1 – 5	Number of chat completions to generate for each input.
Example

python

from openai import OpenAI

client = OpenAI(
    base_url="https://api.oxlo.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="deepseek-v3.2",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Explain quantum computing in simple terms."}
    ],
    temperature=0.9,
    max_tokens=1024,
    top_p=0.95,
    frequency_penalty=0.5,
    presence_penalty=0.3,
    stop=["\n\n"],
    seed=42
)

print(response.choices[0].message.content)
Compatibility: Our API is fully compatible with the OpenAI SDK. If you are using OpenAI, Anthropic, or OpenRouter, you can switch to Oxlo by just changing the base_url and api_key.

Image Generation
Parameters for POST /v1/images/generations.

Parameter	Type	Default	Range	Description
prompt	string	—	—	Text description of the image to generate.
model	string	""	—	Model to use (e.g. oxlo-image-pro, sdxl, stable-diffusion-1.5).
num_inference_steps	integer	4	1 – 150	Number of denoising steps. More steps generally produce better quality but take longer.
guidance_scale	float	7.5	1 – 30	Classifier-free guidance scale. Higher values make the image follow the prompt more closely.
negative_prompt	string	""	free text	Text describing what to avoid in the generated image.
width	integer	1024	256 – 2048	Image width in pixels. Must be a multiple of 64.
height	integer	1024	256 – 2048	Image height in pixels. Must be a multiple of 64.
seed	integer	random	0 – 2^31	Random seed for reproducible generations.
n	integer	1	1 – 4	Number of images to generate.
Example

python

response = client.images.generate(
    model="oxlo-image-pro",
    prompt="A futuristic city skyline at sunset, cyberpunk style",
    negative_prompt="blurry, low quality",
    n=1,
    size="1024x1024"
)

image_b64 = response.data[0].b64_json
Audio: Speech-to-Text
Parameters for POST /v1/audio/transcriptions (Whisper models).

Parameter	Type	Default	Range	Description
file	file	—	—	Audio file to transcribe. Supports mp3, mp4, wav, webm, m4a, mpeg, mpga.
model	string	whisper-medium	—	Whisper model to use (whisper-medium, whisper-large, whisper-large-v3).
language	string	auto	ISO 639-1	Language of the audio. Auto-detected if not specified.
response_format	string	json	json, text, verbose_json, srt, vtt	Output format for the transcription.
temperature	float	0	0 – 1	Sampling temperature for the decoding process. 0 is most deterministic.
Example

python

transcript = client.audio.transcriptions.create(
    model="whisper-large-v3",
    file=open("meeting.mp3", "rb"),
    language="en",
    response_format="verbose_json"
)

print(transcript.text)
Audio: Text-to-Speech
Parameters for POST /v1/audio/speech (Kokoro TTS).

Parameter	Type	Default	Range	Description
input	string	—	—	Text to convert to speech.
model	string	kokoro-82m	—	TTS model to use.
voice	string	af_heart	model voices	Voice to use for synthesis. Available voices can be fetched via /v1/audio/voices.
speed	float	1.0	0.25 – 4.0	Playback speed multiplier.
Example

python

response = client.audio.speech.create(
    model="kokoro-82m",
    input="Hello, welcome to Oxlo AI.",
    voice="af_heart",
    speed=1.0
)

with open("output.wav", "wb") as f:
    f.write(response.content)
Object Detection
Parameters for POST /v1/detect (YOLO models).

Parameter	Type	Default	Range	Description
image	string	—	—	Base64-encoded image or image URL.
model	string	yolo11x.pt	—	YOLO model variant to use.
confidence	float	0.25	0.01 – 1.0	Minimum confidence threshold. Only detections above this score are returned.
iou_threshold	float	0.45	0.1 – 1.0	Intersection-over-Union threshold for non-maximum suppression.
classes	string	all	comma-separated	Comma-separated list of class names or IDs to filter.
max_detections	integer	100	1 – 300	Maximum number of detections to return.
image_size	integer	640	320 – 1280	Input image size for inference. Larger = slower but more accurate.
Example

python

import requests, base64

with open("photo.jpg", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode()

response = requests.post(
    "https://api.oxlo.ai/v1/detect",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={
        "image": image_b64,
        "model": "yolo11x.pt",
        "confidence": 0.3,
        "iou_threshold": 0.5
    }
)

for det in response.json()["detections"]:
    print(f"{det['class_name']}: {det['confidence']:.2f}")
Embeddings
Parameters for POST /v1/embeddings.

Parameter	Type	Default	Range	Description
input	string | string[]	—	—	Text or array of texts to embed.
model	string	bge-large	—	Embedding model to use (bge-large, e5-large).
encoding_format	string	float	float, base64	Format of the output embeddings.
Example

python

response = client.embeddings.create(
    model="bge-large",
    input=["Search query here", "Document text here"]
)

for item in response.data:
    print(f"Embedding dim: {len(item.embedding)}")
Parameter Discovery API
You can dynamically discover which parameters a model supports via our API. This is useful for building UIs that adapt to different model types automatically.

GET
https://api.oxlo.ai/v1/models/{model_id}/parameters
Response Format

json

{
  "model_id": "deepseek-v3.2",
  "model_name": "DeepSeek V3.2",
  "category": "chat",
  "context_length": 128000,
  "parameters": {
    "temperature": {
      "type": "float",
      "min": 0,
      "max": 2,
      "default": 0.7,
      "step": 0.1,
      "section": "basic",
      "description": "Controls randomness in output generation"
    },
    "top_k": {
      "type": "int",
      "min": 0,
      "max": 500,
      "default": 0,
      "section": "advanced",
      "description": "Only sample from top K tokens (0 = disabled)"
    }
  }
}
Note: Parameters are grouped intobasic and advanced sections. The basic section contains the most commonly used parameters, while advanced contains fine-tuning options for power users.

Need a parameter we don't support yet? Reach out to us at hello@oxlo.ai with details on the parameter and your use case. We actively review requests and add new parameters regularly.

Authentication

All OxAPI requests must be authenticated using a Bearer token.

API Key Header

Include your API key in the Authorization HTTP header as a Bearer token.

Authorization: Bearer YOUR_API_KEY
Example request

bash

curl https://api.oxlo.ai/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "model": "llama-3.2-3b", "messages": [{"role":"user","content":"Hello"}] }'
Security Best Practices

Do not expose API keys in client-side applications.
Store keys securely using environment variables.
Rotate keys periodically from the Oxlo.ai Portal.