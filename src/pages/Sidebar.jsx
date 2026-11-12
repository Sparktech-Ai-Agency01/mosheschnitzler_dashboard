import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoSettingsOutline } from "react-icons/io5";
import { CiCircleInfo } from "react-icons/ci";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MonitorCloud } from "lucide-react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../redux/api/authApi";
import { baseApi } from "../redux/api/baseApi";

const SidebarItem = ({ to, icon, label }) => {
  const Icon = icon;

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `w-full px-4 py-3 rounded-2xl flex items-center group transition-all duration-200 ${
            isActive
              ? "bg-[#F7B115] text-white"
              : "text-[#0F0B18] hover:bg-neutral-800 hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`mr-3 size-5 ${
                isActive ? "text-white" : "group-hover:text-white"
              }`}
            />
            <span className="font-medium">{label}</span>
          </>
        )}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ sidebarVisible }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      dispatch(baseApi.util.resetApiState());
      toast.success("Logged out successfully");
      setShowLogoutModal(false);
      navigate("/login");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen flex flex-col p-5 transition-all duration-300 bg-[#F0EAF3] text-[#0F0B18] z-50 ${
        sidebarVisible ? "w-64" : "w-24"
      }`}
    >
      <div className="flex items-center justify-between mb-8 w-full relative">
        {sidebarVisible && (
          <div className="w-full flex justify-center">
            {/* <img src={logo} alt="Logo" className="h-14 w-auto" /> */}
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar">
        <ul className="space-y-2">
          <SidebarItem
            to="/dashboard"
            icon={LuLayoutDashboard}
            label="Overview"
          />
          <SidebarItem
            to="/user-management"
            icon={LiaUserFriendsSolid}
            label="User Management"
          />
          <SidebarItem
            to="/add-metal-price"
            icon={MonitorCloud}
            label="Events"
          />

          <li className="relative group/parent">
            <button className="w-full px-4 py-3 rounded-2xl flex items-center group transition-all text-[#0F0B18] hover:bg-neutral-800 hover:text-white cursor-pointer">
              <IoSettingsOutline className="mr-3 size-5 group-hover:text-white" />
              <span className="font-medium">Settings</span>
              <FaChevronRight className="ml-auto w-3 h-3 transition-transform duration-300 group-hover/parent:rotate-90" />
            </button>
            <ul className="pl-4 mt-2 space-y-2 hidden group-hover/parent:block border-l border-neutral-800 ml-4">
              <SidebarItem
                to="/editProfile"
                icon={CgProfile}
                label="Edit Profile"
              />
              <SidebarItem
                to="/aboutUs"
                icon={CiCircleInfo}
                label="About Us"
              />
              <SidebarItem
                to="/privacySettings"
                icon={MdOutlinePrivacyTip}
                label="Privacy Settings"
              />
              <SidebarItem
                to="/termsAndConditions"
                icon={FaRegNewspaper}
                label="Terms & Conditions"
              />
            </ul>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-neutral-300">
        {sidebarVisible ? (
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
            className="w-full px-4 py-3 rounded-2xl text-neutral-600 hover:text-white hover:bg-neutral-800 flex items-center transition-all cursor-pointer disabled:opacity-50"
          >
            <FaSignOutAlt className="mr-3 size-5" />
            <span className="font-medium">Log Out</span>
          </button>
        ) : (
          <div className="flex justify-center pb-4">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              disabled={isLoggingOut}
              className="text-neutral-500 hover:text-red-500 cursor-pointer bg-transparent border-none p-1"
              title="Log Out"
            >
              <FaSignOutAlt className="size-6" />
            </button>
          </div>
        )}
      </div>

      <Modal
        open={showLogoutModal}
        onCancel={() => !isLoggingOut && setShowLogoutModal(false)}
        footer={null}
        centered
        width={380}
        destroyOnHidden
      >
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <FaSignOutAlt className="text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Log Out
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to log out of your account?
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;