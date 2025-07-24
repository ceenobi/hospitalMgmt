import {
  getAllAppointments,
  getAppointmentMeta,
  getPatientAppointments,
} from "@/features/appointment/services/api";
import {
  getAllUserCollections,
  getDoctors,
} from "@/features/doctor/services/api";
import { getAllPatients, getPatient } from "@/features/patient/services/api";
import { getAllRooms, getRoomMeta } from "@/features/room/services/api";
import { getAllUsers } from "@/features/user/services/api";
import ErrorBoundary from "@/components/errorBoundary";
import LazyLoader from "@/components/lazyLoader";
import { createBrowserRouter, RouterProvider } from "react-router";
import { useAuthToken } from "@/context";
import { getAllPayments } from "@/features/payments/services/api";

export default function Routes() {
  const { accessToken, setAccessToken } = useAuthToken();
  const routes = [
    {
      path: "/",
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
                  (await import("@/features/auth/services/actions"))
                    .loginAction,
              },
            },
            {
              path: "forgot-password",
              lazy: {
                Component: async () =>
                  (await import("@/pages/auth/forgotPassword")).Component,
              },
              action: async ({ request }) =>
                (
                  await import("@/features/auth/services/actions")
                ).getPasswordResetTokenAction({ request, accessToken }),
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
          path: "dashboard",
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
                      },
                      action: async ({ request }) =>
                        (
                          await import("@/features/auth/services/actions")
                        ).updateAccountAction({ request, accessToken }),
                    },
                    {
                      path: "password",
                      lazy: {
                        Component: async () =>
                          (await import("@/pages/settings/password")).Component,
                      },
                      action: async ({ request }) =>
                        (
                          await import("@/features/auth/services/actions")
                        ).updatePasswordAction({ request, accessToken }),
                    },
                    {
                      path: "health",
                      loader: async ({ request }) =>
                        await getPatient({ request }),
                      lazy: {
                        Component: async () =>
                          (await import("@/pages/settings/health")).Component,
                      },
                      action: async ({ request }) =>
                        (
                          await import("@/features/patient/services/actions")
                        ).patientAction({ request, accessToken }),
                    },
                  ],
                },
                {
                  path: "doctors",
                  id: "doctor_users",
                  loader: async ({ request }) => {
                    const [meta, doctors] = await Promise.all([
                      getAllUserCollections(accessToken),
                      getDoctors({ request, accessToken }),
                    ]);
                    return { meta, doctors };
                  },
                  lazy: {
                    Component: async () =>
                      (await import("@/pages/doctor")).Component,
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/doctor/services/actions")
                    ).doctorAction({ request, accessToken }),
                },
                {
                  path: "patients",
                  loader: async ({ request }) =>
                    await getAllPatients({ request, accessToken }),
                  lazy: {
                    Component: async () =>
                      (await import("@/pages/patient")).Component,
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/patient/services/actions")
                    ).patientAction({ request, accessToken }),
                },
                {
                  path: "rooms",
                  id: "room_data",
                  loader: async ({ request }) => {
                    const [roomMeta, roomsData] = await Promise.all([
                      getRoomMeta(accessToken),
                      getAllRooms({ request, accessToken }),
                    ]);
                    return { roomMeta, roomsData };
                  },
                  lazy: {
                    Component: async () =>
                      (await import("@/pages/room")).Component,
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/room/services/actions")
                    ).roomAction({ request, accessToken }),
                },
                {
                  path: "users",
                  loader: async ({ request }) =>
                    await getAllUsers({ request, accessToken }),
                  lazy: {
                    Component: async () =>
                      (await import("@/pages/user")).Component,
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/user/services/actions")
                    ).userAction({ request, accessToken }),
                },
                {
                  path: "appointments",
                  id: "appointment_data",
                  loader: async ({ request }) => {
                    const [appointmentMeta, appointmentsData] =
                      await Promise.all([
                        getAppointmentMeta(accessToken),
                        getAllAppointments({
                          request,
                          accessToken,
                        }),
                      ]);
                    return {
                      appointmentMeta,
                      appointmentsData,
                    };
                  },
                  lazy: {
                    Component: async () =>
                      (await import("@/pages/appointment")).Component,
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/appointment/services/actions")
                    ).appointmentAction({ request, accessToken }),
                },
                {
                  path: "patient-appointments",
                  loader: async ({ request }) =>
                    await getPatientAppointments({ request, accessToken }),
                  lazy: {
                    Component: async () =>
                      (await import("@/pages/appointment/patientAppointments"))
                        .Component,
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/appointment/services/actions")
                    ).appointmentAction({ request, accessToken }),
                },
                {
                  path: "payments",
                  lazy: {
                    Component: async () =>
                      (await import("@/pages/payments")).Component,
                  },
                  loader: async ({ request }) => {
                    const [paymentMeta, paymentData] = await Promise.all([
                      getAppointmentMeta(accessToken),
                      getAllPayments({
                        request,
                        accessToken,
                      }),
                    ]);
                    return {
                      paymentMeta,
                      paymentData,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/payments/services/actions")
                    ).paymentAction({ request, accessToken }),
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
          },
          action: async () =>
            (await import("@/features/auth/services/actions")).logoutAction({
              setAccessToken,
            }),
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
