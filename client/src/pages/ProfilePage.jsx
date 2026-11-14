import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getUserProfile,
  getConnectionStatus,
  getReviewsForUser,
  getExperienceForUser,
  deleteExperience,
  getEducationForUser,
  deleteEducation,
  uploadProfilePicture,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

import PostCard from "../components/PostCard.jsx";
import ReviewList from "../components/ReviewList.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import EditProfile from "../components/EditProfile.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import DeleteAccount from "../components/DeleteAccount.jsx";
import ExperienceForm from "../components/ExperienceForm.jsx";
import EducationForm from "../components/EducationForm.jsx";
import { User, Settings, Star, Newspaper, Sparkles } from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [connectionInfo, setConnectionInfo] = useState({ status: null, data: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { userId } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const isOwnProfile = currentUser?._id === userId;

  const fetchProfileData = useCallback(async () => {
    try {
      const [profileData, statusData, reviewsData, expData, eduData] = await Promise.all([
        getUserProfile(userId),
        isOwnProfile
          ? Promise.resolve({ status: "self", connection: null })
          : getConnectionStatus(userId),
        getReviewsForUser(userId),
        getExperienceForUser(userId),
        getEducationForUser(userId),
      ]);
      setProfile(profileData);
      setConnectionInfo({ status: statusData.status, data: statusData.connection });
      setReviews(reviewsData || []);
      setExperience(expData || []);
      setEducation(eduData || []);
    } catch (err) {
      setError("Failed to load profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId, isOwnProfile]);

  useEffect(() => {
    setLoading(true);
    fetchProfileData();
  }, [userId]);

  const handleDeleteExperience = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience entry?")) {
      try {
        await deleteExperience(id);
        setExperience((prev) => prev.filter((item) => item._id !== id));
        toast.success("Experience removed.");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleDeleteEducation = async (id) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      try {
        await deleteEducation(id);
        setEducation((prev) => prev.filter((item) => item._id !== id));
        toast.success("Education entry removed.");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const updatedUser = await uploadProfilePicture(formData);
      updateUser(updatedUser);
      await fetchProfileData();
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-pulse">
        <div className="md:col-span-4 h-96 bg-slate-200/70 rounded-3xl" />
        <div className="md:col-span-8 space-y-4">
          <div className="h-14 bg-slate-200/70 rounded-2xl" />
          <div className="h-64 bg-slate-200/70 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-3xl text-rose-700">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl">
        <h3 className="font-bold text-slate-800">User profile not found</h3>
      </div>
    );
  }

  const { user, posts } = profile;

  const renderRightPanel = () => {
    switch (editMode) {
      case "edit-profile":
        return (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Edit Profile Details</h2>
            <EditProfile
              onSuccess={() => {
                setEditMode(null);
                fetchProfileData();
              }}
            />
          </div>
        );
      case "experience":
        return (
          <ExperienceForm
            onCancel={() => setEditMode(null)}
            onSuccess={() => {
              setEditMode(null);
              fetchProfileData();
            }}
          />
        );
      case "education":
        return (
          <EducationForm
            onCancel={() => setEditMode(null)}
            onSuccess={() => {
              setEditMode(null);
              fetchProfileData();
            }}
          />
        );
      case "settings":
        return (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
            <h2 className="text-xl font-bold text-slate-900">Account & Security Settings</h2>
            <ChangePassword />
            <div className="pt-6 border-t border-slate-100">
              <DeleteAccount />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Reviews Section */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-amber-500 fill-amber-500" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Client & Freelancer Reviews
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
                </span>
              </div>
              <ReviewList reviews={reviews} />
            </div>

            {/* Posts Activity Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Newspaper size={18} className="text-slate-500" />
                <h2 className="text-lg font-bold text-slate-900">Community Activity & Posts</h2>
              </div>
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-200/80 text-center text-xs text-slate-400 shadow-xs">
                  This user hasn't posted any updates yet.
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Left Profile Card */}
      <div className="md:col-span-4">
        <ProfileCard
          user={user}
          isUploading={isUploading}
          onAvatarSelect={handleAvatarUpload}
          connectionInfo={connectionInfo}
          experience={experience}
          education={education}
          isOwnProfile={isOwnProfile}
          onEditClick={(mode) => setEditMode(mode)}
          onDeleteExperience={handleDeleteExperience}
          onDeleteEducation={handleDeleteEducation}
          refetchProfile={fetchProfileData}
        />
      </div>

      {/* Right Content Panel */}
      <div className="md:col-span-8">
        {isOwnProfile && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1.5 mb-6 flex items-center gap-1.5">
            <button
              onClick={() => setEditMode(null)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !editMode
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Public Profile
            </button>
            <button
              onClick={() => setEditMode("edit-profile")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editMode === "edit-profile"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Edit Details
            </button>
            <button
              onClick={() => setEditMode("settings")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                editMode === "settings"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              Account Settings
            </button>
          </div>
        )}
        {renderRightPanel()}
      </div>
    </div>
  );
};

export default ProfilePage;
