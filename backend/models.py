import os
from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class TransportDetails(BaseModel):
    mode: str
    cost: str
    time: str
    route: str
    note: str

class HotelDetails(BaseModel):
    name: str
    location: str

class TripRequest(BaseModel):
    destination: str
    days: int
    members: int = Field(alias="travelers", default=1) # Handle both 'members' and 'travelers'
    budget: int # Now an integer (e.g., 30000)
    interests: List[str]

class Place(BaseModel):
    name: str
    rating: float
    distance: str
    time: str
    description: str
    transport: Optional[TransportDetails] = None

class DayPlan(BaseModel):
    day: int
    places: List[Place]

class CostBreakdown(BaseModel):
    stay: int
    transport: int
    activities: int
    misc: int

class TripResponse(BaseModel):
    destination: str
    budget_category: str
    total_budget: int
    per_person_budget: int
    transport: str
    hotel_recommendations: List[str]
    hotel: Optional[HotelDetails] = None
    itinerary: List[DayPlan]
    cost_breakdown: CostBreakdown
    food_recommendations: List[str] = []
    travel_tips: List[str] = []
