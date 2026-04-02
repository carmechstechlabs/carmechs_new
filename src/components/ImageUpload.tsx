import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/services/supabaseService";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onUpload?: (urls: string[]) => void;
  maxFiles?: number;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, onUpload, maxFiles = 1, label, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const url = await uploadImage(file) as string;
      
      if (onUpload) {
        const newUrls = [...urls, url];
        setUrls(newUrls);
        onUpload(newUrls);
      } else if (onChange) {
        onChange(url);
      }
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Make sure Supabase Storage is configured.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    if (onUpload) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      onUpload(newUrls);
    } else if (onChange) {
      onChange("");
    }
  };

  return (
    <div className={className}>
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{label}</label>}
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {onUpload ? (
            urls.map((url, index) => (
              <div key={index} className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
                <img src={url} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => removeImage(index)}
                    className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                  >
                    <X className="h-3 w-3 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : value ? (
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video col-span-full">
              <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                >
                  {isUploading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Upload className="h-3 w-3 mr-2" />}
                  Change
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => removeImage(0)}
                  disabled={isUploading}
                  className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                >
                  <X className="h-3 w-3 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : null}

          {(!onUpload || urls.length < maxFiles) && (!value || onUpload) && (
            <div 
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group aspect-square ${!onUpload && !value ? 'col-span-full aspect-video' : ''}`}
            >
              <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <ImageIcon className="h-5 w-5 text-slate-400" />}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-[#3b2c1f] uppercase tracking-tight">Upload Photo</p>
              </div>
            </div>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {!onUpload && (
          <div className="flex gap-2">
            <Input 
              value={value || ""} 
              onChange={(e) => onChange?.(e.target.value)}
              placeholder="Or enter image URL manually..."
              className="h-10 rounded-xl text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}
