from fastapi import APIRouter, HTTPException
from models import TripRequest, TripResponse, DayPlan, CostBreakdown, Place, HotelDetails
from services.ai_service import generate_ai_itinerary
import json
import os

router = APIRouter()

def get_budget_category(per_person_budget: int) -> str:
    if per_person_budget < 3000:
        return "low"
    elif per_person_budget <= 7000:
        return "medium"
    return "high"

def get_transport_suggestion(budget_category: str) -> str:
    if budget_category == "low":
        return "Public Transport / Rented Two-wheeler"
    elif budget_category == "medium":
        return "Shared Cab / Standard Taxi"
    return "Private Luxury Cab / Chauffeur"

@router.post("/generate-trip", response_model=TripResponse)
async def generate_trip(request: TripRequest):
    try:
        # 1. Budget Logic
        per_person = int(request.budget / max(1, request.members))
        budget_category = get_budget_category(per_person)
        
        # 40/30/20/10 split
        cost_breakdown = CostBreakdown(
            stay=int(request.budget * 0.40),
            transport=int(request.budget * 0.30),
            activities=int(request.budget * 0.20),
            misc=int(request.budget * 0.10)
        )
        transport = get_transport_suggestion(budget_category)
        
        # 2. Call AI Service Directly (No static fallback)
        interests_str = ", ".join(request.interests) if request.interests else "General Sightseeing"
        
        ai_data = await generate_ai_itinerary(
            destination=request.destination,
            days=request.days,
            budget=request.budget,
            interests=interests_str
        )
        
        hotel_data = ai_data.get("hotel", {})
        
        itinerary = []
        for day_data in ai_data.get("itinerary", []):
            day_places = []
            
            for plan_item in day_data.get("places", []):
                place_name = plan_item.get("name", "")
                description = plan_item.get("description", "")
                best_time = plan_item.get("best_time", "Anytime")
                
                dist_str = plan_item.get("distance_from_hotel", "Local")
                time_str = plan_item.get("travel_time", "N/A")
                
                combined_description = f"{description} | Best Time: {best_time}"
                
                day_places.append(Place(
                    name=place_name,
                    rating=4.5,
                    distance=dist_str,
                    time=time_str,
                    description=combined_description,
                    transport=plan_item.get("transport")
                ))
            if len(day_places) > 0:
                itinerary.append(DayPlan(day=day_data.get("day"), places=day_places))
            
        hotel_name = hotel_data.get("name", "Generated Hotel")

        return TripResponse(
            destination=ai_data.get("destination", request.destination),
            budget_category=budget_category,
            total_budget=request.budget,
            per_person_budget=per_person,
            transport=transport,
            hotel_recommendations=[hotel_name],
            hotel=hotel_data,
            itinerary=itinerary,
            cost_breakdown=cost_breakdown,
            food_recommendations=[],
            travel_tips=[]
        )
        
    except Exception as e:
        print(f"Error generating trip: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import Request

@router.post("/save-trip")
async def save_trip(request: Request):
    try:
        data = await request.json()
        trips = []
        if os.path.exists("trips_db.json"):
            with open("trips_db.json", "r") as f:
                trips = json.load(f)
        trips.append(data)
        with open("trips_db.json", "w") as f:
            json.dump(trips, f)
        return {"message": "Trip saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get-trips")
async def get_trips():
    if os.path.exists("trips_db.json"):
        with open("trips_db.json", "r") as f:
            return json.load(f)
    return []
