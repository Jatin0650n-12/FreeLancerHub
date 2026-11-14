import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  sendConnectionRequest,
  startConversation,
  respondToRequest,
} from "../services/api";
import {
  UserPlus,
  Check,
  X,
  Clock,
  Star,
  MessageSquare,
  Plus,
  Pencil,
  LoaderCircle,
  Camera,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import EducationList from "./EducationList";
import ExperienceList from "./ExperienceList";

const StarRating = ({ rating = 0 }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold">
    <Star size={14} className="text-amber-500 fill-amber-500" />
    <span>{Number(rating).toFixed(1)} / 5</span>
  </div>
);

const ProfileCard = ({
  user,
  isUploading,
  onAvatarSelect,
  connectionInfo,
  experience = [],
  education = [],
  isOwnProfile,
  onEditClick,
  onDeleteExperience,
  onDeleteEducation,
  refetchProfile,
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleStartConversation = async () => {
    try {
      const conversation = await startConversation(user._id);
      navigate(`/messages/${conversation._id}`);
    } catch (error) {
      toast.error("Failed to start conversation.");
    }
  };

  const handleConnect = async () => {
    try {
      await sendConnectionRequest(user._id);
      toast.success("Connection request sent!");
      refetchProfile && refetchProfile();
    } catch (err) {
      toast.error(err.message || "Failed to send request.");
    }
  };

  const handleResponse = async (status) => {
    try {
      await respondToRequest(connectionInfo?.data?._id, status);
      toast.success(`Request ${status}.`);
      refetchProfile && refetchProfile();
    } catch (error) {
      toast.error(error.message || "Failed to respond.");
    }
  };

  const renderConnectButton = () => {
    if (!currentUser || isOwnProfile) return null;

    switch (connectionInfo?.status) {
      case "not_connected":
        return (
          <button
            onClick={handleConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Connect</span>
          </button>
        );
      case "pending":
        if (connectionInfo.data?.requester === currentUser._id) {
          return (
            <button
              disabled
              className="w-full bg-slate-100 text-slate-500 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs cursor-not-allowed border border-slate-200"
            >
              <Clock size={16} />
              <span>Request Pending</span>
            </button>
          );
        } else {
          return (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 text-center">
                Incoming Connection Request
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse("accepted")}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check size={14} /> Accept
                </button>
                <button
                  onClick={() => handleResponse("declined")}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X size={14} /> Decline
                </button>
              </div>
            </div>
          );
        }
      case "accepted":
        return (
          <div className="w-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs">
            <Check size={15} />
            <span>Connected</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs sticky top-24 space-y-6">
      {/* Avatar Header */}
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-3">
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-100 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-3xl text-white shadow-md">
              {user.name?.charAt(0) || "U"}
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
              <LoaderCircle className="animate-spin text-white" size={24} />
            </div>
          )}

          {isOwnProfile && !isUploading && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={onAvatarSelect}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md border-2 border-white transition-all cursor-pointer"
                title="Change Avatar"
              >
                <Camera size={14} />
              </button>
            </>
          )}
        </div>

        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
            {user.role}
          </span>
          <StarRating rating={user.averageRating || 0} />
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          {renderConnectButton()}
          {connectionInfo?.status !== "self" && (
            <button
              onClick={handleStartConversation}
              className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs shadow-xs cursor-pointer"
            >
              <MessageSquare size={16} />
              <span>Send Message</span>
            </button>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center mb-1.5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">About</h3>
          {isOwnProfile && (
            <button
              onClick={() => onEditClick && onEditClick("edit-profile")}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
              title="Edit Profile Details"
            >
              <Pencil size={13} />
            </button>
          )}
        </div>
        <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
          {user.bio || "No bio provided yet."}
        </p>
      </div>

      {/* Skills */}
      {user.role === "freelancer" && (
        <div className="border-t border-slate-100 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Skills & Expertise</h3>
            {isOwnProfile && (
              <button
                onClick={() => onEditClick && onEditClick("edit-profile")}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer"
              >
                <Pencil size={13} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-50 text-blue-700 border border-blue-200/70 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Briefcase size={14} className="text-slate-400" />
            <span>Experience</span>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => onEditClick("experience")}
              className="p-1 hover:bg-slate-100 rounded-lg text-blue-600 font-bold cursor-pointer"
              title="Add Experience"
            >
              <Plus size={15} />
            </button>
          )}
        </div>
        <ExperienceList
          experiences={experience}
          isOwnProfile={isOwnProfile}
          onDelete={onDeleteExperience}
        />
      </div>

      {/* Education */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <GraduationCap size={14} className="text-slate-400" />
            <span>Education</span>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => onEditClick("education")}
              className="p-1 hover:bg-slate-100 rounded-lg text-blue-600 font-bold cursor-pointer"
              title="Add Education"
            >
              <Plus size={15} />
            </button>
          )}
        </div>
        <EducationList
          educations={education}
          isOwnProfile={isOwnProfile}
          onDelete={onDeleteEducation}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
