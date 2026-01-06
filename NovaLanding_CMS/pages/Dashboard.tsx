
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    // Mock data
    const projects = [
        { id: '1', title: 'SaaS Startup Hero', lastModified: '2 mins ago', status: 'Published', thumbnail: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
        { id: '2', title: 'Coffee Shop Landing', lastModified: '1 day ago', status: 'Draft', thumbnail: 'bg-gradient-to-br from-orange-400 to-amber-600' },
        { id: '3', title: 'Portfolio 2024', lastModified: '3 days ago', status: 'Published', thumbnail: 'bg-gradient-to-br from-emerald-400 to-teal-600' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <Icons.Layers size={18} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-800">NovaLanding</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input type="text" placeholder="Search projects..." className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 w-64 outline-none" />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage your landing pages and projects.</p>
                    </div>
                    <button
                        onClick={() => navigate('/builder')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                    >
                        <Icons.Plus size={18} />
                        New Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Card (Alternative) */}
                    <div
                        onClick={() => navigate('/builder')}
                        className="group cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center h-64 hover:border-blue-500 hover:bg-blue-50 transition-all bg-slate-50 hover:bg-blue-50/50"
                    >
                        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                            <Icons.Plus size={32} />
                        </div>
                        <span className="font-semibold text-slate-600 group-hover:text-blue-600">Create New Site</span>
                    </div>

                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden group cursor-pointer relative">
                            {/* Thumbnail */}
                            <div className={`h-40 w-full ${project.thumbnail} group-hover:opacity-90 transition-opacity`}></div>

                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{project.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1">Edited {project.lastModified}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:bg-white text-slate-700 hover:text-blue-600 transition-colors" title="Settings">
                                    <Icons.Settings size={16} />
                                </button>
                                <button onClick={() => navigate('/builder')} className="p-2 bg-blue-600/90 backdrop-blur rounded-lg shadow-sm hover:bg-blue-600 text-white transition-colors" title="Edit">
                                    <Icons.Layout size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
