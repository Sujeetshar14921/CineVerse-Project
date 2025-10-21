const axios = require('axios');
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const baseImage = "https://image.tmdb.org/t/p/w500";

async function fetchMovieFromTmdb(tmdbId) {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`;
  const { data } = await axios.get(url);
  return {
    tmdbId: data.id,
    title: data.title,
    overview: data.overview,
    genres: data.genres.map(g => g.name),
    posterPath: data.poster_path ? baseImage + data.poster_path : null,
    backdropPath: data.backdrop_path ? baseImage + data.backdrop_path : null,
    releaseDate: data.release_date,
    runtime: data.runtime,
    rating: data.vote_average,
    videos: data.videos?.results || [],
    credits: {
      cast: data.credits?.cast?.slice(0, 10).map(c => ({ id: c.id, name: c.name, character: c.character })) || []
    }
  };
}

module.exports = { fetchMovieFromTmdb };
