import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Wifi,
  Wind,
  Tv,
  Users,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { CAMPUS_LOCATIONS, EMPTY_ROOMS } from '../data/collegeDatabase';
import { CampusLocation, EmptyRoom } from '../types';

interface CampusExplorerProps {
  darkMode: boolean;
}

export const CampusExplorer: React.FC<CampusExplorerProps> = ({ darkMode }) => {
  const [activeMode, setActiveMode] = useState<'empty-rooms' | 'find-place'>('empty-rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('All');

  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredRooms = EMPTY_ROOMS.filter((room) => {
    if (buildingFilter !== 'All' && room.building !== buildingFilter) {
      return false;
    }
    return true;
  });

  return (
    <div id="campus-explorer-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-teal-500" />
              Campus & Room Navigator
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Live Facilities
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Locate empty classrooms for quiet study or get turn-by-turn directions across campus.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            id="campus-mode-rooms-btn"
            onClick={() => setActiveMode('empty-rooms')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeMode === 'empty-rooms'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Find Empty Classroom
          </button>
          <button
            id="campus-mode-places-btn"
            onClick={() => setActiveMode('find-place')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeMode === 'find-place'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Find a Place
          </button>
        </div>
      </div>

      {activeMode === 'empty-rooms' ? (
        /* Empty Rooms View */
        <div className="space-y-4">
          {/* Controls Bar */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Filter by Building:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Tech Block A', 'Tech Block B', 'Central Library'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setBuildingFilter(b)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      buildingFilter === b
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              Live status refreshed at 10:00 AM
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => {
              const isAvailable = room.status === 'Available';
              const isOccupied = room.status === 'Occupied';

              return (
                <div
                  key={room.id}
                  id={`room-card-${room.id}`}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isAvailable
                      ? darkMode
                        ? 'bg-teal-950/20 border-teal-800/40'
                        : 'bg-teal-50/40 border-teal-200'
                      : darkMode
                      ? 'bg-slate-800/80 border-slate-700 opacity-75'
                      : 'bg-white border-slate-200 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {room.building} • {room.floor}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isAvailable
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : isOccupied
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isAvailable ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{room.status}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {room.roomNumber}
                    </h3>

                    <div className="mt-2 space-y-1 text-xs">
                      <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-500" />
                        <span>Free Until: <strong>{room.freeUntil}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Capacity: {room.capacity} seats</span>
                      </p>
                    </div>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {room.features.map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <button
                      disabled={!isAvailable}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        isAvailable
                          ? 'bg-teal-600 hover:bg-teal-700 text-white active:scale-95 shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isAvailable ? 'Use for Study Session' : 'Currently In Use'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Find a Place Directory View */
        <div className="space-y-4">
          {/* Search Box */}
          <div
            className={`p-3 rounded-2xl border flex items-center gap-2 ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              id="campus-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name: 'Computer Lab', 'Library', 'Canteen', 'Seminar Hall'..."
              className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Locations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                id={`location-card-${loc.id}`}
                className={`p-5 rounded-2xl border transition-all space-y-2 ${
                  darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    {loc.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {loc.building} • {loc.floor}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {loc.name}
                </h3>

                <p className="text-xs text-slate-500">
                  Room: <strong>{loc.roomNumber}</strong>
                </p>

                {/* Step-by-step directions */}
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-600 dark:text-teal-400">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Turn-by-turn Directions:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {loc.directions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
