import React, { useEffect, useState, useRef } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { socket, setSocketUser } from "../services/socket";
import {
  Home,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
  BriefcaseBusiness,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getUnreadNotificationCount,
  markNotificationsAsRead,
} from "../services/api";
import { AnimatePresence, motion } from "framer-motion";

const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?._id) {
      setSocketUser(null);
      return;
    }
    
    // Ensure persistent authenticated socket
    setSocketUser(user._id);

    const fetchInitialCounts = async () => {
      try {
        const { count } = await getUnreadNotificationCount();
        setNotificationCount(count);
      } catch (error) {
        console.error("Could not fetch notification count:", error);
      }
    };
    fetchInitialCounts();

    const handleNewNotification = (notification) => {
      setNotificationCount((prev) => prev + 1);
      toast.info(notification.message || "You have a new notification!");
    };

    const handleNewMessage = () => {
      if (!window.location.pathname.startsWith("/messages")) {
        setMessageCount((prev) => prev + 1);
      }
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("newMessageNotification", handleNewMessage);

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("newMessageNotification", handleNewMessage);
    };
  }, [user?._id]);

  useEffect(() => {
    const clearBadgesOnVisit = async () => {
      if (
        location.pathname.startsWith("/notifications") &&
        notificationCount > 0
      ) {
        try {
          await markNotificationsAsRead();
          setNotificationCount(0);
        } catch (error) {
          console.error("Could not mark notifications as read:", error);
        }
      }
      if (location.pathname.startsWith("/messages")) {
        setMessageCount(0);
      }
    };
    clearBadgesOnVisit();
  }, [location.pathname, notificationCount]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
    }`;

  if (!user) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  const isFreelancer = user?.role === "freelancer";
  const isClient = user?.role === "client";

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles size={18} className="animate-pulse" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Freelancer<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex-1 max-w-md mx-6 hidden md:block"
            >
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={17}
              />
              <input
                type="text"
                placeholder="Search projects, skills, people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-full pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </form>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              <NavLink to="/home" className={navLinkClass} end title="Home Feed">
                <Home size={18} />
                <span>Home</span>
              </NavLink>

              {isFreelancer && (
                <NavLink
                  to="/find-work"
                  className={navLinkClass}
                  title="Explore Available Projects"
                >
                  <BriefcaseBusiness size={18} />
                  <span>Find Work</span>
                </NavLink>
              )}

              {isClient && (
                <Link
                  to="/project/new"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <PlusCircle size={17} />
                  <span>Post Job</span>
                </Link>
              )}

              <NavLink
                to={
                  user?.role === "client"
                    ? "/client"
                    : user?.role === "freelancer"
                    ? "/freelancer"
                    : "/dashboard"
                }
                className={({ isActive }) =>
                  isActive ||
                  location.pathname.startsWith("/dashboard") ||
                  location.pathname.startsWith("/client") ||
                  location.pathname.startsWith("/freelancer")
                    ? navLinkClass({ isActive: true })
                    : navLinkClass({ isActive })
                }
                title="My Projects & Contracts"
              >
                <Briefcase size={18} />
                <span>Projects</span>
              </NavLink>

              <NavLink to="/messages" className={navLinkClass} title="Direct Messages">
                <div className="relative flex items-center">
                  <MessageSquare size={18} />
                  {messageCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                      {messageCount}
                    </span>
                  )}
                </div>
                <span>Messages</span>
              </NavLink>

              <NavLink
                to="/notifications"
                className={navLinkClass}
                title="Notifications"
              >
                <div className="relative flex items-center">
                  <Bell size={18} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
                <span>Alerts</span>
              </NavLink>

              {/* User Dropdown */}
              <div className="relative ml-2" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100/80 transition-all border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {user.profilePictureUrl ? (
                    <img
                      src={user.profilePictureUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-slate-500 transition-transform duration-200 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-2.5 border-b border-slate-100">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={`/profile/${user._id}`}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <UserIcon size={16} />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to={isClient ? "/client" : "/freelancer"}
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Briefcase size={16} />
                          <span>Workspace Dashboard</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            setSocketUser(null);
                            logout();
                            navigate("/login");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left cursor-pointer"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-4 space-y-2 overflow-hidden shadow-lg"
            >
              <form onSubmit={handleSearchSubmit} className="relative mb-3">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search projects, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>

              <NavLink to="/home" className={navLinkClass} end>
                <Home size={18} />
                <span>Home</span>
              </NavLink>

              {isFreelancer && (
                <NavLink to="/find-work" className={navLinkClass}>
                  <BriefcaseBusiness size={18} />
                  <span>Find Work</span>
                </NavLink>
              )}

              {isClient && (
                <NavLink to="/project/new" className={navLinkClass}>
                  <PlusCircle size={18} />
                  <span>Post a Project</span>
                </NavLink>
              )}

              <NavLink
                to={isClient ? "/client" : "/freelancer"}
                className={navLinkClass}
              >
                <Briefcase size={18} />
                <span>My Projects</span>
              </NavLink>

              <NavLink to="/messages" className={navLinkClass}>
                <MessageSquare size={18} />
                <span>Messages</span>
                {messageCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                    {messageCount}
                  </span>
                )}
              </NavLink>

              <NavLink to="/notifications" className={navLinkClass}>
                <Bell size={18} />
                <span>Notifications</span>
                {notificationCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                    {notificationCount}
                  </span>
                )}
              </NavLink>

              <div className="pt-3 border-t border-slate-200 space-y-1">
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <UserIcon size={18} />
                  <span>My Profile ({user.name})</span>
                </Link>
                <button
                  onClick={() => {
                    setSocketUser(null);
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Modern Minimal Footer */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/50 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Freelancer Project Hub. Built with MERN Stack.</p>
          <div className="flex items-center gap-4 text-slate-600">
            <Link to="/home" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/find-work" className="hover:text-blue-600 transition-colors">Find Work</Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
