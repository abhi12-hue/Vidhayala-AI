import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginUserMutation, useRegisterUserMutation , useCheckuserQuery } from "@/features/api/authApi";
import { Loader2, User, Mail, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function Login() {
  const navigate = useNavigate();
  const {refetch} = useCheckuserQuery();
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [signupInput, setSignupInput] = useState({ userName: "", email: "", password: "" });

  const [registerUser, { isLoading: registerLoading, isSuccess: registerSuccess }] = useRegisterUserMutation();
  const [loginUser, { isLoading: loginLoading, isSuccess: loginSuccess }] = useLoginUserMutation();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    type === "signup"
      ? setSignupInput((prev) => ({ ...prev, [name]: value }))
      : setLoginInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;
    try {
      await action(inputData);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (registerSuccess) {
      toast.success("Sign up successful!");
      refetch();
      navigate("/");
    }
    if (loginSuccess) {
      toast.success("Login successful!");
       refetch();
      navigate("/");
    }
  }, [registerSuccess, loginSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[400px]"
      >
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid grid-cols-2 border border-[#181A28]">
            <TabsTrigger value="signup">Signup</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          {/* Signup Form */}
          <TabsContent value="signup">
            <Card className="bg-black border border-white">
              <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>Signup to explore courses at affordable prices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="text-gray-400" />
                  <Input
                    name="userName"
                    placeholder="Username"
                    value={signupInput.userName}
                    onChange={(e) => changeInputHandler(e, "signup")}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="text-gray-400" />
                  <Input
                    name="email"
                    placeholder="Email"
                    value={signupInput.email}
                    onChange={(e) => changeInputHandler(e, "signup")}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signupInput.password}
                    onChange={(e) => changeInputHandler(e, "signup")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={registerLoading} onClick={() => handleSubmit("signup")}>
                  {registerLoading ? <Loader2 className="animate-spin" /> : "Signup"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Login Form */}
          <TabsContent value="login">
            <Card className="bg-black border border-white">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to explore your courses.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="text-gray-400" />
                  <Input
                    name="email"
                    placeholder="Email"
                    value={loginInput.email}
                    onChange={(e) => changeInputHandler(e, "login")}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="text-gray-400" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginInput.password}
                    onChange={(e) => changeInputHandler(e, "login")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={loginLoading} onClick={() => handleSubmit("login")}
                >
                  {loginLoading ? <Loader2 className="animate-spin" /> : "Login"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
