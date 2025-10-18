import axios from "axios";
import type { Movie } from "../utils/types";

const BASE_URL = "https://68ef9f33b06cc802829e20bc.mockapi.io/media-tracker";

export const getMovies = () => axios
    .get(`${BASE_URL}/movies`)
    .then(res => res.data);

export const getMovieById = (id: number) : Promise<Movie> => 
    axios.get(`${BASE_URL}/movies/${id}`)
    .then(res => res.data)
    .catch(error => console.log(error));

export const createMovie = (movie: Movie) => 
    axios.post(`${BASE_URL}/movies`, movie)
    .then(res => console.log(res))
    .catch(error => console.log(error));

export const updateMovie = (id: number, data: Movie) => axios.put(`${BASE_URL}/movies/${id}`, data);

export const deleteMovie = (id: number) => axios.delete(`${BASE_URL}/movies/${id}`);