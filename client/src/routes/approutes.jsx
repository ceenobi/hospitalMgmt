import {
  getAllAppointments,
  getAppointmentMeta,
  getPatientAppointments,
} from "@/features/appointment/services/api";
import { authUser } from "@/features/auth/services/api";
import {
  getAllUserCollections,
  getDoctors,
} from "@/features/doctor/services/api";
import { getAllPatients, getPatient } from "@/features/patient/services/api";
import { getAllRooms, getRoomMeta } from "@/features/room/services/api";
import { getAllUsers } from "@/features/user/services/api";
import ErrorBoundary from "@/shared/components/errorBoundary";
import LazyLoader from "@/shared/components/lazyLoader";
import { createBrowserRouter } from "react-router";

const authCheck = async () => {
  const res = await authUser();
  return res?.data;
};

const routes = [
  {
    path: "/",
    id: "auth_user",
    loader: authCheck,
    errorElement: <ErrorBoundary />,
    lazy: () => import("./root"),
    hydrate: true,
    hydrateFallbackElement: <LazyLoader />,
    children: [
      {
        path: "account",
        lazy: () => import("@/layouts/authLayout"),
        children: [
          {
            path: "signup",
            lazy: {
              Component: async () =>
                (await import("@/pages/auth/signup")).Component,
              action: async () =>
                (await import("@/features/auth/services/actions"))
                  .registerAction,
            },
          },
          {
            path: "signin",
            lazy: {
              Component: async () =>
                (await import("@/pages/auth/signin")).Component,
              action: async () =>
                (await import("@/features/auth/services/actions")).loginAction,
            },
          },
          {
            path: "forgot-password",
            lazy: {
              Component: async () =>
                (await import("@/pages/auth/forgotPassword")).Component,
              action: async () =>
                (await import("@/features/auth/services/actions"))
                  .getPasswordResetTokenAction,
            },
          },
          {
            path: "reset-password",
            lazy: {
              Component: async () =>
                (await import("@/pages/auth/resetPassword")).Component,
              action: async () =>
                (await import("@/features/auth/services/actions"))
                  .resetPasswordAction,
            },
          },
        ],
      },
      {
        lazy: () => import("@/layouts/onboardLayout"),
        children: [
          {
            path: "verify-account",
            lazy: {
              Component: async () =>
                (await import("@/pages/auth/verifyAccount")).Component,
              action: async () =>
                (await import("@/features/auth/services/actions"))
                  .verifyAccountAction,
            },
          },
          {
            path: "patients-onboard",
            lazy: {
              Component: async () =>
                (await import("@/pages/patientsOnboard")).Component,
              action: async () =>
                (await import("@/features/patient/services/actions"))
                  .patientAction,
            },
          },
        ],
      },
      {
        path: "/",
        lazy: () => import("@/layouts/rootLayout"),
        children: [
          {
            index: true,
            lazy: {
              Component: async () => (await import("@/pages/home")).Component,
            },
          },
          {
            path: "contact",
            lazy: {
              Component: async () =>
                (await import("@/pages/contact")).Component,
            },
          },
        ],
      },
      {
        lazy: () => import("@/layouts/dashboardLayout"),
        children: [
          {
            index: true,
            lazy: {
              Component: async () =>
                (await import("@/pages/dashboard")).Component,
            },
          },
          {
            path: "dashboard",
            children: [
              {
                path: "settings",
                lazy: {
                  Component: async () =>
                    (await import("@/pages/settings")).Component,
                },
                children: [
                  {
                    path: "account",
                    lazy: {
                      Component: async () =>
                        (await import("@/pages/settings/account")).Component,
                      action: async () =>
                        (await import("@/features/auth/services/actions"))
                          .updateAccountAction,
                    },
                  },
                  {
                    path: "password",
                    lazy: {
                      Component: async () =>
                        (await import("@/pages/settings/password")).Component,
                      action: async () =>
                        (await import("@/features/auth/services/actions"))
                          .updatePasswordAction,
                    },
                  },
                  {
                    path: "health",
                    loader: async ({ request }) =>
                      await getPatient({ request }),
                    lazy: {
                      Component: async () =>
                        (await import("@/pages/settings/health")).Component,
                      action: async () =>
                        (await import("@/features/patient/services/actions"))
                          .patientAction,
                    },
                  },
                ],
              },
              {
                path: "doctors",
                id: "doctor_users",
                loader: async ({ request }) => {
                  const [meta, doctors] = await Promise.all([
                    getAllUserCollections(),
                    getDoctors({ request }),
                  ]);
                  return { meta, doctors };
                },
                lazy: {
                  Component: async () =>
                    (await import("@/pages/doctor")).Component,
                  action: async () =>
                    (await import("@/features/doctor/services/actions"))
                      .doctorAction,
                },
              },
              {
                path: "patients",
                loader: async ({ request }) =>
                  await getAllPatients({ request }),
                lazy: {
                  Component: async () =>
                    (await import("@/pages/patient")).Component,
                  action: async () =>
                    (await import("@/features/patient/services/actions"))
                      .patientAction,
                },
              },
              {
                path: "rooms",
                id: "room_data",
                loader: async ({ request }) => {
                  const [roomMeta, roomsData] = await Promise.all([
                    getRoomMeta(),
                    getAllRooms({ request }),
                  ]);
                  return { roomMeta, roomsData };
                },
                lazy: {
                  Component: async () =>
                    (await import("@/pages/room")).Component,
                  action: async () =>
                    (await import("@/features/room/services/actions"))
                      .roomAction,
                },
              },
              {
                path: "users",
                loader: async ({ request }) => await getAllUsers({ request }),
                lazy: {
                  Component: async () =>
                    (await import("@/pages/user")).Component,
                  action: async () =>
                    (await import("@/features/user/services/actions"))
                      .userAction,
                },
              },
              {
                path: "appointments",
                id: "appointment_data",
                loader: async ({ request }) => {
                  const [appointmentMeta, appointmentsData] = await Promise.all(
                    [getAppointmentMeta(), getAllAppointments({ request })]
                  );
                  return {
                    appointmentMeta,
                    appointmentsData,
                  };
                },
                lazy: {
                  Component: async () =>
                    (await import("@/pages/appointment")).Component,
                  action: async () =>
                    (await import("@/features/appointment/services/actions"))
                      .appointmentAction,
                },
              },
              {
                path: "patient-appointments",
                loader: async ({ request }) =>
                  await getPatientAppointments({ request }),
                lazy: {
                  Component: async () =>
                    (await import("@/pages/appointment/patientAppointments"))
                      .Component,
                  action: async () =>
                    (await import("@/features/appointment/services/actions"))
                      .appointmentAction,
                },
              },
            ],
          },
        ],
      },
      {
        path: "logout",
        lazy: {
          Component: async () =>
            (await import("@/pages/auth/logout")).Component,
          action: async () =>
            (await import("@/features/auth/services/actions")).logoutAction,
        },
      },
    ],
  },
];

export default function Routes() {
  const router = createBrowserRouter(routes);
  return router;
}
