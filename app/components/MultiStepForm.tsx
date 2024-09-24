"use client";

import { useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { PlusCircle, Trash2 } from "lucide-react";

const steps = [
  { name: "Personal Information", required: ["fullName", "email"] },
  { name: "Career Objective", required: ["careerObjective"] },
  { name: "Education", required: [] },
  { name: "Work Experience", required: [] },
  { name: "Skills", required: [] },
  { name: "Certifications & Courses", required: [] },
  { name: "Projects", required: [] },
  { name: "Volunteer Experience", required: [] },
  { name: "Awards & Honors", required: [] },
  { name: "Interests/Hobbies", required: [] },
  { name: "References", required: [] },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "", // Added default value
    email: "", // Added default value
    phone: "", // Added default value
    address: "", // Added default value
    linkedin: "", // Added default value
    careerObjective: "", // Added default value
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        graduationDate: "",
        honors: "",
      },
    ], // Default for education section
    workExperience: [
      {
        jobTitle: "",
        companyName: "",
        employmentDates: "",
        responsibilities: "",
        achievements: "",
        location: "",
      },
    ], // Default for work experience section
    skills: [{ skillName: "", skillLevel: "" }], // Default for skills section
    certifications: [
      { certificationName: "", issuingOrganization: "", dateEarned: "" },
    ], // Default for certifications section
    projects: [
      {
        projectName: "",
        projectDescription: "",
        keyTechnologies: "",
        projectDuration: "",
      },
    ], // Default for projects section
    volunteerExperience: [
      {
        volunteerOrg: "",
        volunteerRole: "",
        volunteerDuration: "",
        volunteerResponsibilities: "",
      },
    ], // Default for volunteer experience section
    awards: [{ awardName: "", awardOrg: "", dateReceived: "" }], // Default for awards section
    references: [
      {
        refereeName: "",
        refereeJobTitle: "",
        refereeCompany: "",
        refereeContact: "",
      },
    ], // Default for references section
    interests: "", // Added default value
  });
  type Section = keyof typeof formData;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    index: number | null = null,
    section: Section | null = null
  ) => {
    const { name, value } = e.target;
    if (section && index !== null) {
      setFormData((prev) => {
        if (Array.isArray(prev[section])) {
          const updatedSection = prev[section].map((item: any, i: number) =>
            i === index ? { ...item, [name]: value } : item
          );
          return { ...prev, [section]: updatedSection };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addItem = (section: Section) => {
    setFormData((prev) => {
      if (Array.isArray(prev[section])) {
        const updatedSection = [...prev[section], {}];
        return { ...prev, [section]: updatedSection };
      }
      return prev;
    });
  };

  const removeItem = (section: Section, index: number) => {
    setFormData((prev) => {
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: prev[section].filter((_: any, i: number) => i !== index),
        };
      }
      return prev;
    });
  };

  const isStepComplete = (step: { name?: string; required: any }) => {
    return step.required.every((field: Section) => {
      if (Array.isArray(formData[field])) {
        return formData[field].every((item) => item.trim() !== "");
      }
      return formData[field] && formData[field].trim() !== "";
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName || ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                onChange={handleInputChange}
                value={formData.phone || ""}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={handleInputChange}
                value={formData.email || ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                onChange={handleInputChange}
                value={formData.address || ""}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                onChange={handleInputChange}
                value={formData.linkedin || ""}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <Label htmlFor="careerObjective">Career Objective *</Label>
            <Textarea
              id="careerObjective"
              name="careerObjective"
              onChange={handleInputChange}
              value={formData.careerObjective || ""}
              className="h-32"
              required
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            {formData.education.map((edu, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`school-${index}`}>
                    School/University Name
                  </Label>
                  <Input
                    id={`school-${index}`}
                    name="school"
                    onChange={(e) => handleInputChange(e, index, "education")}
                    value={edu.school || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`degree-${index}`}>Degree</Label>
                  <Input
                    id={`degree-${index}`}
                    name="degree"
                    onChange={(e) => handleInputChange(e, index, "education")}
                    value={edu.degree || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`fieldOfStudy-${index}`}>
                    Field of Study
                  </Label>
                  <Input
                    id={`fieldOfStudy-${index}`}
                    name="fieldOfStudy"
                    onChange={(e) => handleInputChange(e, index, "education")}
                    value={edu.fieldOfStudy || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`graduationDate-${index}`}>
                    Graduation Date
                  </Label>
                  <Input
                    id={`graduationDate-${index}`}
                    name="graduationDate"
                    type="date"
                    onChange={(e) => handleInputChange(e, index, "education")}
                    value={edu.graduationDate || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`honors-${index}`}>Honors, Awards</Label>
                  <Input
                    id={`honors-${index}`}
                    name="honors"
                    onChange={(e) => handleInputChange(e, index, "education")}
                    value={edu.honors || ""}
                  />
                </div>
                <Button
                  className="destructive"
                  size="sm"
                  onClick={() => removeItem("education", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Education
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("education")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                  <Input
                    id={`jobTitle-${index}`}
                    name="jobTitle"
                    onChange={(e) =>
                      handleInputChange(e, index, "workExperience")
                    }
                    value={exp.jobTitle || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`companyName-${index}`}>Company Name</Label>
                  <Input
                    id={`companyName-${index}`}
                    name="companyName"
                    onChange={(e) =>
                      handleInputChange(e, index, "workExperience")
                    }
                    value={exp.companyName || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`employmentDates-${index}`}>
                    Employment Dates
                  </Label>
                  <Input
                    id={`employmentDates-${index}`}
                    name="employmentDates"
                    onChange={(e) =>
                      handleInputChange(e, index, "workExperience")
                    }
                    value={exp.employmentDates || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`responsibilities-${index}`}>
                    Key Responsibilities
                  </Label>
                  <Textarea
                    id={`responsibilities-${index}`}
                    name="responsibilities"
                    onChange={(e) =>
                      handleInputChange(e, index, "workExperience")
                    }
                    value={exp.responsibilities || ""}
                    className="h-24"
                  />
                </div>
                <div>
                  <Label htmlFor={`achievements-${index}`}>
                    Achievements/Impact
                  </Label>
                  <Textarea
                    id={`achievements-${index}`}
                    name="achievements"
                    onChange={(e) =>
                      handleInputChange(e, index, "workExperience")
                    }
                    value={exp.achievements || ""}
                    className="h-24"
                  />
                </div>
                <div>
                  <Label htmlFor={`location-${index}`}>
                    Location (optional)
                  </Label>
                  <Input
                    id={`location-${index}`}
                    name="location"
                    onChange={(e) =>
                      handleInputChange(e, index, "workExperience")
                    }
                    value={exp.location || ""}
                  />
                </div>
                <Button
                  className="destructive"
                  size="sm"
                  onClick={() => removeItem("workExperience", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Experience
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("workExperience")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Work Experience
            </Button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`skillName-${index}`}>Skill Name</Label>
                  <Input
                    id={`skillName-${index}`}
                    name="skillName"
                    onChange={(e) => handleInputChange(e, index, "skills")}
                    value={skill.skillName || ""}
                  />
                </div>
                <div>
                  <Label>Skill Level</Label>
                  <RadioGroup
                    onValueChange={(value) =>
                      handleInputChange(
                        {
                          target: {
                            name: "skillLevel",
                            value: value.toString(),
                          },
                        } as ChangeEvent<HTMLInputElement>,
                        index,
                        "skills"
                      )
                    }
                    value={skill.skillLevel || ""}
                    className="flex space-x-2"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={level.toString()}
                          id={`level-${index}-${level}`}
                        />
                        <Label htmlFor={`level-${index}-${level}`}>
                          {level}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <Button
                  className="destructive"
                  size="sm"
                  onClick={() => removeItem("skills", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Skill
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("skills")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`certificationName-${index}`}>
                    Certification/Course Name
                  </Label>
                  <Input
                    id={`certificationName-${index}`}
                    name="certificationName"
                    onChange={(e) =>
                      handleInputChange(e, index, "certifications")
                    }
                    value={cert.certificationName || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`issuingOrganization-${index}`}>
                    Issuing Organization
                  </Label>
                  <Input
                    id={`issuingOrganization-${index}`}
                    name="issuingOrganization"
                    onChange={(e) =>
                      handleInputChange(e, index, "certifications")
                    }
                    value={cert.issuingOrganization || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`dateEarned-${index}`}>Date Earned</Label>
                  <Input
                    id={`dateEarned-${index}`}
                    name="dateEarned"
                    type="date"
                    onChange={(e) =>
                      handleInputChange(e, index, "certifications")
                    }
                    value={cert.dateEarned || ""}
                  />
                </div>
                <Button
                  className="bg-red-500"
                  size="sm"
                  onClick={() => removeItem("certifications", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Certification
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("certifications")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            {formData.projects.map((project, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`projectName-${index}`}>Project Name</Label>
                  <Input
                    id={`projectName-${index}`}
                    name="projectName"
                    onChange={(e) => handleInputChange(e, index, "projects")}
                    value={project.projectName || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`projectDescription-${index}`}>
                    Description
                  </Label>
                  <Textarea
                    id={`projectDescription-${index}`}
                    name="projectDescription"
                    onChange={(e) => handleInputChange(e, index, "projects")}
                    value={project.projectDescription || ""}
                    className="h-24"
                  />
                </div>
                <div>
                  <Label htmlFor={`keyTechnologies-${index}`}>
                    Key Technologies Used
                  </Label>
                  <Input
                    id={`keyTechnologies-${index}`}
                    name="keyTechnologies"
                    onChange={(e) => handleInputChange(e, index, "projects")}
                    value={project.keyTechnologies || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`projectDuration-${index}`}>Duration</Label>
                  <Input
                    id={`projectDuration-${index}`}
                    name="projectDuration"
                    onChange={(e) => handleInputChange(e, index, "projects")}
                    value={project.projectDuration || ""}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem("projects", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Project
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("projects")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            {formData.volunteerExperience.map((exp, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`volunteerOrg-${index}`}>
                    Organization Name
                  </Label>
                  <Input
                    id={`volunteerOrg-${index}`}
                    name="volunteerOrg"
                    onChange={(e) =>
                      handleInputChange(e, index, "volunteerExperience")
                    }
                    value={exp.volunteerOrg || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`volunteerRole-${index}`}>Role</Label>
                  <Input
                    id={`volunteerRole-${index}`}
                    name="volunteerRole"
                    onChange={(e) =>
                      handleInputChange(e, index, "volunteerExperience")
                    }
                    value={exp.volunteerRole || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`volunteerDuration-${index}`}>Duration</Label>
                  <Input
                    id={`volunteerDuration-${index}`}
                    name="volunteerDuration"
                    onChange={(e) =>
                      handleInputChange(e, index, "volunteerExperience")
                    }
                    value={exp.volunteerDuration || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`volunteerResponsibilities-${index}`}>
                    Responsibilities
                  </Label>
                  <Textarea
                    id={`volunteerResponsibilities-${index}`}
                    name="volunteerResponsibilities"
                    onChange={(e) =>
                      handleInputChange(e, index, "volunteerExperience")
                    }
                    value={exp.volunteerResponsibilities || ""}
                    className="h-24"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem("volunteerExperience", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Volunteer Experience
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("volunteerExperience")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Volunteer Experience
            </Button>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            {formData.awards.map((award, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`awardName-${index}`}>Award Name</Label>
                  <Input
                    id={`awardName-${index}`}
                    name="awardName"
                    onChange={(e) => handleInputChange(e, index, "awards")}
                    value={award.awardName || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`awardOrg-${index}`}>
                    Issuing Organization
                  </Label>
                  <Input
                    id={`awardOrg-${index}`}
                    name="awardOrg"
                    onChange={(e) => handleInputChange(e, index, "awards")}
                    value={award.awardOrg || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`dateReceived-${index}`}>Date Received</Label>
                  <Input
                    id={`dateReceived-${index}`}
                    name="dateReceived"
                    type="date"
                    onChange={(e) => handleInputChange(e, index, "awards")}
                    value={award.dateReceived || ""}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeItem("awards", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Award
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("awards")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Award
            </Button>
          </div>
        );
      case 9:
        return (
          <div>
            <Label htmlFor="interests">Interests/Hobbies</Label>
            <Textarea
              id="interests"
              name="interests"
              onChange={handleInputChange}
              value={formData.interests || ""}
              className="h-24"
              placeholder="List your interests or hobbies"
            />
          </div>
        );
      case 10:
        return (
          <div className="space-y-4">
            {formData.references.map((ref, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div>
                  <Label htmlFor={`refereeName-${index}`}>Referee Name</Label>
                  <Input
                    id={`refereeName-${index}`}
                    name="refereeName"
                    onChange={(e) => handleInputChange(e, index, "references")}
                    value={ref.refereeName || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`refereeJobTitle-${index}`}>Job Title</Label>
                  <Input
                    id={`refereeJobTitle-${index}`}
                    name="refereeJobTitle"
                    onChange={(e) => handleInputChange(e, index, "references")}
                    value={ref.refereeJobTitle || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`refereeCompany-${index}`}>Company</Label>
                  <Input
                    id={`refereeCompany-${index}`}
                    name="refereeCompany"
                    onChange={(e) => handleInputChange(e, index, "references")}
                    value={ref.refereeCompany || ""}
                  />
                </div>
                <div>
                  <Label htmlFor={`refereeContact-${index}`}>
                    Contact Information
                  </Label>
                  <Input
                    id={`refereeContact-${index}`}
                    name="refereeContact"
                    onChange={(e) => handleInputChange(e, index, "references")}
                    value={ref.refereeContact || ""}
                  />
                </div>
                <Button
                  className="destructive"
                  size="sm"
                  onClick={() => removeItem("references", index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Reference
                </Button>
              </div>
            ))}
            <Button onClick={() => addItem("references")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reference
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Multi-Step Form</h1>
      <div className="mb-6">
        <div className="flex flex-wrap justify-between mb-2">
          {steps.map((step, index) => (
            <Button
              key={index}
              className={`mb-2 ${
                isStepComplete(step) ? "bg-green-500 hover:bg-green-600" : ""
              } ${index === currentStep ? "text-white bg-green-900" : ""}`}
              onClick={() => isStepComplete(step) && setCurrentStep(index)}
              disabled={!isStepComplete(step)}
            >
              {index + 1}. {step.name}
            </Button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-between">
        <Button onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}>
          Previous
        </Button>
        <Button
          onClick={() => {
            if (currentStep === steps.length - 1) {
              console.log(formData);
            }
            setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
          }}
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}