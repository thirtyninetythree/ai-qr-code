from flask import Flask, request, jsonify
import os
import time

from google.cloud import storage
import secrets

import numpy as np
import requests
from PIL import Image
import json

from firebase_helpers import write_to_firestore, read_from_firestore, query_firestore

app = Flask(__name__)

bucket_name = "a"
GOOGLE_APPLICATION_CREDENTIALS = ""
PREDICTIONS_URL = ""

@app.route('/')
def hello():
    return "Hello, world"

@app.route('/predict', methods=['POST'])
def predict():
    data = {
        "qr_code_content": request.form["qr_code_content"],
        "prompt": request.form["prompt"],
        "negative_prompt": request.form["negative_prompt"],
        "strength": request.form["strength"],
        "controlnet_conditioning_scale": request.form["controlnet_conditioning_scale"],
        "guidance_scale": request.form["guidance_scale"],
        "seed": -1
        }
    print(f"data = {data}")
    start_time = time.time()
    response = requests.post(PREDICTIONS_URL, data=json.dumps(data))
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Inference on single T4: {execution_time} seconds")

    image = Image.fromarray(np.array(json.loads(response.text), dtype="uint8"))
    current_directory = os.getcwd()
    #Generate the filename that will be used to store on gcp
    generated_file_name = generate_file_name()
    #Save generated QR code
    image.save(generated_file_name)
    #Where the QRCode is stored locally 
    local_file_path = f"{current_directory}/{generated_file_name}"
    qrcode_public_url = upload_to_gcs(local_file_path, generated_file_name)
    #save prompt to firestore db
    write_to_firestore(data, qrcode_public_url)
    #Delete uploaded image from server
    os.remove(local_file_path)
    return qrcode_public_url

@app.route('/get_prompts')
def get_prompts():
    return jsonify(read_from_firestore())

@app.route('/search_keywords', methods=['POST'])
def search_prompt_keywords():
    keyword = request.form["keyword"]
    return jsonify(query_firestore(keyword))
#gcs
def upload_to_gcs(local_file_path, generated_file_name):
    # Setting credentials using the downloaded JSON file
    client = storage.Client.from_service_account_json(json_credentials_path=GOOGLE_APPLICATION_CREDENTIALS)

    # Creating bucket object
    bucket = client.get_bucket(bucket_name)
    
    # Name of the object to be stored in the bucket
    object_name_in_gcs_bucket = bucket.blob(generated_file_name)

    # Name of the object in local file system
    object_name_in_gcs_bucket.upload_from_filename(local_file_path)
    object_name_in_gcs_bucket.make_public
    return object_name_in_gcs_bucket.public_url

def generate_file_name():
    secret = secrets.token_hex(8)
    return f"AIQRCODE {secret}.png"

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
