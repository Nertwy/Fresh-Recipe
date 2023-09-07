import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, type FC } from "react";
import { toast } from "react-toastify";
import { type ThreadTreeData, type Thread, ClientThread } from "~/types";
import { api } from "~/utils/api";

type CommentProps = {
  comment: Thread;
  replies: Thread[];
  level: number;
};
const Comment: FC<CommentProps> = ({ comment, replies, level }) => {
  const marginLeft = 10 * level;
  return (
    <div
      className={`mb-4 ml-${marginLeft} border-l-2 border-gray-500 pl-4 text-base sm:text-lg`}
    >
      <p>{comment?.body}</p>
      <p>
        Posted by User {comment?.user_id} on{" "}
        {comment?.created_at?.toISOString()}
      </p>
      <Image
        src={comment?.image ?? ""}
        alt={`User ${comment?.user_id}`}
        height={50}
        width={50}
      />
      <div className="mt-4 space-y-4">
        {replies.map((reply) => (
          <Comment
            key={reply?.id}
            comment={reply}
            replies={[]}
            level={level + 1}
          />
        ))}
      </div>
    </div>
  );
};

type CommentsSectionProps = {
  comments: Thread[];
  post_id: number;
  refetch?: () => void;
};
const CommentsSection: FC<CommentsSectionProps> = ({ comments, post_id,refetch }) => {
  const { status, data } = useSession();
  const [isTextAreaOpen, setIsTextAreaOpen] = useState<number | null>(null);
  const [commentState, setCommentState] = useState<ClientThread>({
    body: "",
    created_at: null,
    parent_id: null,
    post_id: post_id - 1,
    user_id: "",
  });
  const postComment = api.main.postComment.useMutation();

  const toggleTextArea = (commentId: number | null) => {
    if (isTextAreaOpen === commentId || commentId === null) {
      // If the same comment's "Reply" button is clicked again, close the text area.
      setIsTextAreaOpen(null);
    } else {
      // Otherwise, open the text area for the clicked comment.
      setIsTextAreaOpen(commentId);
    }
  };

  const buildCommentTree = (
    comments: Thread[],
    parent_id: null | number = null
  ): { comment: Thread; children: ThreadTreeData[] }[] => {
    return comments
      .filter((comment) => comment?.parent_id === parent_id)
      .map((comment) => ({
        comment,
        children: buildCommentTree(comments, comment?.id),
      }));
  };

  const commentTree = buildCommentTree(comments);

  //Write a submitComment Function
  const submitComment = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (status !== "authenticated") {
      toast.info("Login to post comments");
    }
    if (!data?.user.id && data === null) {
      toast.error("No user_id provided!");
      return;
    }
    if (commentState.post_id === null) return;
    postComment.mutate(
      {
        body: commentState.body,
        post_id: commentState.post_id,
        parent_id: commentState.parent_id,
        created_at: new Date(),
        user_id: data.user.id,
      },
      {
        onSuccess() {
          void refetch?.();
        },
      }
    );
  };
  const renderComments = (
    commentData: ThreadTreeData[],
    level = 0
  ): JSX.Element[] => {
    return commentData.map(({ comment, children }) => (
      <div
        key={comment?.id}
        className={`my-4 ml-${level * 10} border-l-2 border-gray-500 pl-4`}
      >
        <p>{comment?.body}</p>
        <p>
          Posted by User {comment?.user_id} on{" "}
          {comment?.created_at?.toISOString()}
        </p>
        <Image
          src={comment?.image ?? ""}
          alt={`User ${comment?.user_id}`}
          height={50}
          width={50}
        />
        <div className="my-4 space-y-4">
          {renderComments(children, level + 1)}
        </div>
        <div>
          {isTextAreaOpen === comment?.id ? (
            <div className="flex flex-col">
              <textarea
                onChange={(e) =>
                  setCommentState({
                    ...commentState,
                    body: e.currentTarget.value,
                  })
                }
                className="textarea textarea-bordered mb-4"
                placeholder="Comment Here"
              ></textarea>
              <div className="flex justify-between">
                <button className="btn" onClick={() => toggleTextArea(null)}>
                  Cancel
                </button>
                <button
                  className="btn"
                  type="submit"
                  onClick={(e) => {
                    setIsTextAreaOpen(null)
                    submitComment(e)}}
                >
                  Submit!
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn "
              onClick={() => {
                toggleTextArea(comment?.id ?? -1);
                setCommentState({
                  ...commentState,
                  parent_id: comment?.id ?? null,
                });
              }}
            >
              {comment?.parent_id === null ? "Comment" : "Reply"}
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className=" md:w-1/2">
      <textarea
        onChange={(e) =>
          setCommentState({
            ...commentState,
            body: e.currentTarget.value,
          })
        }
        className="textarea textarea-bordered mb-4 w-full"
        placeholder="Comment Here"
      ></textarea>
      <div className="flex justify-between">
        <button
          className="btn"
          type="submit"
          onClick={(e) => {
            submitComment(e);
          }}
        >
          Submit!
        </button>
      </div>
      {renderComments(commentTree)}
    </div>
  );
};
export default CommentsSection;
