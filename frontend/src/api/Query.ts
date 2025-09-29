import { QueryClient } from "@tanstack/react-query"
import axios from "axios"

const queryClient = new QueryClient()

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
})

export { queryClient, axiosInstance as axios }
