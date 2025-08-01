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
import {
  getAllPayments,
  getPatientPayments,
} from "@/features/payments/services/api";
import { PrivateRoutes, PublicRoutes } from "./protectedRoutes";

export default function Routes() {
  const { accessToken, setAccessToken, user } = useAuthToken();
  const protectedLoader = (loader) => {
    return async (args) => {
      if (!accessToken) {
        throw new Response("", {
          status: 302,
          headers: {
            Location: "/account/signin",
            "X-Redirect": "true",
          },
        });
      }
      return loader ? await loader(args) : null;
    };
  };
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
          lazy: async () => {
            const { Component } = await import("@/layouts/authLayout");
            return {
              Component: () => (
                <PublicRoutes accessToken={accessToken} user={user}>
                  <Component />
                </PublicRoutes>
              ),
            };
          },
          children: [
            {
              path: "signup",
              lazy: async () => {
                const { Component } = await import("@/pages/auth/signup");
                return {
                  Component: () => <Component />,
                };
              },
              action: async ({ request }) =>
                (
                  await import("@/features/auth/services/actions")
                ).registerAction({ request }),
            },
            {
              path: "signin",
              lazy: async () => {
                const { Component } = await import("@/pages/auth/signin");
                return {
                  Component: () => <Component />,
                };
              },
              action: async ({ request }) =>
                (await import("@/features/auth/services/actions")).loginAction({
                  request,
                }),
            },
            {
              path: "forgot-password",
              lazy: async () => {
                const { Component } = await import(
                  "@/pages/auth/forgotPassword"
                );
                return {
                  Component: () => <Component />,
                };
              },
              action: async ({ request }) =>
                (
                  await import("@/features/auth/services/actions")
                ).getPasswordResetTokenAction({ request, accessToken }),
            },
            {
              path: "reset-password",
              lazy: async () => {
                const { Component } = await import(
                  "@/pages/auth/resetPassword"
                );
                return {
                  Component: () => <Component />,
                };
              },
              action: async ({ request }) =>
                (
                  await import("@/features/auth/services/actions")
                ).resetPasswordAction({ request, accessToken }),
            },
          ],
        },
        {
          lazy: async () => {
            const { Component } = await import("@/layouts/onboardLayout");
            return {
              Component: () => (
                <PrivateRoutes accessToken={accessToken} user={user}>
                  <Component />
                </PrivateRoutes>
              ),
            };
          },
          children: [
            {
              path: "verify-account",
              lazy: async () => {
                const { Component } = await import(
                  "@/pages/auth/verifyAccount"
                );
                return {
                  Component: () => <Component />,
                };
              },
              action: async ({ request }) =>
                (
                  await import("@/features/auth/services/actions")
                ).verifyAccountAction({ request, accessToken }),
            },
            {
              path: "patients-onboard",
              lazy: async () => {
                const { Component } = await import("@/pages/patientsOnboard");
                return {
                  Component: () => <Component />,
                };
              },
              action: async ({ request }) =>
                (
                  await import("@/features/patient/services/actions")
                ).patientAction({ request, accessToken }),
            },
          ],
        },
        {
          path: "/",
          lazy: async () => {
            const { Component } = await import("@/layouts/rootLayout");
            return {
              Component: () => (
                <PublicRoutes accessToken={accessToken} user={user}>
                  <Component />
                </PublicRoutes>
              ),
            };
          },
          children: [
            {
              index: true,
              lazy: async () => {
                const { Component } = await import("@/pages/home");
                return {
                  Component: () => <Component />,
                };
              },
            },
            {
              path: "contact",
              lazy: async () => {
                const { Component } = await import("@/pages/contact");
                return {
                  Component: () => <Component />,
                };
              },
            },
          ],
        },
        {
          path: "dashboard",
          lazy: async () => {
            const { Component } = await import("@/layouts/dashboardLayout");
            return {
              Component: () => (
                <PrivateRoutes accessToken={accessToken} user={user}>
                  <Component />
                </PrivateRoutes>
              ),
            };
          },
          children: [
            {
              index: true,
              lazy: async () => {
                const { Component } = await import("@/pages/dashboard");
                return {
                  Component: () => <Component />,
                };
              },
            },
            {
              children: [
                {
                  path: "settings",
                  lazy: async () => {
                    const { Component } = await import("@/pages/settings");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  children: [
                    {
                      path: "account",
                      lazy: async () => {
                        const { Component } = await import(
                          "@/pages/settings/account"
                        );
                        return {
                          Component: () => <Component />,
                        };
                      },
                      action: async ({ request }) =>
                        (
                          await import("@/features/auth/services/actions")
                        ).updateAccountAction({ request, accessToken }),
                    },
                    {
                      path: "password",
                      lazy: async () => {
                        const { Component } = await import(
                          "@/pages/settings/password"
                        );
                        return {
                          Component: () => <Component />,
                        };
                      },
                      action: async ({ request }) =>
                        (
                          await import("@/features/auth/services/actions")
                        ).updatePasswordAction({ request, accessToken }),
                    },
                    {
                      path: "health",
                      loader: protectedLoader(() => getPatient(accessToken)),
                      // loader: async () => await getPatient(accessToken),
                      lazy: async () => {
                        const { Component } = await import(
                          "@/pages/settings/health"
                        );
                        return {
                          Component: () => <Component />,
                        };
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
                  loader: protectedLoader(async ({ request }) => {
                    const [meta, doctors] = await Promise.all([
                      getAllUserCollections(accessToken),
                      getDoctors({ request, accessToken }),
                    ]);
                    return { meta, doctors };
                  }),
                  lazy: async () => {
                    const { Component } = await import("@/pages/doctor");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/doctor/services/actions")
                    ).doctorAction({ request, accessToken }),
                },
                {
                  path: "patients",
                  loader: protectedLoader(
                    async ({ request }) =>
                      await getAllPatients({ request, accessToken })
                  ),
                  lazy: async () => {
                    const { Component } = await import("@/pages/patient");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/patient/services/actions")
                    ).patientAction({ request, accessToken }),
                },
                {
                  path: "inpatients",
                  // loader: async ({ request }) =>
                  //   await getAllPatients({ request, accessToken }),
                  lazy: async () => {
                    const { Component } = await import("@/pages/inpatients");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  // action: async ({ request }) =>
                  //   (
                  //     await import("@/features/inpatients/services/actions")
                  //   ).inpatientAction({ request, accessToken }),
                },
                {
                  path: "rooms",
                  id: "room_data",
                  loader: protectedLoader(async ({ request }) => {
                    const [roomMeta, roomsData] = await Promise.all([
                      getRoomMeta(accessToken),
                      getAllRooms({ request, accessToken }),
                    ]);
                    return { roomMeta, roomsData };
                  }),
                  lazy: async () => {
                    const { Component } = await import("@/pages/room");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/room/services/actions")
                    ).roomAction({ request, accessToken }),
                },
                {
                  path: "users",
                  loader: protectedLoader(
                    async ({ request }) =>
                      await getAllUsers({ request, accessToken })
                  ),
                  lazy: async () => {
                    const { Component } = await import("@/pages/user");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/user/services/actions")
                    ).userAction({ request, accessToken }),
                },
                {
                  path: "appointments",
                  id: "appointment_data",
                  loader: protectedLoader(async ({ request }) => {
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
                  }),
                  lazy: async () => {
                    const { Component } = await import("@/pages/appointment");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/appointment/services/actions")
                    ).appointmentAction({ request, accessToken }),
                },
                {
                  path: "patient-appointments",
                  loader: protectedLoader(
                    async ({ request }) =>
                      await getPatientAppointments({ request, accessToken })
                  ),
                  lazy: async () => {
                    const { Component } = await import(
                      "@/pages/appointment/patientAppointments"
                    );
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/appointment/services/actions")
                    ).appointmentAction({ request, accessToken }),
                },
                {
                  path: "payments",
                  id: "payment_data",
                  loader: protectedLoader(async ({ request }) => {
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
                  }),
                  lazy: async () => {
                    const { Component } = await import("@/pages/payments");
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/payments/services/actions")
                    ).paymentAction({ request, accessToken }),
                },
                {
                  path: "patient-payments",
                  loader: protectedLoader(
                    async ({ request }) =>
                      await getPatientPayments({ request, accessToken })
                  ),
                  lazy: async () => {
                    const { Component } = await import(
                      "@/pages/payments/patientPayments"
                    );
                    return {
                      Component: () => <Component />,
                    };
                  },
                  action: async ({ request }) =>
                    (
                      await import("@/features/payments/services/actions")
                    ).paymentReceiptAction({ request, accessToken }),
                },
              ],
            },
          ],
        },
        {
          path: "logout",
          lazy: async () => {
            const { Component } = await import("@/pages/auth/logout");
            return {
              Component: () => <Component />,
            };
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
