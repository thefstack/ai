// src/app/Providers.js

"use client";  // This component is a Client Component

import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { QuizProvider } from "@/context/QuizContext";
import { SessionProvider } from "next-auth/react";
import { LessonProvider } from "./LessonContext";
import { SkillupProvider } from "./SkillContext";
import { ResumeProviders } from "@/context/resume/resume-providers" // Updated import path




export default function Providers({ children }) {

  return (
    <SessionProvider>
      <AuthProvider>
        <UserProvider>
          <QuizProvider>
            <LessonProvider>
              <SkillupProvider>
                <ResumeProviders>
                  {children}
                </ResumeProviders>
              </SkillupProvider>
            </LessonProvider>
          </QuizProvider>
        </UserProvider>
      </AuthProvider>
    </SessionProvider>
  );
}