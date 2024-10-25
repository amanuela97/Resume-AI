"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { PlusCircle, Trash2, Upload } from "lucide-react";
import { Section, ResumeInfo, Step } from "@/app/utils/types";
import { useAppStore } from "../store";
import { toast } from "react-toastify";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const steps = [
  { name: "Personal Information", required: ["fullName", "email"] },
  { name: "Career Objective", required: ["careerObjective"] },
  {
    field: "education",
    name: "Education",
    required: ["school", "degree", "fieldOfStudy", "graduationDate", "honors"],
  },
  {
    field: "workExperience",
    name: "Work Experience",
    required: [
      "jobTitle",
      "companyName",
      "employmentDates",
      "responsibilities",
      "achievements",
      "location",
    ],
  },
  { field: "skills", name: "Skills", required: ["skillName", "skillLevel"] },
  {
    field: "certifications",
    name: "Certifications & Courses",
    required: [
      "certificationName",
      "certificationDate",
      "certificationAuthority",
    ],
  },
  {
    name: "Projects",
    required: [
      "projectName",
      "projectDescription",
      "projectDates",
      "projectRole",
      "projectAchievements",
    ],
  },
  {
    field: "volunteerExperience",
    name: "Volunteer Experience",
    required: [
      "volunteerOrganization",
      "volunteerDates",
      "volunteerAchievements",
    ],
  },
  {
    field: "awards",
    name: "Awards & Honors",
    required: ["awardName", "awardDate", "awardAuthority"],
  },
  { name: "Interests/Hobbies", required: [] },
  {
    name: "References",
    required: [
      "referenceName",
      "referencePosition",
      "referenceCompany",
      "referenceEmail",
    ],
  },
];

type DraggableExperienceItemProps = {
  index: number;
  moveItem: (fromIndex: number, toIndex: number, section: Section) => void;
  children: React.ReactNode;
};

// Add this new component for draggable items
const DraggableExperienceItem = ({
  index,
  moveItem,
  children,
}: DraggableExperienceItemProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "experience",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "experience",
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveItem(item.index, index, "workExperience");
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) {
          drag(drop(node));
        }
      }}
      className={`border border-black dark:border-white p-4 rounded-md space-y-4 hover:cursor-grab active:cursor-grabbing transition-colors ease-in-out duration-300 ${
        isDragging ? "opacity-80 bg-card" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
};

export default function MultiStepForm({ onSubmit }: { onSubmit: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const { resumeInfo, setResumeInfo } = useAppStore(); // Use global state
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCachedData = async () => {
      const retrievedResume = localStorage.getItem("resumeInfo");
      if (retrievedResume) {
        setShowButtons(true);
      }
    };
    loadCachedData();
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    index: number | null = null,
    section: Section | null = null
  ) => {
    const { name, value } = e.target;
    if (section && index !== null) {
      if (Array.isArray(resumeInfo[section])) {
        const updatedSection = resumeInfo[section].map((item: any, i: number) =>
          i === index ? { ...item, [name]: value } : item
        );
        setResumeInfo({ ...resumeInfo, [section]: updatedSection });
      } else {
        setResumeInfo(resumeInfo);
      }
    } else {
      setResumeInfo({ ...resumeInfo, [name]: value });
    }
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "image/png" || file.type === "image/jpeg") {
        setResumeInfo({ ...resumeInfo, profileImage: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a PNG or JPG image.");
      }
    }
  };

  const addItem = (section: Section) => {
    if (Array.isArray(resumeInfo[section])) {
      const updatedSection = [...resumeInfo[section], {}];
      setResumeInfo({ ...resumeInfo, [section]: updatedSection });
    } else {
      setResumeInfo(resumeInfo);
    }
  };

  const removeItem = (section: Section, index: number) => {
    if (Array.isArray(resumeInfo[section])) {
      setResumeInfo({
        ...resumeInfo,
        [section]: resumeInfo[section].filter(
          (_: any, i: number) => i !== index
        ),
      });
    } else {
      setResumeInfo(resumeInfo);
    }
  };

  const isStepComplete = (step: Step) => {
    // If the step is related to a specific field (like arrays)
    if (step.field && Array.isArray(resumeInfo[step.field])) {
      const fieldArray = resumeInfo[step.field] as any[]; // Casting since TypeScript won't infer correctly here
      // Ensure array is not empty, and every item in the array has all required fields filled
      return (
        fieldArray.length === 0 ||
        fieldArray.every((item) => {
          return step.required.every((fieldName) => {
            // Check that each required field in the item is non-empty
            return typeof item[fieldName] === "string"
              ? item[fieldName].trim() !== ""
              : item[fieldName] !== null && item[fieldName] !== undefined;
          });
        })
      );
    }
    // For string or file type fields
    return step.required.every((fieldName: string) => {
      const value = resumeInfo[fieldName as keyof ResumeInfo];
      if (typeof value === "string") {
        return value.trim() !== "";
      } else if (value instanceof File) {
        return value !== null;
      }
      return true;
    });
  };

  const canProceed = () => {
    const currentStepInfo = steps[currentStep] as Step;
    return isStepComplete(currentStepInfo);
  };

  const canSkipStep = () => {
    return steps.every((step) => {
      return isStepComplete(step as Step);
    });
  };

  const handleOnSubmit = async () => {
    localStorage.setItem(
      "resumeInfo",
      JSON.stringify({
        ...resumeInfo,
        profileImage: null,
      })
    );
    onSubmit();
  };

  const autofillForm = () => {
    const storedData = localStorage.getItem("resumeInfo");
    if (storedData) {
      const parsedResumeInfo: ResumeInfo = JSON.parse(storedData);
      setResumeInfo(parsedResumeInfo);
    }
  };

  const clearStoredData = () => {
    localStorage.removeItem("resumeInfo");
    setShowButtons(false);
  };

  const moveItem = (fromIndex: number, toIndex: number, section: Section) => {
    const newItems = Array.isArray(resumeInfo[section])
      ? [...resumeInfo[section]]
      : [];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setResumeInfo({ ...resumeInfo, [section]: newItems } as ResumeInfo);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".png,.jpg,.jpeg"
                onChange={handleImageChange}
              />
              <Label htmlFor="profileImage" className="mt-2">
                Profile Image (PNG or JPG)
              </Label>
            </div>
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                onChange={handleInputChange}
                value={resumeInfo.fullName || ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                onChange={handleInputChange}
                value={resumeInfo.phone || ""}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={handleInputChange}
                value={resumeInfo.email || ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                onChange={handleInputChange}
                value={resumeInfo.address || ""}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                name="linkedin"
                onChange={handleInputChange}
                value={resumeInfo.linkedin || ""}
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
              value={resumeInfo.careerObjective || ""}
              className="h-32"
              required
            />
          </div>
        );
      case 2:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.education.map((edu, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "education")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
                    <div>
                      <Label htmlFor={`school-${index}`}>
                        School/University Name
                      </Label>
                      <Input
                        id={`school-${index}`}
                        name="school"
                        onChange={(e) =>
                          handleInputChange(e, index, "education")
                        }
                        value={edu.school || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        name="degree"
                        onChange={(e) =>
                          handleInputChange(e, index, "education")
                        }
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
                        onChange={(e) =>
                          handleInputChange(e, index, "education")
                        }
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
                        onChange={(e) =>
                          handleInputChange(e, index, "education")
                        }
                        value={edu.graduationDate || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`honors-${index}`}>Honors, Awards</Label>
                      <Input
                        id={`honors-${index}`}
                        name="honors"
                        onChange={(e) =>
                          handleInputChange(e, index, "education")
                        }
                        value={edu.honors || ""}
                      />
                    </div>
                    <Button
                      className="bg-red-500"
                      size="sm"
                      onClick={() => removeItem("education", index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Education
                    </Button>
                  </div>
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("education")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
          </DndProvider>
        );
      case 3:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.workExperience.map((exp, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "workExperience")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
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
                      <Label htmlFor={`companyName-${index}`}>
                        Company Name
                      </Label>
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
                      className="bg-red-500"
                      size="sm"
                      onClick={() => removeItem("workExperience", index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Experience
                    </Button>
                  </div>
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("workExperience")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Work Experience
              </Button>
            </div>
          </DndProvider>
        );
      case 4:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.skills.map((skill, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "skills")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
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
                          <div
                            key={level}
                            className="flex items-center space-x-2"
                          >
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
                      className="bg-red-500"
                      size="sm"
                      onClick={() => removeItem("skills", index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Skill
                    </Button>
                  </div>
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("skills")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </DndProvider>
        );
      case 5:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.certifications.map((cert, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "certifications")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
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
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("certifications")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </div>
          </DndProvider>
        );
      case 6:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.projects.map((project, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "projects")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
                    <div>
                      <Label htmlFor={`projectName-${index}`}>
                        Project Name
                      </Label>
                      <Input
                        id={`projectName-${index}`}
                        name="projectName"
                        onChange={(e) =>
                          handleInputChange(e, index, "projects")
                        }
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
                        onChange={(e) =>
                          handleInputChange(e, index, "projects")
                        }
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
                        onChange={(e) =>
                          handleInputChange(e, index, "projects")
                        }
                        value={project.keyTechnologies || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`projectDuration-${index}`}>
                        Duration
                      </Label>
                      <Input
                        id={`projectDuration-${index}`}
                        name="projectDuration"
                        onChange={(e) =>
                          handleInputChange(e, index, "projects")
                        }
                        value={project.projectDuration || ""}
                      />
                    </div>
                    <Button
                      className="bg-red-500"
                      size="sm"
                      onClick={() => removeItem("projects", index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Project
                    </Button>
                  </div>
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("projects")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
          </DndProvider>
        );
      case 7:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.volunteerExperience.map((exp, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "volunteerExperience")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
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
                      <Label htmlFor={`volunteerDuration-${index}`}>
                        Duration
                      </Label>
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
                      className="bg-red-500"
                      size="sm"
                      onClick={() => removeItem("volunteerExperience", index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Volunteer Experience
                    </Button>
                  </div>
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("volunteerExperience")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Volunteer Experience
              </Button>
            </div>
          </DndProvider>
        );
      case 8:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.awards.map((award, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "awards")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
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
                      <Label htmlFor={`dateReceived-${index}`}>
                        Date Received
                      </Label>
                      <Input
                        id={`dateReceived-${index}`}
                        name="dateReceived"
                        type="date"
                        onChange={(e) => handleInputChange(e, index, "awards")}
                        value={award.dateReceived || ""}
                      />
                    </div>
                    <Button
                      className="bg-red-500"
                      size="sm"
                      onClick={() => removeItem("awards", index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Award
                    </Button>
                  </div>
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("awards")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Award
              </Button>
            </div>
          </DndProvider>
        );
      case 9:
        return (
          <div>
            <Label htmlFor="interests">Interests/Hobbies</Label>
            <Textarea
              id="interests"
              name="interests"
              onChange={handleInputChange}
              value={resumeInfo.interests || ""}
              className="h-24"
              placeholder="List your interests or hobbies as comma-separated like gym, running etc..."
            />
          </div>
        );
      case 10:
        return (
          <DndProvider backend={HTML5Backend}>
            <div className="space-y-4">
              {resumeInfo.references.map((ref, index) => (
                <DraggableExperienceItem
                  key={index}
                  index={index}
                  moveItem={(fromIndex, toIndex) =>
                    moveItem(fromIndex, toIndex, "references")
                  }
                >
                  <div key={index} className="p-4  rounded-md space-y-4">
                    <div>
                      <Label htmlFor={`refereeName-${index}`}>
                        Referee Name
                      </Label>
                      <Input
                        id={`refereeName-${index}`}
                        name="refereeName"
                        onChange={(e) =>
                          handleInputChange(e, index, "references")
                        }
                        value={ref.refereeName || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`refereeJobTitle-${index}`}>
                        Job Title
                      </Label>
                      <Input
                        id={`refereeJobTitle-${index}`}
                        name="refereeJobTitle"
                        onChange={(e) =>
                          handleInputChange(e, index, "references")
                        }
                        value={ref.refereeJobTitle || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`refereeCompany-${index}`}>Company</Label>
                      <Input
                        id={`refereeCompany-${index}`}
                        name="refereeCompany"
                        onChange={(e) =>
                          handleInputChange(e, index, "references")
                        }
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
                        onChange={(e) =>
                          handleInputChange(e, index, "references")
                        }
                        value={ref.refereeContact || ""}
                      />
                    </div>
                    <Button
                      className="bg-red-500"
                      size="sm"
                      onClick={() => removeItem("references", index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Reference
                    </Button>
                  </div>
                </DraggableExperienceItem>
              ))}
              <Button
                className="bg-green-500"
                onClick={() => addItem("references")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Reference
              </Button>
            </div>
          </DndProvider>
        );
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Multi-Step Form</h1>
          {showButtons && (
            <div className="space-x-2 space-y-2 md:space-y-0">
              <Button onClick={autofillForm} className="bg-blue-500">
                Autofill Form
              </Button>
              <Button className="bg-red-500" onClick={clearStoredData}>
                Clear Stored Data
              </Button>
            </div>
          )}
        </div>
        <div className="mb-6">
          <div className="flex flex-wrap justify-between mb-2 p-2">
            {steps.map((step, index) => (
              <Button
                key={index}
                className={`mb-2 ${
                  isStepComplete(step as Step)
                    ? "bg-card-foreground hover:bg-card"
                    : ""
                } ${
                  index === currentStep
                    ? "text-white bg-green-500 hover:bg-green-800"
                    : ""
                }`}
                onClick={() => canSkipStep() && setCurrentStep(index)}
                disabled={!canSkipStep() && index !== currentStep}
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
          <Button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentStep === steps.length - 1) {
                handleOnSubmit();
              } else {
                setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
              }
            }}
            disabled={!canProceed()}
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </DndProvider>
  );
}
