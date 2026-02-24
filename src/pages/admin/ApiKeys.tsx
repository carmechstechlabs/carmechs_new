import { useState } from "react";
import { useData, ApiKeys } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Key } from "lucide-react";
import { toast } from "sonner";

export function ApiKeysPage() {
  const { apiKeys, updateApiKeys, adminRole } = useData();
  const [formData, setFormData] = useState<ApiKeys>(apiKeys);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to update API keys.");
      return;
    }
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateApiKeys(formData);
      toast.success("API Keys updated successfully");
    } catch (error) {
      toast.error("Failed to update API keys");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">API Keys Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Google Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Google Client ID</label>
              <Input 
                type="password"
                value={formData.googleClientId} 
                onChange={(e) => setFormData({...formData, googleClientId: e.target.value})}
                placeholder="Enter Google Client ID"
              />
              <p className="text-xs text-slate-500 mt-1">
                Required for Google Sign-In.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Firebase Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Firebase API Key</label>
              <Input 
                type="password"
                value={formData.firebaseApiKey} 
                onChange={(e) => setFormData({...formData, firebaseApiKey: e.target.value})}
                placeholder="Enter Firebase API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Auth Domain</label>
              <Input 
                value={formData.firebaseAuthDomain} 
                onChange={(e) => setFormData({...formData, firebaseAuthDomain: e.target.value})}
                placeholder="your-project.firebaseapp.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Project ID</label>
              <Input 
                value={formData.firebaseProjectId} 
                onChange={(e) => setFormData({...formData, firebaseProjectId: e.target.value})}
                placeholder="your-project-id"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Storage Bucket</label>
              <Input 
                value={formData.firebaseStorageBucket} 
                onChange={(e) => setFormData({...formData, firebaseStorageBucket: e.target.value})}
                placeholder="your-project.appspot.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Messaging Sender ID</label>
              <Input 
                value={formData.firebaseMessagingSenderId} 
                onChange={(e) => setFormData({...formData, firebaseMessagingSenderId: e.target.value})}
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">App ID</label>
              <Input 
                value={formData.firebaseAppId} 
                onChange={(e) => setFormData({...formData, firebaseAppId: e.target.value})}
                placeholder="1:1234567890:web:abcdef"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Required for Phone Number Verification and Firebase Auth.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave} disabled={isSaving || adminRole !== 'admin'}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
