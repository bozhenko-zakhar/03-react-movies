import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { fetchMovies } from "../../services/movieService"

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import styles from './App.module.css'

export default function App() {
	const [query, setQuery] = useState<string>("");
	const [movies, setMovies] = useState<Movie[]>([]);
	const [movie, setMovie] = useState<Movie>({
		id: 0,
		poster_path: "",
		backdrop_path: "",
		title: "",
		overview: "",
		release_date: "",
		vote_average: 0,
	})
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [modal, setModal] = useState<boolean>(false);

	function handleMovieClick(newMovie: Movie) {
		setMovie(newMovie);
		setModal(true);
	}

	useEffect(() => {
		if (!query) return;

		async function loadMovie() {
			setError(false);
			setLoading(true);

			try {
				const newMovies = await fetchMovies(query)
				setMovies(newMovies);

				if (newMovies.length == 0) {
					toast.error('No movies found for your request.')
				}
			} catch {
				setError(true)
			}

			setLoading(false);
		}

		loadMovie();
	}, [query])

  return (
    <div className={styles.app}>
			<SearchBar onSubmit={setQuery} />
			{ loading && <Loader /> }
			{ movies.length > 0 && <MovieGrid onSelect={handleMovieClick} movies={movies} /> }
			{ error && <ErrorMessage /> }
			{ modal && <MovieModal onClose={() => setModal(false)} movie={movie} /> }
			<Toaster />
    </div>
  )
}