import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createComment, deleteComment, getComments, updateComment } from "../api/commentApi"

export const useComments = (id)=> {
  return useQuery({
    queryKey: ['posts', id, 'comments'],
    queryFn: ()=> getComments,
    enabled: !!id,
  });
}

export const useCreateComment = (postId)=> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => createComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] });
    },
  });
}

export const useUpdateComment = (postId, id)=> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data)=> updateComment(postId, id, data),
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["posts", id, "comments"]})        
  })
}

export const useDeleteComment = (postId, id)=> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ()=> deleteComment(postId, id),
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["posts", postId, "comments"]})        
  })
}