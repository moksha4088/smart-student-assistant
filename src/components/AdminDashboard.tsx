import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Users,
  Activity,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { EMPTY_ROOMS } from '../data/collegeDatabase';

interface AdminDashboardProps {
  darkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ darkMode }) => {
  const [rooms, setRooms] = useState(EMPTY_ROOMS);

  const toggleRoomStatus = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const newStatus = r.status === 'Available' ? 'Occupied' : 'Available';
          return { ...r, status: newStatus as any };
        }
        return r;
      })
    );
  };

  return (
    <div id="admin-dashboard-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  College Administration & Facilities Hub
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  Campus Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Apex Institute of Engineering & Technology • Academic Year 2026-27
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campus-wide KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Total Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            1,240
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">Across 6 B.Tech streams</span>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Average Campus Attendance</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            79.2%
          </p>
          <span className="text-[11px] text-slate-500">Above 75% threshold</span>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Room Utilization</span>
            <Building className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
            74.5%
          </p>
          <span className="text-[11px] text-slate-500">Peak hours 10 AM - 1 PM</span>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Leave Requests</span>
            <CalendarCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            14
          </p>
          <span className="text-[11px] text-slate-500">4 Medical Condonations pending</span>
        </div>
      </div>

      {/* Classroom & Space Governance */}
      <div
        className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Live Classroom Space Allocation (Admin Override)
            </h2>
            <p className="text-xs text-slate-500">
              Toggle availability to update student app notifications instantly.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-2">Room</th>
                <th className="pb-2">Building / Floor</th>
                <th className="pb-2">Capacity</th>
                <th className="pb-2">Free Until</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rooms.map((room) => (
                <tr key={room.id} className="py-2.5">
                  <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                    {room.roomNumber}
                  </td>
                  <td className="py-2.5 text-slate-500">{room.building} ({room.floor})</td>
                  <td className="py-2.5 font-mono">{room.capacity} seats</td>
                  <td className="py-2.5 font-mono text-slate-600 dark:text-slate-300">{room.freeUntil}</td>
                  <td className="py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        room.status === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : room.status === 'Occupied'
                          ? 'bg-rose-500/10 text-rose-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => toggleRoomStatus(room.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-all"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
