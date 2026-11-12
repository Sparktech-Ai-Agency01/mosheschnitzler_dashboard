import { useMemo, useState } from "react";
import { Table, Modal, Input, Tag, Button, message } from "antd";
import {
  SearchOutlined,
  ExpandOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useGetAllEventsQuery,
  useUpdateEventStatusMutation,
} from "../redux/api/eventApi";

const statusStyles = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-600",
};

const statusLabels = {
  active: "Active",
  pending: "Pending",
  rejected: "Reject",
};

const EventDetailsModal = ({ event, onClose, onUpdate, isUpdating }) => {
  if (!event) return null;

  const eventTitle =
    event.eventTitle || event.title || event.name || "Event Details";
  const eventCategory = event.category || "Event";
  const eventAddress =
    event.userAddress || event.venue || event.location || "—";
  const publishedDate =
    event.eventPublished || event.publishedAt || event.date || "—";
  const userName = event.userName || event.name || "—";
  const userEmail = event.userEmail || event.email || "—";
  const userPhoneNumber =
    event.userPhoneNumber || event.phoneNumber || "—";
  const eventId = event.id || event._id;

  const rawStatus = (event.eventStatus || event.status || "pending")
    .toString()
    .toLowerCase()
    .trim();
  const isPending =
    rawStatus === "pending" || rawStatus === "pendding";
  const isActive =
    rawStatus === "active" || rawStatus === "approve" || rawStatus === "approved";

  const eventImage =
    event.image ||
    event.eventImage ||
    (event.userPicture?.trim() ? event.userPicture : null) ||
    "https://images.unsplash.com/photo-1519225421980-888cb5c46c4f?w=600";

  return (
    <Modal
      open={!!event}
      onCancel={onClose}
      footer={null}
      centered
      width={390}
      destroyOnHidden
      styles={{
        body: { padding: 0 },
        content: { padding: 0, overflow: "hidden", borderRadius: 12 },
      }}
    >
      <div className="max-h-[85vh] overflow-y-auto bg-white p-3">
        {/* <img
          src={eventImage}
          alt={eventTitle}
          className="h-28 w-full rounded-md object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1519225421980-888cb5c46c4f?w=600";
          }}
        /> */}

        <div className="mt-3">
          <span className="inline-block rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
            {eventCategory}
          </span>

          <h2 className="mt-2 text-base font-bold leading-snug text-gray-900">
            {eventTitle}
          </h2>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5">
            <CalendarOutlined className="text-amber-500" />
            <div className="text-[11px] text-gray-700">
              <p className="font-medium">{publishedDate}</p>
              {event.time && <p className="text-gray-500">{event.time}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5">
            <EnvironmentOutlined className="text-amber-500" />
            <p className="text-[11px] text-gray-700">{eventAddress}</p>
          </div>
        </div>

        {event.description &&
          event.description.trim() &&
          event.description !== "No description provided." && (
            <>
              <h3 className="mb-2 mt-4 text-xs font-bold text-gray-900">
                About This Event
              </h3>
              <p className="text-[11px] leading-relaxed text-gray-600">
                {event.description}
              </p>
            </>
          )}

        <h3 className="mb-2 mt-3 text-xs font-bold text-gray-900">
          User & Event Info
        </h3>

        <div className="space-y-2">
          <DetailItem label="Event Title" value={eventTitle} />
          <DetailItem label="Category" value={eventCategory} />
          <DetailItem label="User Name" value={userName} />
          <DetailItem label="Email" value={userEmail} />
          <DetailItem label="Phone" value={userPhoneNumber} />
          <DetailItem label="Address" value={eventAddress} />
          <DetailItem
            label="Status"
            value={
              event.eventStatus ||
              statusLabels[event.status] ||
              event.status
            }
          />
          {event.userLat !== null &&
            event.userLat !== undefined &&
            event.userLong !== null &&
            event.userLong !== undefined && (
              <DetailItem
                label="Coordinates"
                value={`${event.userLat}, ${event.userLong}`}
              />
            )}
          {event.boyName && event.boyName !== "—" && (
            <DetailItem label="Boy's Name" value={event.boyName} />
          )}
          {event.fatherName && event.fatherName !== "—" && (
            <DetailItem label="Father's Name" value={event.fatherName} />
          )}
          {event.sonOfRabbi && event.sonOfRabbi !== "—" && (
            <DetailItem label="Son of Rabbi" value={event.sonOfRabbi} />
          )}
          {event.sonInLaw && event.sonInLaw !== "—" && (
            <DetailItem label="Son-in-law of Rabbi" value={event.sonInLaw} />
          )}
        </div>

        {isPending ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={isUpdating}
              className="!h-9 !border-[#F7B115] !bg-[#F7B115] hover:!bg-[#e0a012] !text-xs !font-semibold"
              onClick={() => onUpdate(eventId, "Approve")}
            >
              Approve
            </Button>

            <Button
              danger
              icon={<CloseOutlined />}
              loading={isUpdating}
              className="!h-9 !text-xs !font-semibold"
              onClick={() => onUpdate(eventId, "Reject")}
            >
              Reject
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <Tag color={isActive ? "green" : "red"}>
              {event.eventStatus || statusLabels[event.status] || event.status}
            </Tag>
            {isActive ? (
              <Button
                danger
                size="small"
                loading={isUpdating}
                className="!text-xs"
                onClick={() => onUpdate(eventId, "Reject")}
              >
                Reject Event
              </Button>
            ) : (
              <Button
                type="primary"
                size="small"
                loading={isUpdating}
                className="!border-[#F7B115] !bg-[#F7B115] hover:!bg-[#e0a012] !text-xs"
                onClick={() => onUpdate(eventId, "Approve")}
              >
                Approve Event
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex items-center gap-2 rounded-lg border border-gray-100 p-2">
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-500">
      <UserOutlined className="text-xs" />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="break-words text-[11px] font-medium text-gray-800">
        {value || "—"}
      </p>
    </div>
  </div>
);

const EventManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetAllEventsQuery({ status: filter });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateEventStatusMutation();

  const rawEvents = useMemo(() => {
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.data?.events)) return responseData.data.events;
    if (Array.isArray(responseData?.data?.data)) return responseData.data.data;
    if (Array.isArray(responseData?.events)) return responseData.events;
    return [];
  }, [responseData]);

  const events = useMemo(() => {
    return rawEvents.map((item) => {
      const rawStatus = (item.eventStatus || item.status || "pending")
        .toString()
        .toLowerCase()
        .trim();
      const normalizedStatus =
        rawStatus === "reject" || rawStatus === "rejected"
          ? "rejected"
          : rawStatus === "active" ||
            rawStatus === "approve" ||
            rawStatus === "approved"
          ? "active"
          : "pending";

      const id = item.id || item._id;
      const userName = item.userName || item.name || "Unknown";
      const userEmail = item.userEmail || item.email || "—";
      const userPhoneNumber =
        item.userPhoneNumber || item.phoneNumber || "—";
      const userAddress =
        item.userAddress ||
        item.userLocation ||
        item.location ||
        item.address ||
        "—";
      const eventPublished =
        item.eventPublished || item.publishedAt || item.date || "—";
      const eventTitle =
        item.eventTitle || item.title || item.eventName || "Event";
      const category = item.category || item.eventType || "Event";
      const eventStatus =
        item.eventStatus ||
        (normalizedStatus === "active"
          ? "Active"
          : normalizedStatus === "rejected"
          ? "Reject"
          : "Pending");
      const userPicture =
        item.userPicture || item.picture || item.avatar || "";

      return {
        ...item,
        id,
        _id: id,
        userName,
        name: userName,
        userEmail,
        email: userEmail,
        userPhoneNumber,
        phoneNumber: userPhoneNumber,
        userAddress,
        location: userAddress,
        venue: item.venue || userAddress,
        eventPublished,
        publishedAt: eventPublished,
        date: item.date || item.eventDate || eventPublished,
        eventTitle,
        title: eventTitle,
        category,
        eventStatus,
        status: normalizedStatus,
        userPicture,
        userLat: item.userLat ?? null,
        userLong: item.userLong ?? null,
        image:
          item.image ||
          item.eventImage ||
          (userPicture?.trim() ? userPicture : null) ||
          "https://images.unsplash.com/photo-1519225421980-888cb5c46c4f?w=600",
        time: item.time || item.eventTime || "",
        description: item.description || "",
        boyName: item.boyName || item.childName || "—",
        fatherName: item.fatherName || "—",
        sonOfRabbi: item.sonOfRabbi || "—",
        sonInLaw: item.sonInLaw || "—",
      };
    });
  }, [rawEvents]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const currentStatus = (event.status || "").toLowerCase();
      const matchesFilter =
        filter === "all" ||
        currentStatus === filter.toLowerCase() ||
        (filter === "rejected" &&
          (currentStatus === "reject" || currentStatus === "rejected")) ||
        (filter === "active" &&
          (currentStatus === "active" ||
            currentStatus === "approve" ||
            currentStatus === "approved"));

      if (!matchesFilter) return false;

      if (!search.trim()) return true;
      const query = search.toLowerCase().trim();

      return [
        event.eventTitle,
        event.title,
        event.category,
        event.userName,
        event.name,
        event.userEmail,
        event.email,
        event.userPhoneNumber,
        event.phoneNumber,
        event.userAddress,
        event.location,
        event.venue,
        event.eventPublished,
        event.publishedAt,
        event.eventStatus,
        event.status,
      ].some((value) => value?.toString().toLowerCase().includes(query));
    });
  }, [events, filter, search]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      setSelectedEvent(null);
      message.success(
        status === "Approve" || status === "active" || status === "Active"
          ? "Event approved successfully"
          : "Event rejected successfully"
      );
    } catch (err) {
      message.error(
        err?.data?.message || err?.error || "Failed to update event status"
      );
    }
  };

  const columns = [
    {
      title: "#",
      key: "avatar",
      width: 55,
      render: (_, record) => {
        const avatarUrl =
          record.userPicture?.trim() ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            record.userName || record.name || "User"
          )}&background=F7B115&color=fff`;
        return (
          <img
            src={avatarUrl}
            alt={record.userName || record.name}
            className="h-8 w-8 rounded-full object-cover border border-gray-100"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                record.userName || record.name || "User"
              )}&background=F7B115&color=fff`;
            }}
          />
        );
      },
    },
    {
      title: "User",
      key: "user",
      width: 140,
      render: (_, record) => (
        <div>
          <p className="text-[11px] font-medium text-gray-800">
            {record.userName || record.name}
          </p>
          <p className="text-[10px] text-gray-500">
            {record.userEmail || record.email}
          </p>
        </div>
      ),
    },
    {
      title: "Event Title",
      key: "eventTitle",
      width: 140,
      render: (_, record) => (
        <div>
          <p className="text-[11px] font-medium text-gray-800 line-clamp-1">
            {record.eventTitle || record.title || "—"}
          </p>
          {record.category && (
            <span className="inline-block mt-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
              {record.category}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Phone Number",
      dataIndex: "userPhoneNumber",
      key: "phoneNumber",
      width: 125,
      render: (value, record) => value || record.phoneNumber || "—",
    },
    {
      title: "Address",
      dataIndex: "userAddress",
      key: "location",
      width: 150,
      render: (value, record) => value || record.location || "—",
    },
    {
      title: "Event Published Date",
      dataIndex: "eventPublished",
      key: "publishedAt",
      width: 140,
      render: (value, record) => {
        const val = value || record.publishedAt;
        if (!val || val === "—") return "—";
        const dateObj = new Date(val);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }
        return val;
      },
    },
    {
      title: "Status",
      dataIndex: "eventStatus",
      key: "status",
      width: 95,
      render: (status, record) => {
        const normalized = (record.status || status || "").toLowerCase();
        const style = statusStyles[normalized] || "bg-gray-100 text-gray-700";
        const label =
          statusLabels[normalized] ||
          record.eventStatus ||
          status ||
          "Pending";
        return (
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${style}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      title: "Details",
      key: "details",
      width: 70,
      align: "center",
      render: (_, record) => (
        <button
          type="button"
          onClick={() => setSelectedEvent(record)}
          aria-label={`View ${
            record.eventTitle || record.title || record.name
          }`}
          className="text-gray-800 transition hover:text-amber-500 cursor-pointer"
        >
          <ExpandOutlined />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-4 bg-white p-4 md:p-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Events Management
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          View, search, and manage all Events
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 md:flex-row md:items-center md:justify-between">
        <Input
          allowClear
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Search by title, category, user, phone, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!h-9 !w-full md:!max-w-sm"
        />

        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Events", value: "all" },
            { label: "Active", value: "active" },
            { label: "Pending", value: "pending" },
            { label: "Reject", value: "rejected" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition cursor-pointer ${
                filter === item.value
                  ? "bg-[#F7B115] text-white"
                  : "border border-gray-100 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey={(record) => record.id || record._id}
          pagination={false}
          loading={isLoading || isFetching}
          scroll={{ x: 880 }}
          size="small"
          locale={{
            emptyText: isLoading ? "Loading events..." : "No events found",
          }}
          rowClassName="text-xs"
        />
      </div>

      <EventDetailsModal
        event={selectedEvent}
        isUpdating={isUpdating}
        onClose={() => setSelectedEvent(null)}
        onUpdate={handleUpdateStatus}
      />
    </div>
  );
};

export default EventManagement;