import { motion } from 'framer-motion';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, DollarSign, Hotel, Bus, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tripData = location.state?.tripData;

  const handleSaveTrip = async () => {
    try {
      const res = await fetch('http://localhost:5000/save-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      if (res.ok) {
        alert('Trip saved successfully!');
      } else {
        alert('Failed to save trip.');
      }
    } catch (e) {
      alert('Error saving trip: ' + e.message);
    }
  };

  if (!tripData) {
    return <Navigate to="/planner" replace />;
  }

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Your Trip to {tripData.destination}
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<DollarSign/>} label="Per Person" value={`₹${tripData.per_person_budget}`} />
          <StatCard icon={<DollarSign/>} label="Est. Total" value={`₹${tripData.total_budget}`} />
          <StatCard icon={<Hotel/>} label="Hotel" value={tripData.hotel_recommendations?.[0] || 'Budget Stay'} />
          <StatCard icon={<Bus/>} label="Transport" value={tripData.transport} />
        </div>
      </motion.div>

      <div className="space-y-8">
        {tripData.itinerary.map((day, index) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            key={day.day}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-purple-400">Day {day.day}</h3>
                <p className="text-lg text-muted-foreground">Exploration & Sightseeing</p>
              </div>
            </div>

            <div className="space-y-6 pl-2 md:pl-6 border-l-2 border-purple-500/30">
              {day.places?.map((place, placeIdx) => (
                <div key={placeIdx} className="relative">
                  <div className="absolute -left-[35px] top-1 bg-background rounded-full p-1 border border-purple-500/50">
                    <CheckCircle2 size={16} className="text-purple-400" />
                  </div>
                  
                  <div className="glass p-5 rounded-xl hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className="text-xl font-semibold">{place.name}</h4>
                       <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-md font-bold">★ {place.rating}</span>
                    </div>
                    <p className="text-muted-foreground mb-4">{place.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                      <span className="flex items-center gap-1.5 text-pink-400">
                        <MapPin size={16} /> Dist: {place.distance}
                      </span>
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <Clock size={16} /> Time: {place.time}
                      </span>
                      {place.transport && (
                        <span className="flex items-center gap-1.5 text-green-400" title={place.transport.note}>
                          <Bus size={16} /> {place.transport.mode} - {place.transport.cost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>



      <div className="glass-card p-6 md:p-8 mt-8 mb-8">
        <h3 className="text-2xl font-bold mb-4 text-purple-400">Budget Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <StatCard icon={<Hotel/>} label="Stay (40%)" value={`₹${tripData.cost_breakdown.stay}`} />
           <StatCard icon={<Bus/>} label="Transport (30%)" value={`₹${tripData.cost_breakdown.transport}`} />
           <StatCard icon={<MapPin/>} label="Activities (20%)" value={`₹${tripData.cost_breakdown.activities}`} />
           <StatCard icon={<DollarSign/>} label="Misc (10%)" value={`₹${tripData.cost_breakdown.misc}`} />
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 rounded-xl font-semibold glass hover:bg-white/10 transition-colors"
        >
          Plan Another Trip
        </button>
        <button 
          onClick={handleSaveTrip}
          className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-purple-500/30 transition-shadow"
        >
          Save to Dashboard
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="glass p-4 rounded-xl flex items-center gap-4">
    <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-semibold truncate max-w-[120px]" title={value}>{value}</p>
    </div>
  </div>
);

export default ResultsPage;
