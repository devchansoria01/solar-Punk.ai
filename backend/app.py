from fastapi import FastAPI, UploadFile, File
from pipeline import transform_urban_image
import io
from starlette.responses import StreamingResponse

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Urban Planner API is Running!"}

@app.post("/generate")
async def generate(file: UploadFile = File(...)):
    content = await file.read()
    
    # Image process karo
    processed_img = transform_urban_image(content)
    
    # Return as image file
    img_byte_arr = io.BytesIO()
    processed_img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return StreamingResponse(img_byte_arr, media_type="image/png")