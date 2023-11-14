"use client";
import { applyActionCode } from "firebase/auth";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "../../../firebase";
const Page = () => {
  const router = useRouter();
  const searchParams: any = useSearchParams();
  const actionCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  useEffect(() => {
    const handleVerifyEmail = async () => {
      applyActionCode(auth, actionCode)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.log("🚀 ~ error:", error);
        });
    };

    switch (mode) {
      case "resetPassword":
        router.push(`/reset-password?oobCode=${actionCode}`);
        break;

      case "recoverEmail":
        break;

      case "verifyEmail":
        handleVerifyEmail();
        break;

      default:
        false;
    }
  }, [actionCode, mode, router]);

  return (
    <>
      <div>
        <h1>Verify Email</h1>
      </div>
    </>
  );
};

export default Page;
