import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAuth } from "./AuthProvider";
import { FcGoogle } from "react-icons/fc";
import { userService } from "@/src/domains/user/service";
import { userRepository } from "@/src/domains/user/repository";
import { supabase } from "@/lib/supabaseClient";
import { UserRole } from "@/src/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import wbIcon from "@/assets/wbIcon.svg";
export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<UserRole>("student");
  const { id, role, signInWithGoogle } = useAuth();

  const selectRole = async (selectedRole: UserRole) => {
    try {
      if (!id) return;
      const { error } = await supabase
        .from("profiles")
        .update({ role: selectedRole })
        .eq("id", id);

      if (error) throw error;

      // Refresh user data after role update
      const newUserService = userService(userRepository(supabase));
      const { data: updatedUser, error: fetchError } =
        await newUserService.fetchUserInfo(id);

      if (fetchError) throw fetchError;

      // Force a page refresh to update the UI
      window.location.reload();
    } catch (error) {
      console.error("Error setting role:", error);
    }
  };

  useEffect(() => {
    if (id && !role) {
      selectRole(activeTab);
    }
  }, [id, role]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-lime-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex items-center justify-center">
          <img
            src={wbIcon}
            alt="Writing Buddy Logo"
            className="h-10 w-10 mr-2"
          />
          <h1 className="text-4xl font-bold">Writing Buddy</h1>
        </div>
        <p className="text-lime-700 mt-2 text-center">
          Your AI-powered writing assistant
        </p>

        <Card className="border-lime-100 shadow-lg bg-white mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to continue to your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as UserRole)}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 bg-lime-20 rounded-lg border border-lime-100 px-6">
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-lime-200 data-[state=active]:text-lime-900 data-[state=active]:shadow-sm rounded-md"
                >
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="teacher"
                  className="data-[state=active]:bg-lime-200 data-[state=active]:text-lime-900 data-[state=active]:shadow-sm rounded-md"
                >
                  Teacher
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-medium">Student Access</h2>
                    <p className="text-sm">
                      Get help with your writing assignments
                    </p>
                  </div>
                  <Button
                    onClick={signInWithGoogle}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-6 text-base font-medium border border-lime-200 hover:bg-lime-50 transition-colors rounded-lg"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign in with Google</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="teacher">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-medium">Teacher Access</h2>
                    <p className="text-sm">Create and manage assignments</p>
                  </div>
                  <Button
                    onClick={signInWithGoogle}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 py-6 text-base font-medium border border-lime-200 hover:bg-lime-50 transition-colors rounded-lg"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign in with Google</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-lime-700 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
