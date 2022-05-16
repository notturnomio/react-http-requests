import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/addMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // const starWarsApiLink = "https://swapi.dev/api/films/"

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://udemy-max-react-http-default-rtdb.europe-west1.firebasedatabase.app/movies.json",
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        console.log("log", response.status);
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const transformedMovies = [];

      for (const key in data) {
        transformedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = async (movie) => {
    try {
      const response = await fetch(
        "https://udemy-max-react-http-default-rtdb.europe-west1.firebasedatabase.app/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: { "Content-type": "application/json" },
        }
      );

      if (!response.ok) {
        console.log("log", response.status);
        throw new Error("Failed to send your movie! Try again.");
      }

      const data = await response.json();
      console.log("posted data: ", data);

      fetchMoviesHandler();
    } catch (error) {
      setError(error.message);
    }
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Update Movies List</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
