import { useSession } from "next-auth/react";
import { type FC, useState } from "react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
interface HeartButton {
  id: number;
  numberOfLikes: number;
  isLiked: boolean;
  refetch?: () => void;
}

const HeartButton: FC<HeartButton> = ({
  id,
  numberOfLikes,
  isLiked,
  refetch,
}) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState<number>(numberOfLikes);
  const { mutate } = api.main.setLikeOfDish.useMutation();
  const handleLikeClick = () => {
    const user_id = session?.user?.id;
    if (user_id) {
      try {
        const like = isLiked ? -1 : 1;
        mutate(
          { user_id: session?.user.id, dish_id: id },
          {
            onError() {
              toast.error("Error accured!");
            },
            onSuccess() {
              refetch?.();
            },
          }
        );
        setLikes(likes + like);
      } catch (error) {
        console.error("Wrong with like button: ", error);
      }
    } else {
      toast.error("You are not logged in!");
    }
  };
  return (
    <div>
      <button className="bottom-0 right-3" onClick={handleLikeClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-auto w-6 fill-current ${
            isLiked ? "text-red-400" : "text-gray-400"
          }`}
          viewBox="0 0 512 512"
        >
          <path
            d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"
            style={{ outline: isLiked ? "none" : "1px solid gray" }} // add outline when not liked
          />
        </svg>
        {likes}
      </button>
    </div>
  );
};

export default HeartButton;
