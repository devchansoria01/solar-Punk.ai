import os
import torch
import io
import numpy as np
from PIL import Image
from dotenv import load_dotenv
# AutoImageProcessor zyada compatible hai
from transformers import AutoImageProcessor, SegformerForSemanticSegmentation
from diffusers import StableDiffusionInpaintPipeline

# 1. Environment load
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# Device check (Warning handle karne ke liye)
device = "cuda" if torch.cuda.is_available() else "cpu"
if device == "cpu":
    print("⚠️ Warning: CUDA nahi mila, CPU par bahut slow chalega!")

# 2. Segmentation Model
# Token yahan bhi pass karna zaroori hai
# model_id = "nvidia/segformer-b0-finetuned-ade-20k"
# model_id = "nvidia/segformer-b0-finetuned-ade-20k-512-512"
model_id = "nvidia/segformer-b0-finetuned-ade-512-512"

processor = AutoImageProcessor.from_pretrained(model_id, token=HF_TOKEN)
seg_model = SegformerForSemanticSegmentation.from_pretrained(model_id, token=HF_TOKEN).to(device)

# 3. Inpainting Model
pipe = StableDiffusionInpaintPipeline.from_pretrained(
    "runwayml/stable-diffusion-inpainting",
    token=HF_TOKEN,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32
).to(device)

def transform_urban_image(image_bytes):
    # Image resize (SD 1.5/Inpainting 512x512 par best chalta hai)
    init_image = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize((512, 512))

    # Masking logic
    inputs = processor(images=init_image, return_tensors="pt").to(device)
    with torch.no_grad():
        outputs = seg_model(**inputs)
    
    logits = outputs.logits.cpu()
    upsampled_logits = torch.nn.functional.interpolate(
        logits, size=init_image.size[::-1], mode='bilinear', align_corners=False
    )
    pred_seg = upsampled_logits.argmax(dim=1)[0].numpy()

    # Mask: Building=1, Grass=9, Earth=13
    mask_area = np.where((pred_seg == 1) | (pred_seg == 9) | (pred_seg == 13), 255, 0).astype(np.uint8)
    mask_image = Image.fromarray(mask_area)

    # Generation
    prompt = "solar panels on roofs, lush green trees, high resolution, professional architecture photography"
    
    # CPU par ho toh steps kam rakho (e.g., 20) taki jaldi ho
    output = pipe(
        prompt=prompt,
        image=init_image,
        mask_image=mask_image,
        num_inference_steps=20 if device == "cpu" else 30
    ).images[0]
    
    return output