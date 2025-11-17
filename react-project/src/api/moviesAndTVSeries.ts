import axios from "axios";
import type { Movie, TVSeries } from "../utils/types";

const BASE_URL = "http://localhost:3000";

export const getMovies = () => axios
    .get(`${BASE_URL}/movies`)
    .then(res => res.data);

export const getTvSeries = () => axios
    .get(`${BASE_URL}/tvseries`)
    .then(res => res.data);


export const getMovieById = (id: number) : Promise<Movie> => 
    axios.get(`${BASE_URL}/movies/${id}`)
    .then(res => res.data)
    .catch(error => console.log(error));

export const getTvSeriesById = (id: number) : Promise<TVSeries> => 
    axios.get(`${BASE_URL}/tvseries/${id}`)
    .then(res => res.data)
    .catch(error => console.log(error));


export const getLastMovieId = (): Promise<number | void> =>
    axios.get(`${BASE_URL}/movies`)
    .then(res => {
        const movies = res.data;
        const lastMovie = movies[movies.length - 1];
        return parseInt(lastMovie.id);
    })
    .catch(error => console.log(error));

export const getLastTvSeriesId = (): Promise<number | void> =>
    axios.get(`${BASE_URL}/tvseries`)
    .then(res => {
        const tvseries = res.data;
        const lastTvSeries = tvseries[tvseries.length - 1];
        return parseInt(lastTvSeries.id);
    })
    .catch(error => console.log(error));


export const addMovie = (movieData: Movie): Promise<Movie> => axios
    .post(`${BASE_URL}/movies`, movieData)
    .then(res => res.data)
    .catch(error => console.log(error));

export const addTvSeries = (tvSeriesData: TVSeries): Promise<TVSeries> => axios
    .post(`${BASE_URL}/tvseries`, tvSeriesData)
    .then(res => res.data)
    .catch(error => console.log(error));

export const deleteMovie = (id: string) => axios.delete(`${BASE_URL}/movies/${id}`);
export const deleteTvSeries = (id: string) => axios.delete(`${BASE_URL}/tvseries/${id}`);
