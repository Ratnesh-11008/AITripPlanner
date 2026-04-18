import { useEffect, useState } from 'react';
import { Plane, Calendar, Wallet } from 'lucide-react';

const DashboardPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const API_URL = `${BASE_URL}/backend`;
        const res = await fetch(`${API_URL}/get-trips`);
        if (res.ok) {
          const data = await res.json();
          setTrips(data);
        }
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Your Past Trips</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="glass-card p-6 flex items-center justify-center min-h-[200px] col-span-full">
             <p className="text-muted-foreground">Loading trips...</p>
           </div>
        ) : trips.length === 0 ? (
          <div className="glass-card p-6 border-dashed border-2 border-white/20 flex items-center justify-center min-h-[200px] col-span-full">
            <p className="text-muted-foreground">No trips generated yet!</p>
          </div>
        ) : (
          trips.map((trip, idx) => (
            <div key={idx} className="glass-card p-6 rounded-xl hover:bg-white/5 transition-all">
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                 <h3 className="text-2xl font-bold text-white">{trip.destination}</h3>
                 <Plane className="text-purple-400" />
              </div>
              <div className="space-y-3">
                 <p className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={18} className="text-pink-400"/> {trip.itinerary?.length || 0} Days Itinerary
                 </p>
                 <p className="flex items-center gap-2 text-muted-foreground">
                    <Wallet size={18} className="text-green-400"/> Total Budget: ₹{trip.total_budget}
                 </p>
                 <div className="pt-4">
                    <p className="text-sm font-semibold text-purple-300">Base Hotel:</p>
                    <p className="text-sm text-gray-300 truncate">{trip.hotel?.name}</p>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
