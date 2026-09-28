import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Fingerprint,
  Phone,
  Shield,
  Trash2,
  ArrowLeft,
  Search,
  Check,
  CreditCard,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  StaffMember,
  AttendanceRecord,
  StaffDayOffRequest,
  StaffAdvancePayment,
  SalaryType
} from '../types.ts';
import {
  getStaffList,
  addStaffMember,
  updateStaffMember,
  deleteStaffMember,
  getAttendanceLog,
  exportAttendanceToCSV,
  getDayOffRequests,
  updateDayOffStatus,
  getAdvancePayments,
  addAdvancePayment,
  getPaidMonths,
  markStaffMonthPaid,
  getTodayDateStr
} from '../utils/staffStorage.ts';

interface AdminStaffPageProps {
  onBackToMain?: () => void;
  onNavigateClock?: () => void;
}

export const AdminStaffPage: React.FC<AdminStaffPageProps> = ({
  onBackToMain,
  onNavigateClock
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mwingi_staff_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'attendance' | 'staff' | 'payments' | 'dayoff'
  const [activeTab, setActiveTab] = useState<'attendance' | 'staff' | 'payments' | 'dayoff'>('attendance');

  // Data states
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [attendanceLog, setAttendanceLog] = useState<AttendanceRecord[]>([]);
  const [dayOffRequests, setDayOffRequests] = useState<StaffDayOffRequest[]>([]);
  const [advances, setAdvances] = useState<StaffAdvancePayment[]>([]);
  const [paidMonths, setPaidMonths] = useState<Record<string, boolean>>({});

  // Filter states
  const [dateFilter, setDateFilter] = useState<string>('');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  const togglePinReveal = (staffId: string) => {
    setRevealedPins(prev => ({ ...prev, [staffId]: !prev[staffId] }));
  };

  // Add Staff Modal / Form
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<{
    name: string;
    role: string;
    phone: string;
    salaryType: SalaryType;
    salaryAmount: number;
    pin: string;
    fingerprint_id: string;
  }>({
    name: '',
    role: 'Barber & Fade Artisan',
    phone: '',
    salaryType: 'daily',
    salaryAmount: 1200,
    pin: '',
    fingerprint_id: ''
  });

  // Advance Payment Modal
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);
  const [advanceStaffId, setAdvanceStaffId] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState(1000);
  const [advanceReason, setAdvanceReason] = useState('');

  // Selected Month for Payroll
  const currentMonthKey = getTodayDateStr().slice(0, 7); // e.g., '2026-09'
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthKey);

  const reloadData = () => {
    setStaffList(getStaffList());
    setAttendanceLog(getAttendanceLog());
    setDayOffRequests(getDayOffRequests());
    setAdvances(getAdvancePayments());
    setPaidMonths(getPaidMonths());
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Please enter administrator password.');
      return;
    }

    try {
      const res = await fetch('/api/auth/staff-admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('mwingi_staff_admin_auth', 'true');
        if (data.token) {
          sessionStorage.setItem('mwingi_staff_token', data.token);
        }
        setIsAuthenticated(true);
        setAuthError(null);
        reloadData();
      } else {
        setAuthError(data.error || 'Access denied. Unauthorized management attempt.');
      }
    } catch {
      // Fallback offline verification if API unreachable
      if (passwordInput.trim() === 'mwingi2024') {
        sessionStorage.setItem('mwingi_staff_admin_auth', 'true');
        setIsAuthenticated(true);
        setAuthError(null);
        reloadData();
      } else {
        setAuthError('Authentication verification failed.');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mwingi_staff_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Add Staff Handler
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.pin.trim()) {
      setFeedback({ type: 'error', message: 'Name and 4-digit PIN are required.' });
      return;
    }
    if (newStaff.pin.trim().length !== 4) {
      setFeedback({ type: 'error', message: 'PIN must be exactly 4 digits.' });
      return;
    }

    addStaffMember({
      name: newStaff.name.trim(),
      role: newStaff.role.trim(),
      phone: newStaff.phone.trim() || '0746145712',
      salaryType: newStaff.salaryType,
      salaryAmount: Number(newStaff.salaryAmount) || 1000,
      pin: newStaff.pin.trim(),
      fingerprint_id: newStaff.fingerprint_id.trim() || `ZK-${Date.now().toString().slice(-4)}`,
      active: true
    });

    setFeedback({ type: 'success', message: `Staff member ${newStaff.name} added successfully.` });
    setAddStaffModalOpen(false);
    setNewStaff({
      name: '',
      role: 'Barber & Fade Artisan',
      phone: '',
      salaryType: 'daily',
      salaryAmount: 1200,
      pin: '',
      fingerprint_id: ''
    });
    reloadData();
  };

  // Delete Staff Member
  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove staff member "${name}"?`)) {
      deleteStaffMember(id);
      setFeedback({ type: 'success', message: `${name} has been removed.` });
      reloadData();
    }
  };

  // Handle CSV Download
  const handleExportCSV = () => {
    const csvContent = exportAttendanceToCSV(filteredAttendance);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Mwingi_Home_Boyz_Attendance_${selectedMonth || 'All'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: 'Attendance records exported to CSV.' });
  };

  // Day off review
  const handleApproveDayOff = (id: string) => {
    updateDayOffStatus(id, 'approved');
    setFeedback({ type: 'success', message: 'Day off approved.' });
    reloadData();
  };

  const handleRejectDayOff = (id: string) => {
    updateDayOffStatus(id, 'rejected');
    setFeedback({ type: 'error', message: 'Day off rejected.' });
    reloadData();
  };

  // Add Advance Submit
  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceStaffId || !advanceAmount) return;
    addAdvancePayment(advanceStaffId, Number(advanceAmount), advanceReason.trim() || 'Salary Advance', 'Banner Mwangi');
    setFeedback({ type: 'success', message: `Advance payment of KSh ${Number(advanceAmount).toLocaleString()} recorded.` });
    setAdvanceModalOpen(false);
    setAdvanceStaffId('');
    setAdvanceAmount(1000);
    setAdvanceReason('');
    reloadData();
  };

  // Filtered Attendance
  const filteredAttendance = attendanceLog.filter(record => {
    if (dateFilter && record.date !== dateFilter) return false;
    if (staffFilter !== 'all' && record.staffId !== staffFilter) return false;
    if (statusFilter !== 'all' && record.status !== statusFilter) return false;
    return true;
  });

  // Payroll Calculation for a specific staff in selectedMonth
  const calculatePayroll = (staff: StaffMember) => {
    // Attendance in this month
    const staffMonthAttendance = attendanceLog.filter(
      r => r.staffId === staff.id && r.date.startsWith(selectedMonth)
    );
    const daysWorked = staffMonthAttendance.length;
    const totalHours = staffMonthAttendance.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);

    let grossEarned = 0;
    if (staff.salaryType === 'daily') {
      grossEarned = daysWorked * staff.salaryAmount;
    } else {
      // Monthly base salary
      grossEarned = staff.salaryAmount;
    }

    // Advances in this month
    const staffMonthAdvances = advances.filter(
      a => a.staffId === staff.id && a.date.startsWith(selectedMonth)
    );
    const totalAdvances = staffMonthAdvances.reduce((sum, a) => sum + a.amount, 0);

    const balanceDue = Math.max(0, grossEarned - totalAdvances);
    const isPaidKey = `${staff.id}_${selectedMonth}`;
    const isPaid = !!paidMonths[isPaidKey];

    return {
      daysWorked,
      totalHours: Math.round(totalHours * 10) / 10,
      grossEarned,
      totalAdvances,
      balanceDue,
      isPaid
    };
  };

  // IF NOT AUTHENTICATED -> SHOW PASSWORD SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08080A] flex flex-col items-center justify-center p-4 selection:bg-[#C5A059]/30 selection:text-[#F4E8C1]">
        <div className="w-full max-w-md rounded-3xl bg-[#121217] border border-[#272733] p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#DFB76C]/10 border border-[#DFB76C]/30 flex items-center justify-center text-[#DFB76C] mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold font-serif text-white tracking-wide uppercase">
              Staff Administration
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Mwingi Home Boyz Cut · Management & Payroll Portal
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A0D] border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#DFB76C]"
                autoFocus
              />
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1.5">
                <Lock className="w-3 h-3 text-[#DFB76C] shrink-0" />
                <span>Restricted management portal. Unauthorized access is strictly logged and prohibited.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all cursor-pointer shadow-lg"
            >
              Unlock Staff Portal
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            {onBackToMain && (
              <button
                onClick={onBackToMain}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Lounge</span>
              </button>
            )}
            {onNavigateClock && (
              <button
                onClick={onNavigateClock}
                className="text-[#DFB76C] hover:underline cursor-pointer"
              >
                Go to Public Clock →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-[#F4E8C1]">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#0E0E12]/95 backdrop-blur border-b border-[#22222B] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToMain && (
            <button
              onClick={onBackToMain}
              className="p-2 rounded-xl bg-[#16161D] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span className="hidden sm:inline">Lounge</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-serif uppercase tracking-wider text-white">
                Mwingi Home Boyz
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#DFB76C]/10 text-[#DFB76C] border border-[#DFB76C]/30">
                Staff Admin & Payroll
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Biometric ZKTeco System · Mwingi Town, Kitui County
            </div>
          </div>
        </div>

        {/* Tab Controls & Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onNavigateClock && (
            <button
              onClick={onNavigateClock}
              className="px-3 py-1.5 rounded-xl bg-[#16161D] hover:bg-[#1E1E26] border border-zinc-800 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span className="hidden sm:inline">Open Terminal Kiosk (/clock)</span>
              <span className="sm:hidden">Clock</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Lock Out
          </button>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#111116] border-b border-[#20202A] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'bg-[#DFB76C] text-black font-semibold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance Log ({attendanceLog.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'staff'
                ? 'bg-[#DFB76C] text-black font-semibold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Roster ({staffList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payments'
                ? 'bg-[#DFB76C] text-black font-semibold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Payroll & Payment Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('dayoff')}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dayoff'
                ? 'bg-[#DFB76C] text-black font-semibold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Day Off Manager
              {dayOffRequests.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                  {dayOffRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Feedback Banner */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/60 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: ATTENDANCE LOG */}
        {/* ======================================================== */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Top Toolbar: Filters & Export CSV */}
            <div className="p-5 rounded-2xl bg-[#121217] border border-[#272733] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Date Filter */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#0A0A0D] border border-zinc-800 text-white focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>

                {/* Staff Filter */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                    Staff Member
                  </label>
                  <select
                    value={staffFilter}
                    onChange={e => setStaffFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#0A0A0D] border border-zinc-800 text-white focus:outline-none focus:border-[#DFB76C]"
                  >
                    <option value="all">All Staff Members</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                    Punctuality Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#0A0A0D] border border-zinc-800 text-white focus:outline-none focus:border-[#DFB76C]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="On Time">On Time (Before 8:30 AM)</option>
                    <option value="Late">Late (After 8:30 AM)</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                {(dateFilter || staffFilter !== 'all' || statusFilter !== 'all') && (
                  <div className="self-end pb-0.5">
                    <button
                      onClick={() => {
                        setDateFilter('');
                        setStaffFilter('all');
                        setStatusFilter('all');
                      }}
                      className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Export to CSV Button */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase flex items-center gap-2 hover:opacity-95 transition-all shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Attendance to CSV</span>
              </button>
            </div>

            {/* Attendance Table */}
            <div className="rounded-2xl bg-[#121217] border border-[#272733] p-5 overflow-hidden shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold font-serif text-white uppercase tracking-wider">
                  Full Attendance History ({filteredAttendance.length} records)
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Cutoff: 8:30 AM · Biometric ready
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800/80 text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
                      <th className="pb-3 pl-2">Name</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">IN Time</th>
                      <th className="pb-3">OUT Time</th>
                      <th className="pb-3">Hours Worked</th>
                      <th className="pb-3">Biometric Device</th>
                      <th className="pb-3 pr-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {filteredAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-500">
                          No attendance records match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendance.map(record => (
                        <tr key={record.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-3 pl-2 font-medium text-white">
                            {record.staffName}
                          </td>
                          <td className="py-3 font-mono text-zinc-300">
                            {record.date}
                          </td>
                          <td className="py-3 font-mono text-zinc-300">
                            {record.clockInTime}
                          </td>
                          <td className="py-3 font-mono">
                            {record.clockOutTime ? (
                              <span className="text-zinc-300">{record.clockOutTime}</span>
                            ) : (
                              <span className="text-emerald-400 text-[11px] font-semibold">
                                Shift In Progress
                              </span>
                            )}
                          </td>
                          <td className="py-3 font-mono text-zinc-300">
                            {record.hoursWorked > 0 ? `${record.hoursWorked} hrs` : '—'}
                          </td>
                          <td className="py-3 font-mono text-[11px] text-zinc-400 flex items-center gap-1.5">
                            <Fingerprint className="w-3.5 h-3.5 text-[#DFB76C]" />
                            <span>{record.device_log?.device_id || 'ZKTeco Terminal'}</span>
                          </td>
                          <td className="py-3 pr-2 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider font-mono ${
                                record.status === 'On Time'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                                  : record.status === 'Late'
                                  ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                                  : 'bg-red-950/60 text-red-300 border border-red-500/40'
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STAFF ROSTER & MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-white">
                  Registered Staff Crew
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage barber PINs, salary structures, and biometric identifiers
                </p>
              </div>

              <button
                onClick={() => setAddStaffModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 hover:opacity-95 transition-all shadow cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {staffList.map(staff => (
                <div
                  key={staff.id}
                  className="rounded-2xl bg-[#121217] border border-[#272733] p-5 shadow-lg relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {staff.avatar ? (
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = '/team.jpg';
                            }}
                            className="w-12 h-12 rounded-xl object-cover border border-zinc-700"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-serif text-base font-bold text-[#DFB76C]">
                            {staff.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-white font-serif">{staff.name}</h4>
                          <span className="text-[11px] text-zinc-400 block">{staff.role}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteStaff(staff.id, staff.name)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 transition-opacity"
                        title="Delete staff member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 py-3 border-y border-zinc-800/80 text-xs text-zinc-300">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Phone:</span>
                        <a href={`tel:${staff.phone}`} className="hover:text-white font-mono">
                          {staff.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Salary Model:</span>
                        <span className="font-semibold text-white uppercase text-[11px]">
                          {staff.salaryType === 'daily' ? 'Daily Rate' : 'Monthly Salary'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Compensation:</span>
                        <span className="font-mono font-bold text-[#DFB76C]">
                          KSh {staff.salaryAmount.toLocaleString()} {staff.salaryType === 'daily' ? '/ day' : '/ mo'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Terminal PIN:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded text-[#DFB76C] font-bold tracking-widest text-xs">
                            {revealedPins[staff.id] ? staff.pin : '••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePinReveal(staff.id)}
                            className="p-1 text-zinc-500 hover:text-[#DFB76C] transition-colors"
                            title={revealedPins[staff.id] ? 'Hide PIN' : 'Reveal PIN'}
                          >
                            {revealedPins[staff.id] ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Biometric Template:</span>
                        <span className="font-mono text-[11px] text-zinc-400">
                          {staff.fingerprint_id || 'ZK-Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Joined: {staff.joinedDate}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active Staff
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PAYROLL & PAYMENT TRACKER */}
        {/* ======================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Header with Month Selector & Record Advance CTA */}
            <div className="p-5 rounded-2xl bg-[#121217] border border-[#272733] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold font-serif text-white uppercase tracking-wider">
                  Staff Payroll & Earnings Calculator
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Calculates (Days Worked x Daily Rate) - Advances = Balance Payable
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                    Payroll Month
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#0A0A0D] border border-zinc-800 text-white focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>

                <button
                  onClick={() => {
                    setAdvanceStaffId(staffList[0]?.id || '');
                    setAdvanceModalOpen(true);
                  }}
                  className="self-end px-4 py-2 rounded-xl bg-[#1E1E28] hover:bg-[#282836] border border-zinc-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>Add Salary Advance</span>
                </button>
              </div>
            </div>

            {/* Payroll Table */}
            <div className="rounded-2xl bg-[#121217] border border-[#272733] p-5 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800/80 text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
                      <th className="pb-3 pl-2">Staff Member</th>
                      <th className="pb-3">Salary Type</th>
                      <th className="pb-3">Base Rate</th>
                      <th className="pb-3">Days Worked ({selectedMonth})</th>
                      <th className="pb-3">Gross Earned</th>
                      <th className="pb-3">Advances Deducted</th>
                      <th className="pb-3">Balance Payable</th>
                      <th className="pb-3 pr-2 text-right">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {staffList.map(staff => {
                      const payroll = calculatePayroll(staff);
                      return (
                        <tr key={staff.id} className="hover:bg-zinc-800/30 transition-colors">
                          <td className="py-4 pl-2 font-medium text-white">
                            <div className="font-serif font-bold">{staff.name}</div>
                            <span className="text-[11px] text-zinc-400">{staff.role}</span>
                          </td>
                          <td className="py-4 uppercase text-[11px] text-zinc-300 font-mono">
                            {staff.salaryType}
                          </td>
                          <td className="py-4 font-mono text-zinc-300">
                            KSh {staff.salaryAmount.toLocaleString()}
                          </td>
                          <td className="py-4 font-mono font-bold text-white">
                            {payroll.daysWorked} days{' '}
                            <span className="text-[10px] text-zinc-400 font-normal">
                              ({payroll.totalHours} hrs)
                            </span>
                          </td>
                          <td className="py-4 font-mono font-bold text-emerald-400">
                            KSh {payroll.grossEarned.toLocaleString()}
                          </td>
                          <td className="py-4 font-mono text-amber-400">
                            {payroll.totalAdvances > 0 ? (
                              <span>- KSh {payroll.totalAdvances.toLocaleString()}</span>
                            ) : (
                              <span className="text-zinc-500">KSh 0</span>
                            )}
                          </td>
                          <td className="py-4 font-mono text-base font-extrabold text-[#DFB76C]">
                            KSh {payroll.balanceDue.toLocaleString()}
                          </td>
                          <td className="py-4 pr-2 text-right">
                            {payroll.isPaid ? (
                              <button
                                onClick={() => {
                                  markStaffMonthPaid(staff.id, selectedMonth, false);
                                  setFeedback({ type: 'success', message: `Marked ${staff.name} as unpaid for ${selectedMonth}.` });
                                  reloadData();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5 ml-auto hover:bg-emerald-900 transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Paid (Clear)</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  markStaffMonthPaid(staff.id, selectedMonth, true);
                                  setFeedback({ type: 'success', message: `Marked ${staff.name} as Paid for ${selectedMonth}!` });
                                  reloadData();
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#DFB76C] hover:bg-[#C5A059] text-black font-semibold text-xs transition-colors cursor-pointer ml-auto shadow-sm"
                              >
                                Mark as Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Advance History Log */}
            <div className="rounded-2xl bg-[#121217] border border-[#272733] p-5 shadow-lg">
              <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                Recent Salary Advances Issued
              </h4>
              {advances.length === 0 ? (
                <div className="text-xs text-zinc-500 py-3">No advances recorded yet.</div>
              ) : (
                <div className="space-y-2">
                  {advances.map(adv => (
                    <div
                      key={adv.id}
                      className="p-3 rounded-xl bg-[#0B0B0E] border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{adv.staffName}</span>
                        <span className="text-zinc-400 ml-2">({adv.reason})</span>
                        <div className="text-[10px] text-zinc-500">
                          {adv.date} · Approved by {adv.approvedBy}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        KSh {adv.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: DAY OFF MANAGER */}
        {/* ======================================================== */}
        {activeTab === 'dayoff' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#121217] border border-[#272733]">
              <h3 className="text-sm font-bold font-serif text-white uppercase tracking-wider">
                Staff Day Off Requests & Approvals
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Review and approve leave or off-day submissions made by barbers from the /clock page
              </p>
            </div>

            {/* Requests List */}
            <div className="space-y-3">
              {dayOffRequests.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#121217] border border-[#272733] text-zinc-500 text-xs">
                  No day off requests recorded.
                </div>
              ) : (
                dayOffRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-[#272733] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold font-serif text-white">{req.staffName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            req.status === 'approved'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                              : req.status === 'rejected'
                              ? 'bg-red-950/60 text-red-300 border border-red-500/40'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#DFB76C] font-mono mt-1">
                        Requested Date Off: <strong>{req.date}</strong>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">Reason: "{req.reason}"</div>
                    </div>

                    {req.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveDayOff(req.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectDayOff(req.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-200 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500 italic">
                        Decision recorded on {req.respondedAt?.slice(0, 10) || 'Recently'}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD STAFF MEMBER */}
      {addStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#121218] border border-[#2B2B38] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setAddStaffModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#DFB76C]/10 border border-[#DFB76C]/30 flex items-center justify-center text-[#DFB76C]">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-serif text-white">
                  Add New Staff Member
                </h3>
                <p className="text-xs text-zinc-400">
                  Register barber details, PIN, and salary rate
                </p>
              </div>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Full Staff Name *</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Timothy Munyao"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Role & Title</label>
                <input
                  type="text"
                  value={newStaff.role}
                  onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                  placeholder="e.g. Master Fade Barber"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Phone Number (M-Pesa)</label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="0746145712"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Salary Type</label>
                  <select
                    value={newStaff.salaryType}
                    onChange={e => setNewStaff({ ...newStaff, salaryType: e.target.value as SalaryType })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                  >
                    <option value="daily">Daily Rate</option>
                    <option value="monthly">Monthly Salary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">
                    Amount ({newStaff.salaryType === 'daily' ? 'KSh / Day' : 'KSh / Mo'})
                  </label>
                  <input
                    type="number"
                    value={newStaff.salaryAmount}
                    onChange={e => setNewStaff({ ...newStaff, salaryAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-[#DFB76C]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">4-Digit Terminal PIN *</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newStaff.pin}
                    onChange={e => setNewStaff({ ...newStaff, pin: e.target.value })}
                    placeholder="e.g. 1005"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-sm font-mono tracking-widest focus:outline-none focus:border-[#DFB76C]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">ZKTeco Biometric ID</label>
                  <input
                    type="text"
                    value={newStaff.fingerprint_id}
                    onChange={e => setNewStaff({ ...newStaff, fingerprint_id: e.target.value })}
                    placeholder="e.g. ZK-005"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-[#DFB76C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all cursor-pointer shadow-md mt-2"
              >
                Register Staff Member
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD SALARY ADVANCE */}
      {advanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-[#121218] border border-[#2B2B38] p-6 shadow-2xl relative">
            <button
              onClick={() => setAdvanceModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-serif text-white">
                Record Salary Advance
              </h3>
              <p className="text-xs text-zinc-400">
                Will be automatically deducted from monthly balance
              </p>
            </div>

            <form onSubmit={handleAdvanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 mb-1">Select Staff Member</label>
                <select
                  value={advanceStaffId}
                  onChange={e => setAdvanceStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                  required
                >
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Advance Amount (KSh)</label>
                <input
                  type="number"
                  step={100}
                  value={advanceAmount}
                  onChange={e => setAdvanceAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-[#DFB76C]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={advanceReason}
                  onChange={e => setAdvanceReason(e.target.value)}
                  placeholder="e.g. Clipper blade purchase, family emergency"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B0B0E] border border-zinc-800 text-white text-xs focus:outline-none focus:border-[#DFB76C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all cursor-pointer shadow-md"
              >
                Approve & Record Advance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
