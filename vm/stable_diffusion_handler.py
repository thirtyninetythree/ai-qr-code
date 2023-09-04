import logging
import zipfile
from abc import ABC

import diffusers
import numpy as np
import torch

from ts.torch_handler.base_handler import BaseHandler
import qrcode
from PIL import Image
from diffusers import (
    StableDiffusionControlNetImg2ImgPipeline,
    ControlNetModel,
    DPMSolverMultistepScheduler,
)

logger = logging.getLogger(__name__)
logger.info("Diffusers version %s", diffusers.__version__)

SAMPLER_MAP = {
    "DPM++ Karras SDE": lambda config: DPMSolverMultistepScheduler.from_config(
        config, use_karras=True, algorithm_type="sde-dpmsolver++"
    ),
}


class DiffusersHandler(BaseHandler, ABC):
    """
    Diffusers handler class for text to image generation.
    """

    def __init__(self):
        self.initialized = False

    def initialize(self, ctx):
        """In this initialize function, the Stable Diffusion model is loaded and
        initialized here.
        Args:
            ctx (context): It is a JSON Object containing information
            pertaining to the model artefacts parameters.
        """
        logger.info(f"### INITIALIZING... ###")
        self.manifest = ctx.manifest
        properties = ctx.system_properties
        model_dir = properties.get("model_dir")

        self.device = torch.device(
            "cuda:" + str(properties.get("gpu_id"))
            if torch.cuda.is_available() and properties.get("gpu_id") is not None
            else "cpu"
        )
        # Loading the model and tokenizer from checkpoint and config files based on the user's choice of mode
        # further setup config can be added.
        with zipfile.ZipFile(model_dir + "/model.zip", "r") as zip_ref:
            zip_ref.extractall(model_dir + "/model")
        controlnet = ControlNetModel.from_pretrained(
            model_dir + "/model/controlnet", torch_dtype=torch.float16
        )
        self.pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
            model_dir + "/model",
            controlnet=controlnet,
            revision="fp16",
            safety_checker=None,
            torch_dtype=torch.float16,
        )
        self.pipe.to(self.device)
        # self.pipe.enable_xformers_memory_efficient_attention()
        logger.info("Diffusion model from path %s loaded successfully", model_dir)
        self.initialized = True

    def preprocess(self, requests):
        """Basic text preprocessing, of the user's prompt.
        Args:
            requests (str): The Input data in the form of text is passed on to the preprocess
            function.
        Returns:
            list : The preprocess function returns a list of prompts.
        """
        ### THIS WORKS ###
        logger.info(f"Requests for inference: {requests}")
        inputs = []
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )

        for data in requests:
            input_obj = data.json  # Access the "json" property from each request
            if isinstance(input_obj, (bytes, bytearray)):
                input_obj = input_obj.decode("utf-8")
            (
                qr_code_content,
                prompt,
                negative_prompt,
                guidance_scale,
                controlnet_conditioning_scale,
                strength,
                seed,
            ) = input_obj.values()

            qr.add_data(qr_code_content)
            qr.make(fit=True)
            qrcode_image = qr.make_image(fill_color="black", back_color="white")
            qrcode_image = self.resize_for_condition_image(qrcode_image, 768)
            generator = torch.manual_seed(seed) if seed != -1 else torch.Generator()

            # create an input
            input_obj = [
                prompt,  # prompt
                negative_prompt,  # negative_prompt,
                qrcode_image,  # image  # CONSTANT
                qrcode_image,  # control_image,  # CONSTANT
                768,  # width  # CONSTANT
                768,  # height # CONSTANT
                float(guidance_scale),  # guidance_scale
                float(controlnet_conditioning_scale),  # controlnet_conditioning_scale=
                generator,  # generator,
                float(strength),  # strength
                40,  # num_inference_steps=# CONSTANT
            ]

            inputs.append(input_obj)
            logger.info(f"Input for inference: {input_obj}")
        logger.info(f"Inputs for inference: {inputs}")
        return inputs

    def inference(self, inputs):
        """Generates the image relevant to the received text.
        Args:
            input_batch (list): List of Text from the pre-process function is passed here
        Returns:
            list : It returns a list of the generate images for the input text
        """
        # Handling inference for sequence_classification.
        logger.info(f"RUNNING INFERENCE ON: inputs = {inputs}")

        self.pipe.scheduler = SAMPLER_MAP["DPM++ Karras SDE"](
            self.pipe.scheduler.config
        )
        inferences = self.pipe(
            inputs,
            # height=768,
            # width=768,
            # num_inference_steps=40,
        ).images
        # inferences = self.pipe(
        #     prompt=prompt,
        #     negative_prompt=negative_prompt,
        #     image=qrcode_image,  # CONSTANT
        #     control_image=qrcode_image,  # CONSTANT
        #     width=768,  # CONSTANT
        #     height=768,  # CONSTANT
        #     guidance_scale=float(guidance_scale),
        #     controlnet_conditioning_scale=float(controlnet_conditioning_scale),  # type: ignore
        #     generator=generator,
        #     strength=float(strength),
        #     num_inference_steps=40,
        # ).images

        logger.info(f"Generated image: {inferences}")
        return inferences

    def postprocess(self, inference_output):
        """Post Process Function converts the generated image into Torchserve readable format.
        Args:
            inference_output (list): It contains the generated image of the input text.
        Returns:
            (list): Returns a list of the images.
        """
        images = []
        for image in inference_output:
            images.append(np.array(image).tolist())
        return images

    # helper functions
    def resize_for_condition_image(input_image: Image.Image, resolution: int):
        input_image = input_image.convert("RGB")
        W, H = input_image.size
        k = float(resolution) / min(H, W)
        H *= k
        W *= k
        H = int(round(H / 64.0)) * 64
        W = int(round(W / 64.0)) * 64
        img = input_image.resize((W, H), resample=Image.LANCZOS)
        return img
