import React, { useState, useEffect } from 'react';
import { getNotifications, markNotificationsAsRead } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  ThumbsUp,
  MessageCircle,
  UserPlus,
  CheckCircle,
  FileText,
  Newspaper,
  Bell,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification }) => {
  const iconConfig = {
    new_like: {
      icon: <ThumbsUp size={16} />,
      bg: 'bg-blue-50 text-blue-600',
      label: 'liked your post.',
    },
    new_comment: {
      icon: <MessageCircle size={16} />,
      bg: 'bg-emerald-50 text-emerald-600',
      label: 'commented on your post.',
    },
    new_connection_request: {
      icon: <UserPlus size={16} />,
      bg: 'bg-purple-50 text-purple-600',
      label: 'sent you a connection request.',
    },
    connection_accepted: {
      icon: <CheckCircle size={16} />,
      bg: 'bg-emerald-50 text-emerald-600',
      label: 'accepted your connection request.',
    },
    new_proposal: {
      icon: <FileText size={16} />,
      bg: 'bg-amber-50 text-amber-600',
      label: 'submitted a proposal on your project.',
    },
    invoice_paid: {
      icon: <DollarSign size={16} />,
      bg: 'bg-emerald-50 text-emerald-600',
      label: 'paid your project invoice via Razorpay!',
    },
    new_post: {
      icon: <Newspaper size={16} />,
      bg: 'bg-indigo-50 text-indigo-600',
      label: 'shared a new post.',
    },
  };

  const current = iconConfig[notification.type] || {
    icon: <Bell size={16} />,
    bg: 'bg-slate-100 text-slate-600',
    label: 'sent you an update.',
  };

  const senderName = notification.sender?.name || 'A community member';
  const senderId = notification.sender?._id;

  let timeString = 'recently';
  try {
    timeString = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
  } catch (e) {}

  return (
    <li
      className={`p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/70 ${
        !notification.read ? 'bg-blue-50/40' : ''
      }`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs ${current.bg}`}
      >
        {current.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800 leading-snug">
          {senderId ? (
            <Link
              to={`/profile/${senderId}`}
              className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
            >
              {senderName}
            </Link>
          ) : (
            <span className="font-bold text-slate-900">{senderName}</span>
          )}{' '}
          <span className="text-slate-600">{current.label}</span>
        </p>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">{timeString}</span>
          {notification.link && (
            <Link
              to={notification.link}
              className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
            >
              <span>View</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {!notification.read && (
        <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
      )}
    </li>
  );
};

const NotificationsPage = ({ onPageOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMarkNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data || []);
        if (onPageOpen) onPageOpen();
      } catch (error) {
        toast.error('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchAndMarkNotifications();
  }, [onPageOpen]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
        <div className="h-10 bg-slate-200/70 rounded-xl w-48" />
        <div className="h-64 bg-slate-200/70 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding bids, messages, payments, and interactions.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
          {notifications.length} Total
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Bell size={22} />
            </div>
            <h3 className="font-bold text-sm text-slate-800">You're all caught up!</h3>
            <p className="text-xs text-slate-500 mt-1">No unread notifications at the moment.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((noti) => (
              <NotificationItem key={noti._id} notification={noti} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
