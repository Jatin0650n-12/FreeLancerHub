import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts, getMyConnections } from '../services/api';
import PostCard from '../components/PostCard.jsx';
import CreatePost from '../components/CreatePost.jsx';
import {
  Search,
  Users,
  Sparkles,
  TrendingUp,
  FolderPlus,
  Hash,
  BriefcaseBusiness,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TRENDING_TOPICS = [
  { tag: 'FullStack', posts: '1.2k posts' },
  { tag: 'React19', posts: '850 posts' },
  { tag: 'Razorpay', posts: '620 posts' },
  { tag: 'TailwindCSS', posts: '940 posts' },
  { tag: 'RemoteWork', posts: '2.1k posts' },
];

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsData, connectionsData] = await Promise.all([
          getAllPosts(),
          getMyConnections(),
        ]);
        setPosts(postsData || []);
        setConnections(connectionsData || []);
      } catch (err) {
        setError('Failed to fetch data for the feed.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-32 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs shimmer-card" />
          <div className="h-64 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs shimmer-card" />
          <div className="h-64 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs shimmer-card" />
        </div>
        <div className="hidden lg:block lg:col-span-4 space-y-4">
          <div className="h-48 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs shimmer-card" />
          <div className="h-64 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs shimmer-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 max-w-xl mx-auto">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
      {/* Main Stream */}
      <div className="lg:col-span-8 space-y-5">
        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="relative lg:hidden">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search projects, skills, discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
          />
        </form>

        <CreatePost onPostCreated={handleNewPost} />

        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Your feed is clean and ready</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Be the first to share an update, discuss a project milestone, or post a gig for the community.
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </div>

      {/* Sidebar: Profile, Network & Trending */}
      <div className="hidden lg:block lg:col-span-4 space-y-6">
        {/* Mini Profile Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 -mx-6 -mt-6 mb-4 relative" />
          <div className="flex items-center gap-3 relative -mt-10 mb-3">
            {user?.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg ring-4 ring-white shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="pt-4 min-w-0">
              <h3 className="font-extrabold text-base text-slate-900 truncate">{user?.name}</h3>
              <p className="text-xs text-slate-400 capitalize font-medium">{user?.role} Account</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Verified Member</span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck size={14} /> Active
            </span>
          </div>

          <Link
            to={`/profile/${user?._id}`}
            className="mt-4 w-full block text-center py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            View Full Profile
          </Link>
        </div>

        {/* Network widget */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={16} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">My Network</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {connections.length}
            </span>
          </div>

          {connections.length > 0 ? (
            <ul className="space-y-2">
              {connections.slice(0, 5).map((connection) => (
                <li key={connection._id}>
                  <Link
                    to={`/profile/${connection._id}`}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group"
                  >
                    {connection.profilePictureUrl ? (
                      <img
                        src={connection.profilePictureUrl}
                        alt={connection.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {connection.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                        {connection.name}
                      </p>
                      <p className="text-[11px] text-slate-400 capitalize truncate">
                        {connection.role}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 py-1 leading-relaxed">
              You haven't connected with peers or clients yet. Visit member profiles to connect!
            </p>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-3 border-t border-slate-100">
            {user?.role === 'client' ? (
              <Link
                to="/project/new"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
              >
                <FolderPlus size={15} />
                <span>Post a New Project</span>
              </Link>
            ) : (
              <Link
                to="/find-work"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
              >
                <Search size={15} />
                <span>Explore Open Opportunities</span>
              </Link>
            )}
          </div>
        </div>

        {/* Trending Community Topics */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <TrendingUp size={16} className="text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Trending in Tech</h3>
          </div>
          <div className="space-y-2.5 pt-1">
            {TRENDING_TOPICS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs hover:bg-slate-50 p-1.5 rounded-xl transition-colors cursor-pointer"
                onClick={() => navigate(`/search?q=${item.tag}`)}
              >
                <span className="font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1">
                  <Hash size={13} className="text-slate-400" />
                  {item.tag}
                </span>
                <span className="text-[11px] text-slate-400">{item.posts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
