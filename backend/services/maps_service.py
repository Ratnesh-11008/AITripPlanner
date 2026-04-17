import os
import httpx
from typing import List, Dict

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

async def get_coordinates(destination: str) -> Dict[str, float]:
    """Get latitude and longitude for a destination"""
    if not GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_API_KEY == "your_api_key_here":
        return {"lat": 15.2993, "lng": 74.1240} # Mock Goa

    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={destination}&key={GOOGLE_MAPS_API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        if data.get("status") == "OK":
            location = data["results"][0]["geometry"]["location"]
            return {"lat": location["lat"], "lng": location["lng"]}
        else:
            return {"lat": 15.2993, "lng": 74.1240} # Fallback

async def get_nearby_places(lat: float, lng: float, interests: List[str]) -> List[Dict]:
    """Fetch nearby tourist attractions based on interests"""
    mock_places = [
        {"name": "Baga Beach", "rating": 4.5, "lat": 15.5553, "lng": 73.7517, "description": "Lively beach with shacks and water sports."},
        {"name": "Fort Aguada", "rating": 4.6, "lat": 15.4989, "lng": 73.7656, "description": "Well-preserved 17th-century Portuguese fort."},
        {"name": "Dudhsagar Falls", "rating": 4.7, "lat": 15.3144, "lng": 74.3143, "description": "Spectacular 4-tiered waterfall."},
        {"name": "Basilica of Bom Jesus", "rating": 4.6, "lat": 15.5009, "lng": 73.9116, "description": "UNESCO World Heritage Baroque church."},
        {"name": "Anjuna Flea Market", "rating": 4.1, "lat": 15.5866, "lng": 73.7423, "description": "Vibrant market for clothes, jewelry, and souvenirs."},
        {"name": "Chapora Fort", "rating": 4.3, "lat": 15.6050, "lng": 73.7377, "description": "Scenic fort ruins famous from Bollywood movies."},
        {"name": "Calangute Beach", "rating": 4.2, "lat": 15.5494, "lng": 73.7625, "description": "Popular commercial beach known as Queen of Beaches."},
        {"name": "Se Cathedral", "rating": 4.5, "lat": 15.5029, "lng": 73.9118, "description": "Massive 16th-century cathedral in Old Goa."},
        {"name": "Palolem Beach", "rating": 4.6, "lat": 15.0100, "lng": 74.0232, "description": "Crescent-shaped beach known for its calm waters."},
        {"name": "Dona Paula View Point", "rating": 4.3, "lat": 15.4526, "lng": 73.8055, "description": "Picturesque viewpoint overlooking the Arabian Sea."},
        {"name": "Vagator Beach", "rating": 4.4, "lat": 15.5979, "lng": 73.7335, "description": "Dramatic red cliffs looking down on the shore."},
        {"name": "Salim Ali Bird Sanctuary", "rating": 4.2, "lat": 15.5140, "lng": 73.8765, "description": "Mangrove habitat harboring varied local/migratory birds."}
    ]

    if not GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_API_KEY == "your_api_key_here":
        return mock_places

    # Real Google Places Text Search (Newer API handles 'interests' better than nearbysearch)
    query = f"tourist attractions {', '.join(interests)} near {lat},{lng}"
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&location={lat},{lng}&radius=20000&key={GOOGLE_MAPS_API_KEY}"
    
    places = []
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        if data.get("status") == "OK":
            for result in data["results"][:20]: # Fetch top 20
                if result.get("rating", 0) >= 4.0: # Filter by rating
                    places.append({
                        "name": result.get("name"),
                        "rating": result.get("rating"),
                        "lat": result["geometry"]["location"]["lat"],
                        "lng": result["geometry"]["location"]["lng"],
                        "description": ", ".join(result.get("types", [])).replace("_", " ").title()
                    })
        
    # Remove duplicates
    unique_places = {p["name"]: p for p in places}.values()
    return list(unique_places) if unique_places else mock_places

async def get_hotels(lat: float, lng: float, budget_tier: str) -> List[str]:
    """Fetch nearby hotels based on budget tier"""
    mock_hotels = ["Taj Exotica (Luxury)", "W Goa", "Taj Holiday Village"] if budget_tier == "high" else \
                  ["Marriott Resort", "Novotel", "Lemon Tree Hotel"] if budget_tier == "medium" else \
                  ["Hostel Crowd", "Zostel", "Sunset Guesthouse"]
                  
    if not GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_API_KEY == "your_api_key_here":
        return mock_hotels

    # In a real app we might map basic text search "budget hotel", "3-star hotel", "luxury resort"
    query = "luxury hotel" if budget_tier == "high" else "3 star hotel" if budget_tier == "medium" else "budget hotel"
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&location={lat},{lng}&radius=10000&key={GOOGLE_MAPS_API_KEY}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        if data.get("status") == "OK":
            return [result["name"] for result in data["results"][:3]]
            
    return mock_hotels

def get_distance_and_time(p1: Dict, p2: Dict) -> Dict:
    """Calculate distance locally using Haversine / rough approximation instead of burning matrix API"""
    import math
    R = 6371 # Earth radius in km
    lat1, lon1, lat2, lon2 = map(math.radians, [p1["lat"], p1["lng"], p2["lat"], p2["lng"]])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    dist_km = R * c
    
    # Rough estimate: 40 km/h average speed in tourist cities
    time_mins = int((dist_km / 40.0) * 60)
    
    return {
        "distance": f"{dist_km:.1f} km",
        "time": f"{max(5, time_mins)} mins"
    }
