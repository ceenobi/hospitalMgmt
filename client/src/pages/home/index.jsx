import useMetaArgs from "@/hooks/useMeta";
import {
  clinicareStats,
  enterpriseFeatures,
  portalLogin,
} from "@/utils/constants";
import { Link } from "react-router";

export function Component() {
  useMetaArgs({
    title: "Home - Clinicare",
    description: "Welcome to Clinicare.",
    keywords: "Clinicare, home, account",
  });
  return (
    <>
      <div className="mt-20 py-5 px-4 max-w-[600px] mx-auto min-h-[450px] flex flex-col justify-end items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Welcome to <br />
          <span className="text-blue-500 text-6xl md:text-7xl">Clinicare</span>
        </h1>
        <p className="mt-8 text-zinc-800 text-center">
          Manage your hospital operations, patient records, and more with our
          powerful hospital management system.
        </p>
        <div className="mt-8 flex gap-4 items-center">
          <button className="btn bg-zinc-800 text-white">
            <Link to="/account/signup">New Patient</Link>
          </button>
          <button className="btn btn-outline">
            <Link to="/account/signin">Login to Clinicare</Link>
          </button>
        </div>
      </div>
      <div className="py-5 px-4 mt-10 w-full max-w-7xl mx-auto">
        <div className="relative aspect-video w-full md:rounded-xl overflow-hidden shadow-lg">
          <picture>
            {/* WebP format with responsive sizes */}
            <source
              srcSet={`
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_640/Clinicare/public/hospitalHero_nm5w6b.webp 640w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1024/Clinicare/public/hospitalHero_nm5w6b.webp 1024w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1280/Clinicare/public/hospitalHero_nm5w6b.webp 1280w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1920/Clinicare/public/hospitalHero_nm5w6b.webp 1920w
              `}
              type="image/webp"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            />
            {/* Fallback to JPEG */}
            <source
              srcSet={`
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_640/Clinicare/public/hospitalHero_nm5w6b.jpg 640w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1024/Clinicare/public/hospitalHero_nm5w6b.jpg 1024w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1280/Clinicare/public/hospitalHero_nm5w6b.jpg 1280w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1920/Clinicare/public/hospitalHero_nm5w6b.jpg 1920w
              `}
              type="image/jpeg"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            />
            <img
              src="https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1920/Clinicare/public/hospitalHero_nm5w6b.jpg"
              srcSet="
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_640/Clinicare/public/hospitalHero_nm5w6b.jpg 640w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1024/Clinicare/public/hospitalHero_nm5w6b.jpg 1024w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1280/Clinicare/public/hospitalHero_nm5w6b.jpg 1280w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1920/Clinicare/public/hospitalHero_nm5w6b.jpg 1920w
              "
              alt="Modern hospital facility with clean interiors and medical professionals"
              className="w-full h-full object-cover object-center"
              width={1920}
              height={1080}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      </div>
      <div className="my-10 container mx-auto py-5 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Dedicated Portals for Every User
        </h1>
        <div className="mt-8 grid grid-cols-12 gap-4 lg:gap-8">
          {portalLogin.map((portal) => (
            <div
              key={portal.id}
              className="col-span-12 md:col-span-6 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center border-[0.2px] border-gray-500 h-[250px] text-center"
            >
              <portal.Icon
                className={`text-2xl mb-4 p-3 rounded-full ${portal.color}`}
                size={50}
              />
              <h2 className="text-xl font-bold mb-2">{portal.title}</h2>
              <p className="text-zinc-800 mb-4">{portal.info}</p>
              <Link
                to="/account/signin"
                className="btn border-[0.2px] border-gray-500"
              >
                {portal.title.split(" ")[0] + " Login"}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="my-14 container mx-auto py-5 px-4" id="features">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Enterprise-Grade Features
        </h1>
        <div className="mt-8 grid grid-cols-12 gap-4 lg:gap-8">
          {enterpriseFeatures.map((feature) => (
            <div
              key={feature.id}
              className="col-span-12 md:col-span-4 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center border-[0.2px] border-gray-500 h-[250px] text-center"
            >
              <feature.Icon
                className="text-2xl mb-4 p-3 rounded-full bg-blue-100 text-blue-400"
                size={50}
              />
              <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
              <p className="text-zinc-800 mb-4">{feature.info}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="py-5 px-4 mt-10 w-full max-w-7xl mx-auto">
        <div className="relative aspect-video w-full md:rounded-xl overflow-hidden shadow-lg">
          <picture>
            <source
              srcSet={`
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_640/Clinicare/public/clinicare-dashboard_siybbu.webp 640w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1024/Clinicare/public/clinicare-dashboard_siybbu.webp 1024w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1280/Clinicare/public/clinicare-dashboard_siybbu.webp 1280w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1920/Clinicare/public/clinicare-dashboard_siybbu.webp 1920w
              `}
              type="image/webp"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            />
            {/* Fallback to JPEG */}
            <source
              srcSet={`
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_640/Clinicare/public/clinicare-dashboard_siybbu.jpg 640w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1024/Clinicare/public/clinicare-dashboard_siybbu.jpg 1024w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1280/Clinicare/public/clinicare-dashboard_siybbu.jpg 1280w,
                https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1920/Clinicare/public/clinicare-dashboard_siybbu.jpg 1920w
              `}
              type="image/jpeg"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            />
            <img
              src="https://res.cloudinary.com/ceenobi/image/upload/v1753611666/Clinicare/public/clinicare-dashboard_siybbu.png"
              alt="clinicare"
              srcSet="
              https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_640/Clinicare/public/clinicare-dashboard_siybbu.png 640w,
              https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1024/Clinicare/public/clinicare-dashboard_siybbu.png 1024w,
              https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1280/Clinicare/public/clinicare-dashboard_siybbu.png 1280w,
              https://res.cloudinary.com/ceenobi/image/upload/f_auto,q_auto,w_1920/Clinicare/public/clinicare-dashboard_siybbu.png 1920w
            "
              className="w-full h-full object-cover object-center"
              width={1920}
              height={1080}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      </div>
      <div className="my-20 py-5 px-4 bg-blue-500">
        <div className="container mx-auto grid grid-cols-12 gap-4 lg:gap-8">
          {clinicareStats.map((stat) => (
            <div
              key={stat.id}
              className="col-span-12 md:col-span-3 text-white p-4 flex flex-col items-center justify-center h-[100px] md:h-[200px] text-center"
            >
              <h1 className="text-4xl font-bold mb-2">{stat.title}</h1>
              <p>{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20 py-5 px-4 container mx-auto">
        <div className="pb-10 flex flex-col justify-center items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">
            Ready to Transform Your Hospital Experience?
          </h1>
          <p>
            Take advantage of our awesome services and enjoy rich healthcare
            experience at the comfort of your home.
          </p>

          <Link to="account/signin">
            <button className="btn bg-blue-500 hover:bg-blue-600 text-white">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

Component.displayName = "Home";
