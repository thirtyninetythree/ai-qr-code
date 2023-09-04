import argparse
import json
import datetime

import numpy as np
import requests
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument(
    "--qrcode-content", type=str, required=True, help="Content for the QR Code"
)
parser.add_argument(
    "--prompt", type=str, required=True, help="Prompt for image generation"
)
parser.add_argument(
    "--negative-prompt",
    type=str,
    default="ugly, blurry, disfigured",
    help="Aspects that you don't want to appear in the image",
)
parser.add_argument(
    "--guidance-scale", type=float, default=7.5, help="Prompt for image generation"
)
parser.add_argument(
    "--controlnet-conditioning-scale",
    type=float,
    default=2.0,
    help="Prompt for image generation",
)
parser.add_argument(
    "--strength", type=float, default=0.9, help="Prompt for image generation"
)
parser.add_argument(
    "--seed", type=float, default=-1, help="Number to help reproducibility"
)

args = parser.parse_args()

# predictions_url = "http://localhost:8000/predictions/stable-diffusion"
predictions_url = "predictions/stable-diffusion"
# response = requests.post(predictions_url, data=args)

args_dict = vars(args)
print(args)
args_json = json.dumps(vars(args))
response = requests.post(predictions_url, data=args_json)

# print(f"response = {response}")

# Contsruct image from response
image = Image.fromarray(np.array(json.loads(response.text), dtype="uint8"))
# image.save(f"AIQRCODE {datetime.datetime.now()}.png")

# python3 generate.py --qrcode-content "akama.co.ke" --prompt "a photo of an astronaut riding a horse on mars"
