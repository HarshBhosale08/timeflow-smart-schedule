
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings as SettingsIcon, Bell, Palette, Clock, Shield } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <Layout>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <SettingsIcon className="h-8 w-8 mr-3 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <form onSubmit={handleSaveSettings}>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure how you want to receive notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif" className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about appointment updates</p>
                    </div>
                    <Switch id="email-notif" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notif" className="font-medium">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                    </div>
                    <Switch id="sms-notif" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reminders" className="font-medium">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get reminders before your scheduled appointments</p>
                    </div>
                    <Switch id="reminders" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compact-view" className="font-medium">Compact View</Label>
                      <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
                    </div>
                    <Switch id="compact-view" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy
                  </CardTitle>
                  <CardDescription>
                    Manage your privacy and security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor" className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-sharing" className="font-medium">Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">Allow us to use your data to improve services</p>
                    </div>
                    <Switch id="data-sharing" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit">Save All Settings</Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
