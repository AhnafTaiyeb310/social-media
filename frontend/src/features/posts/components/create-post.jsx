"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Image as ImageIcon, 
  Film, 
  Calendar, 
  Smile,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Tags,
  Globe,
  Settings
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createPost, updatePost, getCategories, getTags } from "../api/posts";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CreatePost({ postToEdit = null, onCancel = null }) {
  const isEditing = !!postToEdit;
  const { user } = useAuthStore();
  
  const [title, setTitle] = useState(postToEdit?.title || "");
  const [content, setContent] = useState(postToEdit?.content || "");
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || "");
  const [status, setStatus] = useState(postToEdit?.status || "published");
  const [visibility, setVisibility] = useState(postToEdit?.visibility || "public");
  const [categoryId, setCategoryId] = useState(postToEdit?.category || "");
  const [selectedTags, setSelectedTags] = useState(postToEdit?.tag_ids || []);
  const [scheduledFor, setScheduledFor] = useState(postToEdit?.scheduled_for ? new Date(postToEdit.scheduled_for).toISOString().slice(0, 16) : "");
  
  const [showAdvanced, setShowAdvanced] = useState(isEditing);
  
  // Multiple images support
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(isEditing && postToEdit.images ? postToEdit.images.map(img => img.image_url) : []);
  
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch categories and tags
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: tagsData } = useQuery({ queryKey: ["tags"], queryFn: getTags });

  const mutation = useMutation({
    mutationFn: isEditing ? (data) => updatePost({ id: postToEdit.id, data }) : createPost,
    onSuccess: () => {
      if (!isEditing) {
        resetForm();
      }
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
      if (onCancel) onCancel();
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setStatus("published");
    setVisibility("public");
    setCategoryId("");
    setSelectedTags([]);
    setScheduledFor("");
    setSelectedImages([]);
    setImagePreviews([]);
  };

  if (!user) return null;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handlePost = () => {
    if (!content.trim() && selectedImages.length === 0 && !title.trim()) return;

    const formData = new FormData();
    formData.append("title", title || content.slice(0, 50) || "Untitled Post");
    formData.append("content", content);
    formData.append("excerpt", excerpt);
    formData.append("status", status);
    formData.append("visibility", visibility);
    if (categoryId) formData.append("category", categoryId);
    if (scheduledFor) formData.append("scheduled_for", scheduledFor);
    
    selectedTags.forEach(tagId => {
      formData.append("tag_ids", tagId);
    });

    selectedImages.forEach(imageFile => {
      formData.append("uploaded_images", imageFile);
    });

    mutation.mutate(formData);
  };

  return (
    <Card className={cn(
        "overflow-hidden rounded-2xl border-none shadow-sm dark:bg-zinc-900 mb-6",
        isEditing && "ring-2 ring-blue-500/20 shadow-lg"
    )}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12 border-2 border-blue-500/10">
            <AvatarImage src={user.profile_picture_url} />
            <AvatarFallback className="bg-blue-600 text-white font-bold">
              {user.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post Title (Optional)"
                className="flex-1 bg-transparent text-xl font-bold outline-none placeholder:text-zinc-400 dark:text-white"
                />
                {isEditing && (
                    <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8 rounded-full text-zinc-400">
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`What's on your mind, ${user.username}?`}
              className="w-full resize-none bg-transparent text-lg outline-none placeholder:text-zinc-400 dark:text-white min-h-[120px]"
            ></textarea>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 aspect-video">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors"
            >
              <Settings className="h-3 w-3" />
              Advanced Options
              {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            {showAdvanced && (
              <div className="space-y-4 pt-2 border-t border-zinc-50 dark:border-zinc-800/50 animate-in fade-in slide-in-from-top-2 duration-300">
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Post Excerpt (Brief summary)"
                  className="w-full resize-none bg-transparent text-sm outline-none border-b border-zinc-100 dark:border-zinc-800 py-1 placeholder:text-zinc-500"
                ></textarea>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-500">Category</label>
                    <select 
                      value={categoryId} 
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2 text-sm outline-none border-none"
                    >
                      <option value="">Select Category</option>
                      {categories?.results?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-500">Visibility</label>
                    <select 
                      value={visibility} 
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2 text-sm outline-none border-none"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="password">Password Protected</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-500">Status</label>
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2 text-sm outline-none border-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {status === 'scheduled' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-zinc-500">Schedule For</label>
                      <input 
                        type="datetime-local" 
                        value={scheduledFor}
                        onChange={(e) => setScheduledFor(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-lg p-2 text-sm outline-none border-none"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 flex items-center gap-1">
                    <Tags className="h-3 w-3" /> Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tagsData?.results?.map(tag => (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-all",
                          selectedTags.includes(tag.id) 
                            ? "bg-blue-600 text-white" 
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                        )}
                      >
                        #{tag.tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div className="flex items-center gap-1 sm:gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 rounded-full text-blue-600 hover:bg-blue-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-semibold">Photos</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full text-purple-600 hover:bg-purple-50">
                  <Film className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-semibold">Video</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full text-orange-600 hover:bg-orange-50">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-semibold">Event</span>
                </Button>
              </div>
              
              <div className="flex gap-2">
                {isEditing && (
                    <Button 
                        variant="ghost" 
                        onClick={onCancel}
                        className="rounded-full px-6 text-zinc-500 hover:bg-zinc-50"
                    >
                        Cancel
                    </Button>
                )}
                <Button 
                    onClick={handlePost}
                    disabled={mutation.isPending || (!content.trim() && selectedImages.length === 0 && !title.trim())}
                    className="rounded-full bg-blue-600 px-6 hover:bg-blue-700 shadow-md shadow-blue-500/20 gap-2 disabled:opacity-50"
                >
                    {mutation.isPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                    <Send className="h-4 w-4" />
                    )}
                    <span>{mutation.isPending ? (isEditing ? "Updating..." : "Posting...") : (isEditing ? "Update" : "Post")}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
