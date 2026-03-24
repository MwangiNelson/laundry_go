"use client";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useEffect } from "react";
import AuthSharedPageUI from "./auth_shared_page_ui";
import { Form } from "@/components/ui/form";
import { BasicInput } from "@/components/fields/inputs/basic_input";
import { PasswordInput } from "@/components/fields/inputs/password_input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/context/auth_provider";
import { useLoginWithEmail } from "@/api/auth/use_auth";
import { useRememberMe } from "@/api/auth/use_remember_me";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SigninPageUI = () => {
  const { mutateAsync: loginWithEmail, isPending } = useLoginWithEmail();
  const { getRememberedEmail } = useRememberMe();
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Pre-fill email if remembered
  // useEffect(() => {
  //   const rememberedEmail = getRememberedEmail();
  //   if (rememberedEmail) {
  //     form.setValue("email", rememberedEmail);
  //     form.setValue("rememberMe", true);
  //   }
  // }, [form, getRememberedEmail]);

  const rememberMe = useWatch({
    control: form.control,
    name: "rememberMe",
  });

  const onSubmit = (data: SignInFormValues) => {
    loginWithEmail({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    }).then(() => {
      router.push("/dashboard");
    });
  };

  return (
    <AuthSharedPageUI>
      <div className="flex flex-col gap-12 pt-6">
        <div className="flex flex-col gap-4">
          {/* Title Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold leading-tight text-title">
              Welcome Back
            </h1>
            <p className="text-sm leading-normal text-secondary">
              Sign in to your account
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-4">
                <BasicInput
                  name="email"
                  control={form.control}
                  label="Email Address"
                  placeholder="email@email.com"
                />
                <PasswordInput
                  name="password"
                  control={form.control}
                  label="Password"
                  placeholder="Set your password"
                />
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center gap-1.5">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        form.setValue("rememberMe", checked as boolean)
                      }
                      className="size-[18px] data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm leading-normal text-title cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div> */}
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm leading-normal text-link hover:underline"
                  >
                    Forgot Password
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3 h-auto text-sm font-normal"
                loading={isPending}
              >
                Sign In
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AuthSharedPageUI>
  );
};
