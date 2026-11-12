import { baseApi } from "./baseApi";

export const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: (arg) => {
        let status = "all";
        let searchTerm = "";
        let page;
        let limit;

        if (typeof arg === "string") {
          status = arg;
        } else if (typeof arg === "object" && arg !== null) {
          if (arg.status) status = arg.status;
          if (arg.search || arg.searchTerm) searchTerm = arg.search || arg.searchTerm;
          if (arg.page) page = arg.page;
          if (arg.limit) limit = arg.limit;
        }

        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (searchTerm) params.append("search", searchTerm);
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);

        const queryString = params.toString();
        return {
          url: `/admin/events${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Events"],
    }),

    getEventById: builder.query({
      query: (id) => ({
        url: `/admin/events/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Events", id }],
    }),

    updateEventStatus: builder.mutation({
      query: ({ id, status }) => {
        let formattedStatus = status;
        let eventStatus = status;
        if (/^(active|approve|approved)$/i.test(status)) {
          formattedStatus = "Approve";
          eventStatus = "Active";
        } else if (/^(reject|rejected)$/i.test(status)) {
          formattedStatus = "Reject";
          eventStatus = "Reject";
        }

        return {
          url: `/admin/events/${id}/status`,
          method: "PATCH",
          body: {
            status: formattedStatus,
            eventStatus: eventStatus,
          },
        };
      },
      invalidatesTags: ["Events"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventStatusMutation,
} = eventApi;
