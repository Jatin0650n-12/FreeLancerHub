import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAll } from '../services/api';
import PostCard from '../components/PostCard';
import { Search, Users, Briefcase, FileText, User } from 'lucide-react';

const SearchResultsPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (!query) {
      setResults({ jobs: [], people: [], posts: [] });
      setLoading(false);
      return;
    }
    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await searchAll(query);
        setResults(data || { jobs: [], people: [], posts: [] });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-14 bg-slate-200/70 rounded-2xl w-72" />
        <div className="h-44 bg-slate-200/70 rounded-3xl" />
      </div>
    );
  }

  const people = results?.people || [];
  const jobs = results?.jobs || [];
  const posts = results?.posts || [];
  const totalCount = people.length + jobs.length + posts.length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Search Results
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              "{query}"
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Found {totalCount} matching {totalCount === 1 ? 'item' : 'items'} across people, jobs, and discussions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-center">
            {[
              { id: 'all', label: 'All', count: totalCount },
              { id: 'people', label: 'People', count: people.length },
              { id: 'jobs', label: 'Jobs', count: jobs.length },
              { id: 'posts', label: 'Posts', count: posts.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* People Results */}
      {(activeTab === 'all' || activeTab === 'people') && people.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">People & Talent ({people.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {people.map((person) => (
              <Link
                to={`/profile/${person._id}`}
                key={person._id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex items-center gap-3.5 group"
              >
                {person.profilePictureUrl ? (
                  <img
                    src={person.profilePictureUrl}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs">
                    {person.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                    {person.name}
                  </p>
                  <p className="text-xs text-slate-400 capitalize truncate mt-0.5">
                    {person.role || 'Member'}
                  </p>
                  {person.skills?.length > 0 && (
                    <div className="flex gap-1 mt-1.5 overflow-hidden">
                      {person.skills.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Jobs Results */}
      {(activeTab === 'all' || activeTab === 'jobs') && jobs.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Job Opportunities ({jobs.length})</h2>
          </div>
          <div className="space-y-4">
            {jobs.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Posts Results */}
      {(activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Community Posts ({posts.length})</h2>
          </div>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {totalCount === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search size={26} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No results found for "{query}"</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try checking for spelling errors or searching for broader terms like "React", "Design", or "Developer".
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
