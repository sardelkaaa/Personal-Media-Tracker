import axios from "axios";
import type { Movie, TVSeries } from "../utils/types";

const BASE_URL = "http://localhost:3001";

export const getMovies = () => axios
    .get(`${BASE_URL}/movies`)
    .then(res => res.data);


export const getMovieById = (id: number) : Promise<Movie> => 
    axios.get(`${BASE_URL}/movies/${id}`)
    .then(res => res.data)
    .catch(error => console.log(error));


export const getLastMovieId = (): Promise<number> =>
    axios.get(`${BASE_URL}/movies?_sort=id&_order=desc&_limit=1`)
    .then(res => res.data[0].id)
    .catch(error => console.log(error));

export const addMovie = (movieData: Movie): Promise<Movie> => axios
    .post(`${BASE_URL}/movies`, movieData)
    .then(res => res.data)
    .catch(error => console.log(error));

export const addTVSeries = (tvSeriesData: TVSeries): Promise<TVSeries> => axios
    .post(`${BASE_URL}/tvSeries`, tvSeriesData)
    .then(res => res.data)
    .catch(error => console.log(error));
    