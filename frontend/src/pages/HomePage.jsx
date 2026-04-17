import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, Map, Calendar, Sparkles } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Design your dream trip with <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            AI-Powered Precision
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Personalized itineraries, smart budget recommendations, and intelligent routing in seconds.
        </p>

        <Link to="/planner">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-3 mx-auto"
          >
            <Sparkles className="w-6 h-6" />
            Start Planning Now
          </motion.button>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
      >
        <FeatureCard 
          icon={<Map className="w-8 h-8 text-purple-500" />}
          title="Smart Routing"
          description="Optimized daily routes with clustered locations to save you time and travel cost."
        />
        <FeatureCard 
          icon={<Calendar className="w-8 h-8 text-pink-500" />}
          title="Day-by-Day Plans"
          description="Detailed schedules including activities, estimated travel times, and cost breakdowns."
        />
        <FeatureCard 
          icon={<Plane className="w-8 h-8 text-indigo-500" />}
          title="Tailored to You"
          description="Whether you're looking for luxury, budget, adventure, or relaxation, AI adapts."
        />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card p-8 flex flex-col items-center text-center hover:bg-white/70 dark:hover:bg-slate-800/80 transition-colors">
    <div className="bg-white/10 p-4 rounded-full mb-6 glass">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default HomePage;
