import { TRole } from "@/types/role";
import { removeCookie } from "@/utils/cookies";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const ProfileIcon = ({
  imgURL,
  role,
  setRole,
}: {
  imgURL: string;
  role: TRole;
  setRole: React.Dispatch<React.SetStateAction<TRole>>;
}) => {
  const router = useRouter();

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <Image
            alt="Tailwind CSS Navbar component"
            src={imgURL}
            height={200}
            width={200}
          />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-[black]"
      >
        <li>
          <a className="justify-between">Profile</a>
        </li>
        {role === "USER" && (
          <li>
            <a>Saved Addresses</a>
          </li>
        )}
        <li>
          <span
            onClick={(e) => {
              let timer;
              if (e.detail === 1) {
                timer = setTimeout(() => {
                  toast.info("Double click to log out", {
                    duration: 1200,
                    id: "first-toast",
                  });
                }, 200);
              } else if (e.detail === 2) {
                clearTimeout(timer);
                setRole("GUEST");
                removeCookie("token");
                toast.dismiss("first-toast");

                setTimeout(() => {
                  toast.dismiss("first-toast");
                  toast.success("You have been logged out", {
                    duration: 1500,
                    dismissible: false,
                    important: true,
                  });
                  router.push("/home");
                }, 100);
              }
            }}
          >
            Log Out
          </span>
        </li>
      </ul>
    </div>
  );
};
