# ml-service/app.py
from flask import Flask, request, jsonify
import requests
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

BACKEND_MOVIE_API = "http://localhost:8000/api/tmdb"

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "AI Recommender running fine"})

@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Input Example:
    {
      "movieTitle": "Avengers: Endgame",
      "topK": 10
    }
    """

    data = request.get_json() or {}
    movie_title = (data.get("movieTitle") or "").strip().lower()
    topk = int(data.get("topK") or 10)

    if not movie_title:
        return jsonify({"error": "Movie title is required"}), 400

    try:
        print("🎬 Fetching all movies from backend...")
        res = requests.get(BACKEND_MOVIE_API, timeout=10)
        backend_data = res.json()
        movies = backend_data.get("movies") or backend_data
    except Exception as e:
        return jsonify({"error": f"Backend fetch error: {str(e)}"}), 500

    if not movies or not isinstance(movies, list):
        return jsonify({"error": "No valid movie data received"}), 400

    # Build corpus for similarity
    titles = [m.get("title", "").lower() for m in movies]
    docs = [
        f"{m.get('title','')} {m.get('overview','')} {m.get('genres','')}".lower()
        for m in movies
    ]

    if movie_title not in titles:
        return jsonify({"error": f"Movie '{movie_title}' not found in dataset"}), 404

    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(docs)

    target_index = titles.index(movie_title)
    cosine_sim = cosine_similarity(tfidf_matrix[target_index], tfidf_matrix).flatten()

    similar_indices = cosine_sim.argsort()[::-1][1 : topk + 1]

    recommendations = []
    for idx in similar_indices:
        movie = movies[idx]
        recommendations.append({
            "title": movie.get("title"),
            "genres": movie.get("genres"),
            "overview": movie.get("overview"),
            "posterUrl": movie.get("posterUrl"),
            "rating": movie.get("rating"),
            "similarity": round(float(cosine_sim[idx]) * 100, 2)
        })

    print(f"✅ Found {len(recommendations)} similar movies for '{movie_title}'")

    return jsonify({
        "movie": movie_title,
        "similarMovies": recommendations,
        "count": len(recommendations)
    })


if __name__ == "__main__":
    print("🚀 AI Recommendation Service Running on Port 5000")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
