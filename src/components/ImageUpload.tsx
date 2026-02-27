import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={className}>
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{label}</label>}
      
      <div className="space-y-4">
        {value ? (
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <img src={value} alt="Uploaded" className="w-full h-40 object-cover" />
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
                onClick={() => onChange("")}
                disabled={isUploading}
                className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                <X className="h-3 w-3 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : <ImageIcon className="h-6 w-6 text-slate-400" />}
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-[#3b2c1f] uppercase tracking-tight">Click to upload image</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        <div className="flex gap-2">
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or enter image URL manually..."
            className="h-10 rounded-xl text-xs"
          />
        </div>
      </div>
    </div>
  );
}
