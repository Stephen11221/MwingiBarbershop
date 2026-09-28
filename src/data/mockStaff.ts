import type { StaffMember, AttendanceRecord, StaffDayOffRequest, StaffAdvancePayment } from '../types.ts';
import {
  BARBER_WORKER_PORTRAIT_IMAGE,
  BARBERSHOP_WORKERS_CREW_IMAGE,
  BARBER_MASTER_IMAGE,
  BARBER_FADE_IMAGE
} from './mockData.ts';

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Banner Mwangi',
    role: 'Lead Master Barber & Founder',
    phone: '0746145712',
    salaryType: 'daily',
    salaryAmount: 1500, // KSh 1,500 / day
    pin: '1001',
    fingerprint_id: 'ZK-001',
    active: true,
    avatar: BARBER_WORKER_PORTRAIT_IMAGE,
    joinedDate: '2023-01-15'
  },
  {
    id: 'staff-2',
    name: 'Kelvin Mutua',
    role: 'Senior Fade Artisan',
    phone: '0712345678',
    salaryType: 'daily',
    salaryAmount: 1200, // KSh 1,200 / day
    pin: '1002',
    fingerprint_id: 'ZK-002',
    active: true,
    avatar: BARBER_FADE_IMAGE,
    joinedDate: '2023-06-01'
  },
  {
    id: 'staff-3',
    name: 'Brian Musyoka',
    role: 'Master Shaver & Beard Architect',
    phone: '0722998877',
    salaryType: 'daily',
    salaryAmount: 1100, // KSh 1,100 / day
    pin: '1003',
    fingerprint_id: 'ZK-003',
    active: true,
    avatar: BARBER_MASTER_IMAGE,
    joinedDate: '2023-09-10'
  },
  {
    id: 'staff-4',
    name: 'Dennis Kimanzi',
    role: 'Facial Aesthetics & Skin Specialist',
    phone: '0733445566',
    salaryType: 'monthly',
    salaryAmount: 28000, // KSh 28,000 / month
    pin: '1004',
    fingerprint_id: 'ZK-004',
    active: true,
    avatar: BARBERSHOP_WORKERS_CREW_IMAGE,
    joinedDate: '2024-02-01'
  }
];

export const INITIAL_ATTENDANCE_LOG: AttendanceRecord[] = [
  {
    id: 'att-20260923-1',
    staffId: 'staff-1',
    staffName: 'Banner Mwangi',
    date: '2026-09-23',
    clockInTime: '07:45 AM',
    clockInIso: '2026-09-23T07:45:00.000Z',
    hoursWorked: 0,
    status: 'On Time',
    device_log: {
      device_id: 'ZKTECO_IN_01',
      verify_type: 'PIN',
      synced: true
    }
  },
  {
    id: 'att-20260923-2',
    staffId: 'staff-2',
    staffName: 'Kelvin Mutua',
    date: '2026-09-23',
    clockInTime: '08:15 AM',
    clockInIso: '2026-09-23T08:15:00.000Z',
    hoursWorked: 0,
    status: 'On Time',
    device_log: {
      device_id: 'ZKTECO_IN_01',
      verify_type: 'PIN',
      synced: true
    }
  },
  {
    id: 'att-20260923-3',
    staffId: 'staff-3',
    staffName: 'Brian Musyoka',
    date: '2026-09-23',
    clockInTime: '08:42 AM',
    clockInIso: '2026-09-23T08:42:00.000Z',
    hoursWorked: 0,
    status: 'Late',
    device_log: {
      device_id: 'ZKTECO_IN_01',
      verify_type: 'PIN',
      synced: true
    }
  },
  // Yesterday's completed records for realistic calculation
  {
    id: 'att-20260922-1',
    staffId: 'staff-1',
    staffName: 'Banner Mwangi',
    date: '2026-09-22',
    clockInTime: '07:50 AM',
    clockOutTime: '08:10 PM',
    clockInIso: '2026-09-22T07:50:00.000Z',
    clockOutIso: '2026-09-22T20:10:00.000Z',
    hoursWorked: 12.3,
    status: 'On Time',
    device_log: { device_id: 'ZKTECO_IN_01', verify_type: 'PIN', synced: true }
  },
  {
    id: 'att-20260922-2',
    staffId: 'staff-2',
    staffName: 'Kelvin Mutua',
    date: '2026-09-22',
    clockInTime: '08:10 AM',
    clockOutTime: '07:45 PM',
    clockInIso: '2026-09-22T08:10:00.000Z',
    clockOutIso: '2026-09-22T19:45:00.000Z',
    hoursWorked: 11.6,
    status: 'On Time',
    device_log: { device_id: 'ZKTECO_IN_01', verify_type: 'PIN', synced: true }
  },
  {
    id: 'att-20260922-3',
    staffId: 'staff-3',
    staffName: 'Brian Musyoka',
    date: '2026-09-22',
    clockInTime: '08:05 AM',
    clockOutTime: '07:30 PM',
    clockInIso: '2026-09-22T08:05:00.000Z',
    clockOutIso: '2026-09-22T19:30:00.000Z',
    hoursWorked: 11.4,
    status: 'On Time',
    device_log: { device_id: 'ZKTECO_IN_01', verify_type: 'PIN', synced: true }
  },
  {
    id: 'att-20260922-4',
    staffId: 'staff-4',
    staffName: 'Dennis Kimanzi',
    date: '2026-09-22',
    clockInTime: '08:25 AM',
    clockOutTime: '06:30 PM',
    clockInIso: '2026-09-22T08:25:00.000Z',
    clockOutIso: '2026-09-22T18:30:00.000Z',
    hoursWorked: 10.1,
    status: 'On Time',
    device_log: { device_id: 'ZKTECO_IN_01', verify_type: 'PIN', synced: true }
  }
];

export const INITIAL_DAY_OFF_REQUESTS: StaffDayOffRequest[] = [
  {
    id: 'off-1',
    staffId: 'staff-2',
    staffName: 'Kelvin Mutua',
    date: '2026-09-28',
    reason: 'Family ceremony in Kitui',
    status: 'pending',
    requestedAt: '2026-09-23T06:30:00.000Z'
  },
  {
    id: 'off-2',
    staffId: 'staff-3',
    staffName: 'Brian Musyoka',
    date: '2026-09-25',
    reason: 'Personal errands in Mwingi',
    status: 'approved',
    requestedAt: '2026-09-21T10:00:00.000Z',
    respondedAt: '2026-09-21T12:00:00.000Z'
  }
];

export const INITIAL_ADVANCE_PAYMENTS: StaffAdvancePayment[] = [
  {
    id: 'adv-1',
    staffId: 'staff-2',
    staffName: 'Kelvin Mutua',
    date: '2026-09-15',
    amount: 3000,
    reason: 'Tool maintenance & sharpener kit',
    approvedBy: 'Banner Mwangi'
  }
];
