import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: ({ purchaseGrowthYear, customerGrowthYear }) => ({
        url: `/analytics/dashboard?purchaseGrowthYear=${purchaseGrowthYear}&customerGrowthYear=${customerGrowthYear}`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getUserGrowth: builder.query({
      query: (year) => {
        const selectedYear = typeof year === "object" ? year?.year : year;
        return {
          url: `/admin/dashboard/user-growth?year=${selectedYear || new Date().getFullYear()}`,
          method: "GET",
        };
      },
      providesTags: ["Dashboard"],
    }),
    getEventsOverview: builder.query({
      query: (year) => {
        const selectedYear = typeof year === "object" ? year?.year : year;
        return {
          url: `/admin/dashboard/events-overview?year=${selectedYear || new Date().getFullYear()}`,
          method: "GET",
        };
      },
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetUserGrowthQuery,
  useGetEventsOverviewQuery,
} = dashboardApi;
