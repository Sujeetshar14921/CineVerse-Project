import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Loader from "../components/Loader";

export default function MovieDetails(){
  const { id } = useParams();
  const [movie,setMovie]=useState(null);
  useEffect(()=>{
    API.get('/api/movies/'+id).then(r=> setMovie(r.data.movie)).catch(()=> setMovie(null))
  },[id]);
  if (movie===null) return <Loader/>
  return (
    <div className="p-6">
      <div className="md:flex gap-6">
        <img src={movie.poster_path || movie.posterPath || '/placeholder.png'} className="w-64 h-96 object-cover rounded" />
        <div className="mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="mt-3 text-gray-300">{movie.overview}</p>
          <p className="mt-3 text-sm">Genres: {Array.isArray(movie.genres)? movie.genres.join(', '): movie.genres}</p>
        </div>
      </div>
    </div>
  )
}
