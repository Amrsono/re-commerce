from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import os

app = FastAPI(title="AI Pricing Service")

class DeviceSubmission(BaseModel):
    brand: str
    model: str
    specs: dict
    condition: str

class PricingResult(BaseModel):
    estimatedValue: float
    requiresEngineerVisit: bool
    confidenceScore: float

@app.post("/api/pricing/estimate", response_model=PricingResult)
async def estimate_price(submission: DeviceSubmission):
    try:
        # In a real scenario, we'd call openai.ChatCompletion.create()
        # using the device submission details.
        # For demonstration, we'll use a mocked AI response skill logic.
        
        base_price = 500.0
        if "pro" in submission.model.lower():
            base_price += 300.0
            
        requires_visit = False
        multiplier = 1.0
        
        if submission.condition.lower() == "mint":
            multiplier = 1.0
        elif submission.condition.lower() == "good":
            multiplier = 0.8
        elif submission.condition.lower() == "poor":
            multiplier = 0.4
            requires_visit = True
        elif submission.condition.lower() == "complex":
            multiplier = 0.5
            requires_visit = True
            
        final_price = base_price * multiplier
        
        return PricingResult(
            estimatedValue=round(final_price, 2),
            requiresEngineerVisit=requires_visit,
            confidenceScore=round(random.uniform(0.85, 0.99), 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
