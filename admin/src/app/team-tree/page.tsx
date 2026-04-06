"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitGraph, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  ChevronRight, 
  ChevronDown,
  Layout,
  Users,
  Target,
  Maximize2,
  Minimize2,
  Loader2,
  Shield,
  Briefcase,
  GitBranch
} from "lucide-react";
import { getUsers, User } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TeamStructureView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(getUsers());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const buildHierarchy = (parentId: string | null = null): any[] => {
    return users
      .filter(u => u.reportingTo === parentId || (!u.reportingTo && parentId === null && (u.role === 'Super Admin' || u.role === 'Sales Head')))
      .map(user => ({
        ...user,
        children: buildHierarchy(user.id)
      }));
  };

  const TreeNode = ({ node, level = 0 }: { node: any, level?: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children.length > 0;

    return (
      <div className="flex flex-col items-center relative">
        {/* Connection Line to Parent */}
        {level > 0 && (
          <div className="absolute top-[-30px] w-[2px] h-[30px] bg-slate-200" />
        )}

        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: level * 0.1 }}
          className={cn(
             "relative p-6 rounded-3xl border-2 transition-all cursor-pointer group hover:shadow-2xl hover:scale-105 min-w-[280px] bg-white text-left",
             selectedNode === node.id ? "border-[#b66dff] shadow-xl shadow-purple-500/10" : "border-slate-100 shadow-sm"
          )}
          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        >
           {/* Hierarchy Badge */}
           <div className={cn(
             "absolute -top-3 left-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg",
             node.role === 'Sales Head' ? 'grad-purple' : 'bg-slate-800'
           )}>
              {node.role}
           </div>

           <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl grad-brand text-white flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/10 group-hover:rotate-6 transition-transform">
                 {node.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="flex-1">
                 <h4 className="text-base font-black text-slate-800 mb-1">{node.name}</h4>
                 <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", node.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300')} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{node.region || node.state || node.city || 'Pan India'} Scope</span>
                 </div>
              </div>
           </div>

           {/* Expandable Meta Info */}
           <AnimatePresence>
             {selectedNode === node.id && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden bg-slate-50 p-4 mt-5 rounded-2xl space-y-4"
               >
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                     <Mail size={14} className="text-[#b66dff]" />
                     {node.email}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                     <Target size={14} className="text-emerald-500" />
                     {node.moduleAccess.join(', ')}
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Toggle Expansion Button */}
           {hasChildren && (
             <button 
               onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
               className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#b66dff] hover:border-[#b66dff] transition-all shadow-md z-10"
             >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
             </button>
           )}
        </motion.div>

        {/* Children Connection Lines */}
        {isExpanded && hasChildren && (
          <>
            <div className="w-[2px] h-[40px] bg-slate-200" />
            <div className="flex gap-12 relative px-12">
               {/* Horizontal branch line */}
               {node.children.length > 1 && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-slate-200" 
                      style={{ 
                         width: `calc(100% - ${280}px)` 
                      }} 
                 />
               )}
               {node.children.map((child: any) => (
                 <TreeNode key={child.id} node={child} level={level + 1} />
               ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen animate-in fade-in duration-1000 flex flex-col">
       
       {/* Full-Screen Visual Header */}
       <div className="flex items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 rounded-2xl grad-brand text-white flex items-center justify-center shadow-xl shadow-purple-500/20">
                <GitGraph size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 m-0 tracking-tight">Organizational Structure</h1>
                <p className="text-sm text-slate-400 font-medium mt-1">Personnel hierarchy and reporting lines</p>
             </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex">
                <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="p-3 text-slate-400 hover:text-slate-600 border-r border-slate-50"><Minimize2 size={20} /></button>
                <div className="px-5 flex items-center justify-center text-xs font-black text-slate-800">{Math.round(zoom * 100)}% Scale</div>
                <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="p-3 text-slate-400 hover:text-slate-600 border-l border-slate-50"><Maximize2 size={20} /></button>
             </div>
          </div>
       </div>

       {/* Interactive Visual Canvas */}
       <div className="flex-1 bg-slate-50/50 rounded-[3rem] border border-slate-100/50 shadow-inner overflow-auto relative custom-scrollbar">
          {loading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-[#b66dff]" size={40} />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Loading organizational structure...</p>
             </div>
          ) : (
            <div 
              className="p-20 flex flex-col items-center min-w-max transition-transform duration-300 origin-top"
              style={{ transform: `scale(${zoom})` }}
            >
               {buildHierarchy().map(root => (
                 <TreeNode key={root.id} node={root} />
               ))}
            </div>
          )}

          {/* Hierarchy Legend */}
          <div className="fixed bottom-12 right-12 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 shadow-2xl flex flex-col gap-6 z-50">
             <p className="text-[10px] font-black uppercase tracking-widest text-[#b66dff]">Role Legend</p>
             <div className="space-y-4">
                {[
                  { label: 'Top Management', color: 'grad-purple' },
                  { label: 'Middle Management', color: 'bg-slate-800' },
                  { label: 'Active Staff', color: 'bg-emerald-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className={cn("w-3 h-3 rounded-full", item.color)} />
                     <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                  </div>
                ))}
             </div>
          </div>
       </div>

    </div>
  );
}
