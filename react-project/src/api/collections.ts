import axios from "axios";
import type { User, MediaStatus } from "../utils/types";

const BASE_URL = "http://localhost:3000/users";

export const addToCollection = async (
  userId: string,
  mediaId: string,
  status: MediaStatus
) => {
  const { data: user } = await axios.get<User>(`${BASE_URL}/${userId}`);

  const updatedCollections: Record<MediaStatus, string[]> = {
    watching: user.collections?.watching || [],
    wantToWatch: user.collections?.wantToWatch || [],
    watched: user.collections?.watched || [],
    favorite: user.collections?.favorite || [],
  };

  if (!updatedCollections[status].includes(mediaId)) {
    updatedCollections[status].push(mediaId);
  }

  await axios.patch(`${BASE_URL}/${userId}`, { collections: updatedCollections });
  return updatedCollections;
};


export const removeFromCollection = async (
  userId: string,
  mediaId: string,
  status: MediaStatus
) => {
  const { data: user } = await axios.get<User>(`${BASE_URL}/${userId}`);

  const updatedCollections: Record<MediaStatus, string[]> = {
    watching: user.collections?.watching || [],
    wantToWatch: user.collections?.wantToWatch || [],
    watched: user.collections?.watched || [],
    favorite: user.collections?.favorite || [],
  };

  updatedCollections[status] = updatedCollections[status].filter(id => id !== mediaId);

  await axios.patch(`${BASE_URL}/${userId}`, { collections: updatedCollections });
  return updatedCollections;
};

