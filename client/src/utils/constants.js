import {
  RiBankCardLine,
  RiBuildingLine,
  RiCalendarLine,
  RiDashboardLine,
  RiGroup3Line,
  RiGroupLine,
  RiHeartPulseLine,
  RiHotelBedLine,
  RiPulseLine,
  RiSettingsLine,
  RiShieldLine,
  RiStethoscopeLine,
  RiUserLine,
} from "@remixicon/react";
import dayjs from "dayjs";

export const dashBoardLinks = [
  {
    id: "home",
    title: "Menu",
    children: [
      {
        id: "dashboard",
        name: "Dashboard",
        href: "/dashboard",
        Icon: RiDashboardLine,
      },
      {
        id: "appointments",
        name: "Appointments",
        href: "/dashboard/appointments",
        Icon: RiCalendarLine,
      },
      {
        id: "patient-appointments",
        name: "Appointments",
        href: "/dashboard/patient-appointments",
        Icon: RiCalendarLine,
      },
      {
        id: "rooms",
        name: "Rooms",
        href: "/dashboard/rooms",
        Icon: RiHotelBedLine,
      },
      {
        id: "payments",
        name: "Payments",
        href: "/dashboard/payments",
        Icon: RiBankCardLine,
      },
    ],
  },
  {
    id: "management",
    title: "Management",
    children: [
      {
        id: "doctors",
        name: "Doctors",
        href: "/dashboard/doctors",
        Icon: RiStethoscopeLine,
      },
      {
        id: "patients",
        name: "Patients",
        href: "/dashboard/patients",
        Icon: RiGroupLine,
      },
      {
        id: "inpatients",
        name: "Inpatients",
        href: "/dashboard/inpatients",
        Icon: RiGroup3Line,
      },
    ],
  },
  {
    id: "setting",
    title: "Setting",
    children: [
      {
        id: "users",
        name: "Users",
        href: `/dashboard/users`,
        Icon: RiUserLine,
      },
      {
        id: "setting",
        name: "Setting",
        href: "/dashboard/settings",
        Icon: RiSettingsLine,
      },
    ],
  },
];

export const settingsLink = [
  {
    id: "account",
    href: "/dashboard/settings/account",
    name: "Account",
  },
  {
    id: "password",
    href: "/dashboard/settings/password",
    name: "Password",
  },
  {
    id: "health",
    href: "/dashboard/settings/health",
    name: "Health Record",
  },
];

export const formatDate = (item, format = "display") => {
  if (format === "input") {
    return dayjs(item).format("YYYY-MM-DD");
  }
  return dayjs(item).format("DD/MM/YYYY");
};

export const formatTextDate = (item, format = "display") => {
  if (format === "input") {
    return dayjs(item).format("YYYY-MM-DD");
  }
  return dayjs(item).format("MMMM D, YYYY");
};

export const formatTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
};

export const doctorsTableColumns = [
  { name: "DOCTOR NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "SPECIALIZATION", uid: "specialization" },
  { name: "PHONE", uid: "phone" },
  { name: "AVAILABILITY STATUS", uid: "availability" },
  { name: "ACTION", uid: "action" },
];
export const doctorsAvailabilityColors = {
  available: "bg-green-200 text-green-700",
  unavailable: "bg-blue-200 text-blue-700",
  "on leave": "bg-yellow-200 text-yellow-700",
  sick: "bg-red-200 text-red-700",
};

export const usersTableColumns = [
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "ROLE", uid: "role" },
  { name: "CREATED AT", uid: "createdAt" },
  { name: "ACTION", uid: "action" },
];

export const usersRoleColors = {
  admin: "bg-blue-200 text-blue-700",
  doctor: "bg-green-200 text-green-700",
  nurse: "bg-yellow-200 text-yellow-700",
  staff: "bg-teal-200 text-teal-700",
  patient: "bg-red-200 text-red-700",
};

export const patientsTableColumns = [
  { name: "NAME", uid: "name" },
  { name: "GENDER", uid: "gender" },
  { name: "DATE OF BIRTH", uid: "dateOfBirth" },
  { name: "ADDRESS", uid: "address" },
  { name: "BLOOD GROUP", uid: "bloodGroup" },
  { name: "PHONE", uid: "phone" },
  { name: "ACTION", uid: "action" },
];

export const roomsTableColumns = [
  { name: "ROOM NUMBER", uid: "roomNumber" },
  { name: "ROOM TYPE", uid: "roomType" },
  { name: "ROOM CAPACITY", uid: "roomCapacity" },
  { name: "ROOM PRICE", uid: "roomPrice" },
  { name: "ROOM STATUS", uid: "roomStatus" },
  { name: "IS FILLED", uid: "isFilled" },
  { name: "ACTION", uid: "action" },
];

export const roomsStatusColors = {
  available: "bg-green-200 text-green-700",
  occupied: "bg-yellow-200 text-yellow-700",
  maintenance: "bg-red-200 text-red-700",
};

export const appointmentsTableColumns = [
  { name: "PATIENT NAME", uid: "patientName" },
  { name: "NOTES", uid: "notes" },
  { name: "DOCTOR", uid: "doctor" },
  { name: "DATE", uid: "appointmentDate" },
  { name: "TIME", uid: "appointmentTime" },
  { name: "STATUS", uid: "status" },
  { name: "ACTION", uid: "action" },
];

export const appointmentsStatusColors = {
  scheduled: "bg-yellow-200 text-yellow-700",
  confirmed: "bg-green-200 text-green-700",
  cancelled: "bg-red-200 text-red-700",
};

export const sortMethods = {
  none: { method: () => null },
  "fullname(A-Z)": {
    method: (a, b) =>
      a.fullname < b.fullname ? -1 : a.fullname > b.fullname ? 1 : 0,
  },
  "fullname(Z-A)": {
    method: (a, b) =>
      a.fullname > b.fullname ? -1 : a.fullname < b.fullname ? 1 : 0,
  },
  "createdAt(Asc)": {
    method: (a, b) =>
      a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0,
  },
  "createdAt(Desc)": {
    method: (a, b) =>
      a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0,
  },
};

export const bloodGroup = {
  "A+": "A-positive",
  "A-": "A-negative",
  "B+": "B-positive",
  "B-": "B-negative",
  "AB+": "AB-positive",
  "AB-": "AB-negative",
  "O+": "O-positive",
  "O-": "O-negative",
};

export const bloodGroupDisplay = {
  "A-positive": "A+",
  "A-negative": "A-",
  "B-positive": "B+",
  "B-negative": "B-",
  "AB-positive": "AB+",
  "AB-negative": "AB-",
  "O-positive": "O+",
  "O-negative": "O-",
};

export const portalLogin = [
  {
    id: 1,
    title: "Admin Portal",
    info: "Secure access for administrator to manage hospital resources.",
    href: "admin",
    Icon: RiUserLine,
    color: "bg-blue-100 text-blue-400",
  },
  {
    id: 2,
    title: "Doctor Portal",
    info: "Secure access for doctors to manage patients, appointments, diagnosis stc.",
    href: "doctor",
    Icon: RiGroupLine,
    color: "bg-green-100 text-green-400",
  },
  {
    id: 3,
    title: "Nurses Portal",
    info: "Secure access for nurses to manage patient care, schedules, and vital signs..",
    href: "nurse",
    Icon: RiGroupLine,
    color: "bg-yellow-100 text-yellow-400",
  },
  {
    id: 4,
    title: "Patient Portal",
    info: "Easy access for patients to view appointments, medical records, and more.",
    href: "patient",
    Icon: RiHeartPulseLine,
    color: "bg-red-100 text-red-400",
  },
];

export const enterpriseFeatures = [
  {
    id: 1,
    title: "Hospital Operations",
    info: "Streamline daily operations, resource allocation, and staff management.",
    Icon: RiBuildingLine,
  },
  {
    id: 2,
    title: "Data Security",
    info: "HIPAA-compliant security measures to protect sensitive patient data.",
    Icon: RiShieldLine,
  },
  {
    id: 3,
    title: "Clinical Management",
    info: "Comprehensive tools for patient care and clinical workflow optimization.",
    Icon: RiPulseLine,
  },
];

export const clinicareStats = [
  {
    id: 1,
    title: "100+",
    subtitle: "Hospitals",
  },
  {
    id: 2,
    title: "1000+",
    subtitle: "Healthcare Professionals",
  },
  {
    id: 3,
    title: "1M+",
    subtitle: "Patients Served",
  },
  {
    id: 4,
    title: "99.9%",
    subtitle: "System Uptime",
  },
];

export const roleBasedPathPermissions = {
  admin: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/payments",
      "/dashboard/doctors",
      "/dashboard/patients",
      "/dashboard/inpatients",
      "/dashboard/users",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  doctor: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/doctors",
      "/dashboard/patients",
      "/dashboard/inpatients",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
  patient: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/patient-appointments",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
      "/dashboard/settings/health",
    ],
  },
  nurse: {
    allowedSubpaths: [
      "/dashboard",
      "/dashboard/appointments",
      "/dashboard/rooms",
      "/dashboard/settings",
      "/dashboard/settings/account",
      "/dashboard/settings/password",
    ],
  },
};

// Check if a role should be visible/selectable in the UI
export const isRoleVisible = (sessionUser, role) => {
  // Regular users can't see any role options
  if (sessionUser.role === "patient") {
    return role === "patient";
  }
  // Admins can see all and admin roles
  if (sessionUser.role === "admin") {
    return true;
  }

  // Doctors can see all roles except admin
  if (sessionUser.role === "doctor") {
    return ["patient", "doctor", "nurse", "staff"].includes(role);
  }

  // Nurses can see all roles except admin
  if (sessionUser.role === "nurse") {
    return ["patient", "doctor", "nurse", "staff"].includes(role);
  }

  // Staff can see all roles except admin
  if (sessionUser.role === "staff") {
    return role === "staff";
  }
  return false;
};

export const tryCatchFn = (fn) => {
  return async (...params) => {
    try {
      const response = await fn(...params);
      return response;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("API Error:", error);
      }
      return error.response?.data;
    }
  };
};

export const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};
