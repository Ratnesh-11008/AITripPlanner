import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin, Calendar, Users, Wallet, Heart } from 'lucide-react';

const TripPlannerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    travelers: 2,
    budget: 30000,
    interests: []
  });

  const interestsList = ['Adventure', 'Nature', 'Food', 'Culture', 'Luxury', 'Relaxation', 'Shopping', 'History'];

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || 'Failed to generate trip');
      }
      const data = await response.json();
      
      navigate('/results', { state: { tripData: data } });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error generating trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl glass-card p-8 md:p-12"
      >
        <h2 className="text-3xl font-bold mb-2">Plan Your Next Adventure</h2>
        <p className="text-muted-foreground mb-8">Fill out the details below and let AI craft your perfect itinerary.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-700 dark:text-red-300 rounded-xl flex items-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin size={16} className="text-purple-500" /> Destination
            </label>
            <input 
              required
              type="text" 
              placeholder="e.g. Paris, Tokyo, Bali" 
              className="w-full p-4 rounded-xl glass border-white/20 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={formData.destination}
              onChange={e => setFormData({...formData, destination: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar size={16} className="text-pink-500" /> Number of Days
              </label>
              <input 
                required
                type="number" 
                min="1" max="30"
                className="w-full p-4 rounded-xl glass border-white/20 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.days}
                onChange={e => setFormData({...formData, days: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users size={16} className="text-indigo-500" /> Travelers
              </label>
              <input 
                required
                type="number" 
                min="1" max="20"
                className="w-full p-4 rounded-xl glass border-white/20 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.travelers}
                onChange={e => setFormData({...formData, travelers: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Wallet size={16} className="text-green-500" /> Total Budget (₹)
            </label>
            <input 
              required
              type="number" 
              placeholder="e.g. 30000"
              className="w-full p-4 rounded-xl glass border-white/20 bg-transparent focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={formData.budget}
              onChange={e => setFormData({...formData, budget: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Heart size={16} className="text-red-500" /> Travel Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interestsList.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    formData.interests.includes(interest)
                      ? 'border-pink-500 bg-pink-500/20 text-pink-700 dark:text-pink-300'
                      : 'border-white/20 hover:bg-white/10'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating AI itinerary...
              </>
            ) : (
              <>Generate Magic Plan <Send size={18} /></>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default TripPlannerPage;
