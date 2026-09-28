import type { StaffMember, AttendanceRecord, StaffDayOffRequest, StaffAdvancePayment, AttendanceStatus } from '../types.ts';
import {
  INITIAL_STAFF_MEMBERS,
  INITIAL_ATTENDANCE_LOG,
  INITIAL_DAY_OFF_REQUESTS,
  INITIAL_ADVANCE_PAYMENTS
} from '../data/mockStaff.ts';

const STAFF_KEY = 'mwingi_staff';
const ATTENDANCE_KEY = 'mwingi_attendance';
const DAY_OFF_KEY = 'mwingi_day_off_requests';
const ADVANCES_KEY = 'mwingi_advances';
const PAID_MONTHS_KEY = 'mwingi_paid_months';

// Helpers to get today's date formatted
export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeStr(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Calculate hours worked between two ISO strings
export function calculateHoursWorked(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  const diffHours = (end - start) / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10;
}

// Determine if clock in is On Time or Late (Cutoff is 8:30 AM)
export function determineAttendanceStatus(clockInDate: Date): AttendanceStatus {
  const hours = clockInDate.getHours();
  const minutes = clockInDate.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  // 8:30 AM = 8 * 60 + 30 = 510 minutes
  return totalMinutes <= 510 ? 'On Time' : 'Late';
}

// ----------------- STAFF STORAGE -----------------
export function getStaffList(): StaffMember[] {
  try {
    const raw = localStorage.getItem(STAFF_KEY);
    if (!raw) {
      localStorage.setItem(STAFF_KEY, JSON.stringify(INITIAL_STAFF_MEMBERS));
      return INITIAL_STAFF_MEMBERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STAFF_MEMBERS;
  }
}

export function saveStaffList(staff: StaffMember[]): void {
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
}

export function addStaffMember(member: Omit<StaffMember, 'id' | 'joinedDate'>): StaffMember {
  const staff = getStaffList();
  const newMember: StaffMember = {
    ...member,
    id: 'staff-' + Date.now(),
    joinedDate: getTodayDateStr()
  };
  const updated = [...staff, newMember];
  saveStaffList(updated);
  return newMember;
}

export function updateStaffMember(id: string, updates: Partial<StaffMember>): StaffMember | null {
  const staff = getStaffList();
  const index = staff.findIndex(s => s.id === id);
  if (index === -1) return null;
  staff[index] = { ...staff[index], ...updates };
  saveStaffList(staff);
  return staff[index];
}

export function deleteStaffMember(id: string): void {
  const staff = getStaffList().filter(s => s.id !== id);
  saveStaffList(staff);
}

// ----------------- ATTENDANCE STORAGE -----------------
export function getAttendanceLog(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(INITIAL_ATTENDANCE_LOG));
      return INITIAL_ATTENDANCE_LOG;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ATTENDANCE_LOG;
  }
}

export function saveAttendanceLog(log: AttendanceRecord[]): void {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(log));
}

// Clock In Action: verifies PIN, checks if already clocked in today
export function clockInStaff(pin: string): { success: boolean; message: string; record?: AttendanceRecord; staff?: StaffMember } {
  const staffList = getStaffList();
  const staff = staffList.find(s => s.pin === pin && s.active);

  if (!staff) {
    return { success: false, message: 'Invalid 4-digit PIN or staff inactive.' };
  }

  const today = getTodayDateStr();
  const log = getAttendanceLog();

  // Check if already clocked in today
  const existing = log.find(r => r.staffId === staff.id && r.date === today);
  if (existing) {
    return {
      success: false,
      message: `${staff.name} is already clocked in today at ${existing.clockInTime}.`,
      record: existing,
      staff
    };
  }

  const now = new Date();
  const status = determineAttendanceStatus(now);

  const newRecord: AttendanceRecord = {
    id: 'att-' + Date.now(),
    staffId: staff.id,
    staffName: staff.name,
    date: today,
    clockInTime: formatTimeStr(now),
    clockInIso: now.toISOString(),
    hoursWorked: 0,
    status,
    device_log: {
      device_id: 'ZKTECO_WEB_01',
      verify_type: 'PIN',
      synced: true
    }
  };

  const updatedLog = [newRecord, ...log];
  saveAttendanceLog(updatedLog);

  return {
    success: true,
    message: `Welcome, ${staff.name}! Clocked IN at ${newRecord.clockInTime} (${status}).`,
    record: newRecord,
    staff
  };
}

// Clock Out Action: verifies PIN, marks clock out time & calculates hours worked
export function clockOutStaff(pin: string): { success: boolean; message: string; record?: AttendanceRecord; staff?: StaffMember } {
  const staffList = getStaffList();
  const staff = staffList.find(s => s.pin === pin && s.active);

  if (!staff) {
    return { success: false, message: 'Invalid 4-digit PIN or staff inactive.' };
  }

  const today = getTodayDateStr();
  const log = getAttendanceLog();

  const recordIndex = log.findIndex(r => r.staffId === staff.id && r.date === today);
  if (recordIndex === -1) {
    return {
      success: false,
      message: `${staff.name} has not clocked in yet today.`
    };
  }

  const record = log[recordIndex];
  if (record.clockOutTime) {
    return {
      success: false,
      message: `${staff.name} already clocked out today at ${record.clockOutTime} (${record.hoursWorked} hrs).`,
      record
    };
  }

  const now = new Date();
  const clockOutTime = formatTimeStr(now);
  const clockOutIso = now.toISOString();
  const hours = calculateHoursWorked(record.clockInIso, clockOutIso);

  const updatedRecord: AttendanceRecord = {
    ...record,
    clockOutTime,
    clockOutIso,
    hoursWorked: hours,
    device_log: {
      ...record.device_log,
      synced: true
    }
  };

  log[recordIndex] = updatedRecord;
  saveAttendanceLog(log);

  return {
    success: true,
    message: `Goodbye, ${staff.name}! Clocked OUT at ${clockOutTime}. Total shift: ${hours} hours.`,
    record: updatedRecord,
    staff
  };
}

// ----------------- DAY OFF REQUESTS -----------------
export function getDayOffRequests(): StaffDayOffRequest[] {
  try {
    const raw = localStorage.getItem(DAY_OFF_KEY);
    if (!raw) {
      localStorage.setItem(DAY_OFF_KEY, JSON.stringify(INITIAL_DAY_OFF_REQUESTS));
      return INITIAL_DAY_OFF_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DAY_OFF_REQUESTS;
  }
}

export function saveDayOffRequests(requests: StaffDayOffRequest[]): void {
  localStorage.setItem(DAY_OFF_KEY, JSON.stringify(requests));
}

export function requestDayOff(pin: string, date: string, reason: string): { success: boolean; message: string } {
  const staffList = getStaffList();
  const staff = staffList.find(s => s.pin === pin && s.active);
  if (!staff) {
    return { success: false, message: 'Invalid 4-digit PIN.' };
  }

  const requests = getDayOffRequests();
  const newReq: StaffDayOffRequest = {
    id: 'off-' + Date.now(),
    staffId: staff.id,
    staffName: staff.name,
    date,
    reason,
    status: 'pending',
    requestedAt: new Date().toISOString()
  };

  saveDayOffRequests([newReq, ...requests]);
  return { success: true, message: `Day off request submitted for ${staff.name} on ${date}.` };
}

export function updateDayOffStatus(id: string, status: 'approved' | 'rejected'): void {
  const requests = getDayOffRequests();
  const index = requests.findIndex(r => r.id === id);
  if (index !== -1) {
    requests[index].status = status;
    requests[index].respondedAt = new Date().toISOString();
    saveDayOffRequests(requests);
  }
}

// ----------------- ADVANCES & PAYROLL -----------------
export function getAdvancePayments(): StaffAdvancePayment[] {
  try {
    const raw = localStorage.getItem(ADVANCES_KEY);
    if (!raw) {
      localStorage.setItem(ADVANCES_KEY, JSON.stringify(INITIAL_ADVANCE_PAYMENTS));
      return INITIAL_ADVANCE_PAYMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADVANCE_PAYMENTS;
  }
}

export function saveAdvancePayments(advances: StaffAdvancePayment[]): void {
  localStorage.setItem(ADVANCES_KEY, JSON.stringify(advances));
}

export function addAdvancePayment(staffId: string, amount: number, reason: string, approvedBy = 'Director'): void {
  const staff = getStaffList().find(s => s.id === staffId);
  if (!staff) return;
  const advances = getAdvancePayments();
  const newAdv: StaffAdvancePayment = {
    id: 'adv-' + Date.now(),
    staffId,
    staffName: staff.name,
    date: getTodayDateStr(),
    amount,
    reason,
    approvedBy
  };
  saveAdvancePayments([newAdv, ...advances]);
}

// Paid month tracker key: "staffId_YYYY-MM"
export function getPaidMonths(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(PAID_MONTHS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markStaffMonthPaid(staffId: string, monthKey: string, isPaid: boolean): void {
  const paid = getPaidMonths();
  const key = `${staffId}_${monthKey}`;
  if (isPaid) {
    paid[key] = true;
  } else {
    delete paid[key];
  }
  localStorage.setItem(PAID_MONTHS_KEY, JSON.stringify(paid));
}

// Export attendance records to CSV string
export function exportAttendanceToCSV(records: AttendanceRecord[]): string {
  const headers = ['Staff Name', 'Date', 'Clock In', 'Clock Out', 'Hours Worked', 'Status', 'Biometric / Device'];
  const rows = records.map(r => [
    `"${r.staffName.replace(/"/g, '""')}"`,
    `"${r.date}"`,
    `"${r.clockInTime || ''}"`,
    `"${r.clockOutTime || 'Active (On Shift)'}"`,
    `"${r.hoursWorked || 0}"`,
    `"${r.status}"`,
    `"${r.device_log?.device_id || 'ZKTeco Web'}"`
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
