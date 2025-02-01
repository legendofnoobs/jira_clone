import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]['$delete'], 200>;
type RequestType = InferRequestType<
    (typeof client.api.projects)[":projectId"]["$delete"]
>;

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.projects[":projectId"]["$delete"]({
                param
            });

            if (!response.ok) {
                throw new Error("failed to delete project");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            toast.success("project deleted");
            queryClient.invalidateQueries({ queryKey: ["project", data?.$id] });
        },
        onError: () => {
            toast.error("failed to delete project");
        }
    });

    return mutation;
}