import axios from "axios";
import { API_URL, DEFAULT_HEADERS } from "../config";

export const instance = axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS,
});
