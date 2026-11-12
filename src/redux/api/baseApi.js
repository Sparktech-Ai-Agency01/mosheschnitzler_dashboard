import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../constants/data/baseUrl";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "PaymentMethods",
    "Users",
    "Metals",
    "Employee",
    "Order",
    "Assignment",
    "Dashboard",
    "Events",
    "terms",
    "aboutUs",
    "privacy",
    "Profile",
  ],
  endpoints: () => ({}),
});
