import { DIRECTUS_CONSTANTS } from "@/utils/constant";
import Image from "next/image";

type UserProps = {
  avatar?: string | null;
  email?: string | null;
  name?: string | null;
  wrapperClassName?: string;
  avatarClassName?: string;
};

const User: React.FC<UserProps> = ({
  avatar,
  email,
  name,
  wrapperClassName,
  avatarClassName,
}) => {
  const nameToDisplay = name ?? "Unknown";
  const emailToDisplay = email ?? "Unknown";

  return (
    <div className={`flex items-center gap-4 ${wrapperClassName}`}>
      <div className={`avatar ${!avatar && "placeholder"}`}>
        <div className={`w-10 rounded-full ${avatarClassName} `}>
          {avatar ? (
            <Image
              src={DIRECTUS_CONSTANTS.ASSETS_URL + `/${avatar}`}
              width={40}
              height={40}
              alt={nameToDisplay}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-neutral-content">
              <span className="text-2xl font-bold">{nameToDisplay}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="font-bold">{nameToDisplay}</span>
        <span className="text-sm text-neutral-content">{emailToDisplay}</span>
      </div>
    </div>
  );
};

export default User;
