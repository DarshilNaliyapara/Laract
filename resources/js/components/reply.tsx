import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";
import { router } from "@inertiajs/react";

interface ReplyProps {
    replies: {
        id: number;
        user_id: number;
        replies: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            avatar: string;
        };
    };
    authUserId?: number;
    postuserId: number;
}

export default function Reply({ replies, authUserId, postuserId }: ReplyProps) {
    const deleteReply = (id: number) => {
        router.post(route("comments.destroyreply", id), {}, { preserveScroll: true });
    };
    return (
        <div className="flex gap-3">
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={`/storage/${replies.user.avatar}`} alt={replies.user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {replies.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{replies.user.name}</p>
                    {postuserId === replies.user.id && <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 ml-2">
                        - author
                    </p>}
                </div> <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {dayjs(replies.created_at).fromNow()}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-300 mt-2 leading-relaxed">
                    {replies.replies}
                </p>
                {authUserId ? (
                    <>
                        {(authUserId === replies.user_id || route().current('blogs.adminshow')) && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-0.5 underline cursor-pointer" onClick={() => deleteReply(replies.id)}>
                                Delete
                            </p>
                        )}
                    </>
                ) : (<></>)}
            </div>
        </div>
    );
}
