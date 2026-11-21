import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'saloha_session_token';

export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const saveToken = (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const clearToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);
