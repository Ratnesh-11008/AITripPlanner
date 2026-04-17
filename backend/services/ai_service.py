import os
import json
import asyncio
import httpx
from groq import Groq

PRIMARY_MODEL = "llama-3.1-8b-instant"
SECONDARY_MODEL = "llama-3.1-70b-versatile"
FALLBACK_MODEL = "llama3-8b-8192"



async def generate_ai_itinerary(destination, days, budget, interests):
    print("API Key Loaded:", bool(os.getenv("GROQ_API_KEY")))
    if not os.getenv("GROQ_API_KEY"):
        raise Exception("GROQ_API_KEY is not set in environment variables.")

    try:
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        print("\nAvailable Groq Models:", client.models.list())
        
        prompt = f"""You are a professional travel planner.

Destination: {destination}
Number of Days: {days}

STRICT RULES:

1. You MUST generate EXACTLY {days} days itinerary
2. Do NOT generate fewer or extra days
3. Each day must have at least 2-4 places
4. If content is less, distribute places logically across all days
5. Suggest ONLY REAL and well-known hotels in the destination
6. Hotel must include name, exact location (area), and Google Maps searchable name. Do NOT use generic names.
7. For each place: Provide REAL tourist places ONLY with exact Google Maps searchable name.
8. For EACH place include distance_from_hotel (in km) and travel_time (in minutes). Distance must be calculated from HOTEL to place.
9. For EACH place, include a transport object with mode, cost, time, route, and note.

Return JSON in this format:
{{
"hotel": {{
"name": "",
"location": ""
}},
"days": [
{{
"day": 1,
"places": [
{{
"name": "",
"description": "very short desc",
"distance_from_hotel": "",
"travel_time": "",
"best_time": "",
"transport": {{
"mode": "Private Cab",
"cost": "₹1500",
"time": "45 mins",
"route": "Hilly terrain",
"note": "Best option for comfort"
}}
}}
]
}}
]
}}

Return ONLY JSON. No extra text."""

        max_retries = 3
        
        for attempt in range(max_retries):
            try:
                try:
                    response = client.chat.completions.create(
                        model=PRIMARY_MODEL,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7,
                        timeout=15.0
                    )
                except Exception as e1:
                    print("Primary model failed:", e1)
                    response = client.chat.completions.create(
                        model=SECONDARY_MODEL,
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.7,
                        timeout=15.0
                    )
                    
                raw_text = response.choices[0].message.content.strip()
                
                # Parse
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                elif raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                    
                data = json.loads(raw_text.strip())
                
                days_list = data.get("days", data.get("itinerary", []))
                if len(days_list) != int(days):
                    raise Exception(f"Expected {days} days, got {len(days_list)}")
                
                # Validation Layer (IMPORTANT)
                validated_itinerary = []
                
                hotel_data = data.get("hotel", {})
                hotel_name = hotel_data.get("name", "Good Hotel")
                data["hotel"] = hotel_data

                for day_plan in days_list:
                    day_num = day_plan.get("day")
                    valid_places = day_plan.get("places", [])
                    
                    if len(valid_places) == 0:
                        valid_places.append({
                            "name": "Explore local area / markets",
                            "description": f"Relax and explore the local culture and markets of {destination}.",
                            "best_time": "Evening"
                        })
                        
                    validated_itinerary.append({
                        "day": day_num,
                        "places": valid_places
                    })
                    
                data["itinerary"] = validated_itinerary
                if "days" in data:
                    del data["days"]
                    
                return data
                
            except Exception as e:
                print(f"Attempt {attempt+1} failed: {str(e)}")
                if attempt == max_retries - 1:
                    raise Exception("AI service temporarily unavailable, please try again")
                await asyncio.sleep(1)

    except Exception as e:
        print(f"Error during AI generation: {str(e)}")
        raise Exception("AI service temporarily unavailable, please try again")
