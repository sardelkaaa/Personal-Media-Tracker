import axios from "axios";
import type { User, MediaStatus, CollectionItem, MediaType } from "../utils/types";

const BASE_URL = "http://localhost:3000/users";

export const addToCollection = async (
  userId: string,
  mediaId: string,
  status: MediaStatus,
  mediaType: MediaType
) => {
  const { data: user } = await axios.get<User>(`${BASE_URL}/${userId}`);

  const updatedCollections: Record<MediaStatus, CollectionItem[]> = {
    watching: user.collections?.watching || [],
    wantToWatch: user.collections?.wantToWatch || [],
    watched: user.collections?.watched || [],
    favorite: user.collections?.favorite || [],
  };

  const exists = updatedCollections[status].some(
    (item) => item.id === mediaId && item.type === mediaType
  );

  if (!exists) {
    updatedCollections[status].push({ id: mediaId, type: mediaType });
  }

  await axios.patch(`${BASE_URL}/${userId}`, { collections: updatedCollections });

  return updatedCollections;
};



export const removeFromCollection = async (
  userId: string,
  mediaId: string,
  status: MediaStatus,
  mediaType: MediaType
) => {
  const { data: user } = await axios.get<User>(`${BASE_URL}/${userId}`);

  const updatedCollections: Record<MediaStatus, CollectionItem[]> = {
    watching: user.collections?.watching || [],
    wantToWatch: user.collections?.wantToWatch || [],
    watched: user.collections?.watched || [],
    favorite: user.collections?.favorite || [],
  };

  updatedCollections[status] = updatedCollections[status].filter(
    (item) => !(item.id === mediaId && item.type === mediaType)
  );

  await axios.patch(`${BASE_URL}/${userId}`, { collections: updatedCollections });

  return updatedCollections;
};


