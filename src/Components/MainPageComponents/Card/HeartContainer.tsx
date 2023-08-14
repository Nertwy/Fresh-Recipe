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
          className={`h-6 w-6 fill-current ${
            isLiked ? "text-red-400" : "text-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            // style={{ outline: isLiked ? "none" : "1px solid gray" }}
          />
        </svg>
        {likes}
      </button>
    </div>
  );
};

export default HeartButton;
