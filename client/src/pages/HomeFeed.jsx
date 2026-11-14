import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllPosts, getMyConnections } from '../services/api';
import PostCard from '../components/PostCard.jsx';
import CreatePost from '../components/CreatePost.jsx';
import { Search, Users, Sparkles, TrendingUp, FolderPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-36 bg-slate-200/70 rounded-3xl" />
          <div className="h-48 bg-slate-200/70 rounded-3xl" />
          <div className="h-48 bg-slate-200/70 rounded-3xl" />
        </div>
        <div className="hidden lg:block lg:col-span-4">
          <div className="h-64 bg-slate-200/70 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Stream */}
      <div className="lg:col-span-8 space-y-4">
        {/* Mobile Search */}
        <form onSubmit={handleSearchSubmit} className="relative lg:hidden mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text"
            placeholder="Search projects, skills, discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

      {/* Sidebar: Network & Quick Links */}
      <div className="hidden lg:block lg:col-span-4 space-y-6">
        {/* Network widget */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs sticky top-24 space-y-5">
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
              {connections.slice(0, 6).map((connection) => (
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
            <p className="text-xs text-slate-500 py-2">
              You haven't connected with peers or clients yet. Visit member profiles to connect!
            </p>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Shortcuts
            </p>
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
      </div>
    </div>
  );
};

export default HomeFeed;
