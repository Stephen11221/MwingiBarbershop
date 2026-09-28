import React, { useState, useEffect } from 'react';
import {
  LogIn,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  UserCheck,
  Shield,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  FileText
} from 'lucide-react';
import { AttendanceRecord, StaffMember } from '../types.ts';
import {
  clockInStaff,
  clockOutStaff,
  getAttendanceLog,
  getStaffList,
  getTodayDateStr,
  requestDayOff
} from '../utils/staffStorage.ts';

interface PublicClockPageProps {
  onBackToMain?: () => void;
  onNavigateAdminStaff?: () => void;
}

export const PublicClockPage: React.FC<PublicClockPageProps> = ({
  onBackToMain,
  onNavigateAdminStaff
}) => {
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'in' | 'out'>('in');
  const [pin, setPin] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const [todayRecords, setTodayRecords] = useState<AttendanceRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

  // Day off request modal
  const [dayOffModalOpen, setDayOffModalOpen] = useState(false);
  const [dayOffPin, setDayOffPin] = useState('');
  const [dayOffDate, setDayOffDate] = useState('');
  const [dayOffReason, setDayOffReason] = useState('');
  const [dayOffNotice, setDayOffNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live Clock updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
      setCurrentDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    const today = getTodayDateStr();
    const log = getAttendanceLog();
    const todays = log.filter(r => r.date === today);
    setTodayRecords(todays);
    setStaffList(getStaffList());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handle open PIN modal
  const handleOpenPin = (type: 'in' | 'out') => {
    setActionType(type);
    setPin('');
    setNotification(null);
    setPinModalOpen(true);
  };

  // Submit Clock In / Out with 4-digit PIN
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin || pin.length < 4) {
      setNotification({ type: 'error', message: 'Please enter your complete 4-digit PIN.' });
      return;
    }

    if (actionType === 'in') {
      const result = clockInStaff(pin.trim());
      if (result.success) {
        setNotification({ type: 'success', message: result.message });
        setPin('');
        setPinModalOpen(false);
        refreshData();
      } else {
        setNotification({ type: 'error', message: result.message });
      }
    } else {
      const result = clockOutStaff(pin.trim());
      if (result.success) {
        setNotification({ type: 'success', message: result.message });
        setPin('');
        setPinModalOpen(false);
        refreshData();
      } else {
        setNotification({ type: 'error', message: result.message });
      }
    }
  };

  // Submit day off request
  const handleDayOffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dayOffPin || dayOffPin.length < 4) {
      setDayOffNotice({ type: 'error', message: 'Enter your 4-digit staff PIN.' });
      return;
    }
    if (!dayOffDate) {
      setDayOffNotice({ type: 'error', message: 'Select your requested date.' });
      return;
    }
    const res = requestDayOff(dayOffPin.trim(), dayOffDate, dayOffReason.trim() || 'Personal day off');
    if (res.success) {
      setDayOffNotice({ type: 'success', message: res.message });
      setTimeout(() => {
        setDayOffModalOpen(false);
        setDayOffNotice(null);
        setDayOffPin('');
        setDayOffDate('');
        setDayOffReason('');
      }, 2000);
    } else {
      setDayOffNotice({ type: 'error', message: res.message });
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + val);
    }
  };

  const handleKeypadClear = () => {
    setPin('');
  };

  const handleKeypadBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-[#F4E8C1]">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0E0E12]/95 backdrop-blur border-b border-[#22222B] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="p-2 rounded-xl bg-[#16161D] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>Lounge Website</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-serif uppercase tracking-wider text-white">
                Mwingi Home Boyz Cut
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#DFB76C]/10 text-[#DFB76C] border border-[#DFB76C]/30">
                Staff Clock Kiosk
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Shift Attendance & Terminal Logging · Mwingi Town
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setDayOffModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#16161D] hover:bg-[#1E1E26] border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span className="hidden sm:inline">Request Day Off</span>
            <span className="sm:hidden">Day Off</span>
          </button>

          {onNavigateAdminStaff && (
            <button
              onClick={onNavigateAdminStaff}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1E1E26] to-[#252532] hover:border-[#DFB76C]/50 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Admin Staff Management Portal"
            >
              <Shield className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>Admin Portal</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col items-center">
        {/* Live Digital Clock Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161E] border border-zinc-800 text-zinc-400 text-xs mb-3">
            <Clock className="w-3.5 h-3.5 text-[#DFB76C]" />
            <span className="font-mono text-zinc-300">{currentDateStr || 'Loading date...'}</span>
          </div>

          <div className="text-4xl sm:text-6xl font-extrabold font-mono tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">
            {currentTime || '08:00:00 AM'}
          </div>

          <div className="mt-2 text-xs text-zinc-400 flex items-center justify-center gap-2">
            <span>Shift starts: <strong className="text-white">8:00 AM</strong></span>
            <span>·</span>
            <span>Late grace threshold: <strong className="text-amber-400">8:30 AM</strong></span>
            <span>·</span>
            <span className="text-zinc-500 font-mono">ZKTeco Biometric Ready</span>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`w-full max-w-xl mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/50 border-red-500/40 text-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{notification.message}</div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 2 BIG ACTION BUTTONS: CLOCK IN and CLOCK OUT */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {/* CLOCK IN BUTTON */}
          <button
            onClick={() => handleOpenPin('in')}
            className="group relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#132A1C] to-[#0A170F] border-2 border-emerald-500/50 hover:border-emerald-400 text-left shadow-2xl shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <LogIn className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Morning Shift
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-wide group-hover:text-emerald-300 transition-colors">
                  CLOCK IN
                </div>
                <div className="text-xs text-emerald-200/80 mt-1">
                  Start your shift with 4-digit PIN. On Time before 8:30 AM.
                </div>
              </div>
            </div>
          </button>

          {/* CLOCK OUT BUTTON */}
          <button
            onClick={() => handleOpenPin('out')}
            className="group relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#2E1815] to-[#160B0A] border-2 border-amber-600/50 hover:border-amber-400 text-left shadow-2xl shadow-amber-950/50 hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <LogOut className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  End of Shift
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold font-serif text-white tracking-wide group-hover:text-amber-300 transition-colors">
                  CLOCK OUT
                </div>
                <div className="text-xs text-amber-200/80 mt-1">
                  End shift, auto-calculate total hours worked today.
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Live Attendance Table Today */}
        <div className="w-full max-w-4xl bg-[#101016] border border-[#22222E] rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-serif text-white tracking-wide">
                  Today's Attendance Live Log
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Live Terminal
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Staff checked in for today ({getTodayDateStr()})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">
                Staff Present:{' '}
                <strong className="text-white font-mono">
                  {todayRecords.length} / {staffList.length}
                </strong>
              </span>
              <button
                onClick={refreshData}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Refresh Table"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800/80 text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
                  <th className="pb-3 pl-2">Staff Member</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">IN Time</th>
                  <th className="pb-3">OUT Time</th>
                  <th className="pb-3">Hours Worked</th>
                  <th className="pb-3 pr-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {todayRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-500">
                      No staff have clocked in yet today. Be the first to clock in!
                    </td>
                  </tr>
                ) : (
                  todayRecords.map(record => {
                    const staff = staffList.find(s => s.id === record.staffId);
                    return (
                      <tr key={record.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3.5 pl-2 font-medium text-white flex items-center gap-2.5">
                          {staff?.avatar ? (
                            <img
                              src={staff.avatar}
                              alt={record.staffName}
                              className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-[#DFB76C]">
                              {record.staffName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span>{record.staffName}</span>
                        </td>
                        <td className="py-3.5 text-zinc-400 text-[11px]">
                          {staff?.role || 'Barber'}
                        </td>
                        <td className="py-3.5 font-mono text-zinc-300">
                          {record.clockInTime}
                        </td>
                        <td className="py-3.5 font-mono">
                          {record.clockOutTime ? (
                            <span className="text-zinc-300">{record.clockOutTime}</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active On Shift
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 font-mono text-zinc-300">
                          {record.hoursWorked > 0 ? (
                            <span>{record.hoursWorked} hrs</span>
                          ) : (
                            <span className="text-zinc-500">In Progress</span>
                          )}
                        </td>
                        <td className="py-3.5 pr-2 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider font-mono ${
                              record.status === 'On Time'
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                : record.status === 'Late'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                                : 'bg-red-950/60 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {record.status === 'On Time' && (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            )}
                            {record.status === 'Late' && (
                              <AlertCircle className="w-3 h-3 text-amber-400" />
                            )}
                            <span>{record.status}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Staff Roster & Registered PIN Hints */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-zinc-400 text-[11px]">
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>Registered Staff: {staffList.map(s => s.name).join(', ')}</span>
            </div>
            <div className="text-zinc-500">
              Need PIN assistance? Contact Managing Director (Banner Mwangi).
            </div>
          </div>
        </div>
      </main>

      {/* PIN ENTRY MODAL (4 DIGITS) */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#121218] border border-[#2B2B38] p-6 shadow-2xl relative">
            <button
              onClick={() => setPinModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div
                className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                  actionType === 'in'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {actionType === 'in' ? <LogIn className="w-6 h-6" /> : <LogOut className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-bold font-serif text-white">
                {actionType === 'in' ? 'Staff Clock IN' : 'Staff Clock OUT'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your 4-digit staff PIN to register attendance
              </p>
            </div>

            {/* PIN Display Dots */}
            <div className="flex justify-center items-center gap-3 mb-5">
              {[0, 1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > idx
                      ? actionType === 'in'
                        ? 'bg-emerald-400 border-emerald-400 scale-110'
                        : 'bg-amber-400 border-amber-400 scale-110'
                      : 'border-zinc-700 bg-zinc-900'
                  }`}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num)}
                  className="h-12 rounded-xl bg-[#1A1A24] hover:bg-[#252535] active:bg-[#DFB76C]/20 text-white font-mono text-lg font-semibold border border-zinc-800 transition-colors cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadClear}
                className="h-12 rounded-xl bg-[#1A1A24] hover:bg-[#252535] text-zinc-400 hover:text-white font-mono text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
              >
                CLEAR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-12 rounded-xl bg-[#1A1A24] hover:bg-[#252535] text-white font-mono text-lg font-semibold border border-zinc-800 transition-colors cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleKeypadBackspace}
                className="h-12 rounded-xl bg-[#1A1A24] hover:bg-[#252535] text-zinc-400 hover:text-white font-mono text-sm font-semibold border border-zinc-800 transition-colors cursor-pointer"
              >
                ⌫
              </button>
            </div>

            {/* Direct Input fallback */}
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <button
                type="submit"
                disabled={pin.length < 4}
                className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-lg ${
                  actionType === 'in'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black hover:opacity-95 disabled:opacity-40'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:opacity-95 disabled:opacity-40'
                }`}
              >
                Confirm {actionType === 'in' ? 'Clock IN' : 'Clock OUT'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST DAY OFF MODAL */}
      {dayOffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#121218] border border-[#2B2B38] p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setDayOffModalOpen(false);
                setDayOffNotice(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#DFB76C]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-white">
                  Request Day Off
                </h3>
                <p className="text-xs text-zinc-400">
                  Submit a scheduled date off for Managing Director approval
                </p>
              </div>
            </div>

            {dayOffNotice && (
              <div
                className={`p-3 rounded-xl text-xs mb-4 ${
                  dayOffNotice.type === 'success'
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/60 border border-red-500/40 text-red-300'
                }`}
              >
                {dayOffNotice.message}
              </div>
            )}

            <form onSubmit={handleDayOffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Your 4-Digit Staff PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={dayOffPin}
                  onChange={e => setDayOffPin(e.target.value)}
                  placeholder="e.g. 1002"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-[#DFB76C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Requested Date Off</label>
                <input
                  type="date"
                  min={getTodayDateStr()}
                  value={dayOffDate}
                  onChange={e => setDayOffDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Reason (Optional)</label>
                <textarea
                  rows={2}
                  value={dayOffReason}
                  onChange={e => setDayOffReason(e.target.value)}
                  placeholder="e.g. Family function in Kitui, personal errands"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all cursor-pointer shadow-md"
              >
                Submit Day Off Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
