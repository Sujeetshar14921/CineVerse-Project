import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const poster = movie.poster_path || movie.posterPath || movie.poster || '';
  return (
    <motion.div whileHover={{ scale: 1.03 }} className="bg-gray-900 rounded overflow-hidden shadow-md">
      <Link to={`/movie/${movie._id || movie.id || movie.movieId}`}>
        <img src={poster || '/placeholder.png'} alt={movie.title} className="w-full h-64 object-cover" />
        <div className="p-3">
          <h3 className="font-semibold text-sm">{movie.title}</h3>
        </div>
      </Link>
    </motion.div>
  );
}
