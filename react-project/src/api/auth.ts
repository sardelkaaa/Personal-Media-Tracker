import axios from "axios";
import type { LoginPayload, User, RegisterPayload } from "../utils/types";

const BASE_URL = "http://localhost:3000";
export const apiLogin = async (payload: LoginPayload): Promise<User> => {
    const { data } = await axios.get<User[]>(`${BASE_URL}/users`);
    const user = data.find(
        (u) => u.email === payload.email && u.password === payload.password
    );
    if (!user) throw new Error("Неверные данные");
    return user;
};


export const apiRegister = async (payload: RegisterPayload): Promise<User> => {
    const { data: users } = await axios.get<User[]>(`${BASE_URL}/users`);

    if (users.find((u) => u.email === payload.email)) {
        throw new Error("Пользователь с таким email уже существует");
}


const { data } = await axios.post<User>(`${BASE_URL}/users`, payload);
    return data;
};


export const apiGetUser = async (id: string): Promise<User> => {
    const { data } = await axios.get<User>(`${BASE_URL}/users/${id}`);
    return data;
};