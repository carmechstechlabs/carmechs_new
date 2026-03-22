import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateImage } from '@/services/geminiService';
import { Loader2, Image as ImageIcon, Download } from 'lucide-react';

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    try {
      const url = await generateImage(prompt);
      if (url) {
        setImageUrl(url);
      } else {
        setError("Failed to generate image. Check console for details.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-card rounded-[2.5rem] border border-border shadow-2xl space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-black uppercase tracking-tighter">AI Image Generator</h3>
        <p className="text-sm text-muted-foreground font-medium">Generate service-specific images for the catalog.</p>
      </div>

      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter image prompt (e.g., 'A professional car mechanic working on a car engine...')"
          className="w-full h-32 p-4 rounded-2xl border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium text-sm"
        />
        
        <Button 
          onClick={handleGenerate} 
          disabled={loading || !prompt}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
          {loading ? "Generating..." : "Generate Image"}
        </Button>
      </div>

      {error && <p className="text-xs text-destructive font-bold text-center">{error}</p>}

      {imageUrl && (
        <div className="space-y-4 pt-4">
          <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-lg">
            <img src={imageUrl} alt="Generated" className="w-full h-full object-cover" />
          </div>
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-border font-black uppercase tracking-widest text-[10px]"
            onClick={() => {
              const link = document.createElement('a');
              link.href = imageUrl;
              link.download = 'generated-image.png';
              link.click();
            }}
          >
            <Download className="h-3 w-3 mr-2" /> Download Image
          </Button>
        </div>
      )}
    </div>
  );
}
