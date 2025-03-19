"use client"
import { ResumesProvider } from "./resumes-context"
import { PersonalInfoProvider } from "./personal-info-context"
import { JobInfoProvider } from "./job-info-context"
import { WorkExperienceProvider } from "./work-experience-context"
import { EducationProvider } from "./education-context"
import { SkillsProvider } from "./skills-context"
import { ProjectsProvider } from "./projects-context"
import { CertificationsProvider } from "./certifications-context"
import { CustomizationProvider } from "./customization-context"
import { MetadataProvider } from "./metadata-context"
import { AnalysisProvider } from "./analysis-context"
import { CustomSectionsProvider } from "./custom-sections-context"

export function ResumeProviders({ children, initialData = null }) {
  return (
    <ResumesProvider>
      <CustomSectionsProvider>
      <MetadataProvider initialData={initialData}>
        <CustomizationProvider initialData={initialData}>
          <JobInfoProvider initialData={initialData}>
            <PersonalInfoProvider initialData={initialData}>
              <WorkExperienceProvider initialData={initialData}>
                <EducationProvider initialData={initialData}>
                  <SkillsProvider initialData={initialData}>
                    <ProjectsProvider initialData={initialData}>
                      <CertificationsProvider initialData={initialData}>
                        <AnalysisProvider initialData={initialData}>{children}</AnalysisProvider>
                      </CertificationsProvider>
                    </ProjectsProvider>
                  </SkillsProvider>
                </EducationProvider>
              </WorkExperienceProvider>
            </PersonalInfoProvider>
          </JobInfoProvider>
        </CustomizationProvider>
      </MetadataProvider>
      </CustomSectionsProvider>
    </ResumesProvider>
  )
}

