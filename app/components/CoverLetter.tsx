import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, saveCoverLetterToFirestore } from "@/app/utils/firebase"; // Assuming you have a firebase setup
import { useAppStore } from "../store";
import { Modal } from "./ui/modal";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import DownloadButton from "./DownloadButton";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { ContentType, CoverLetter as CoverLetterType } from "../utils/types";
import { deleteDoc, doc } from "firebase/firestore";
import { FaTrash } from "react-icons/fa";
import { usePathname } from "next/navigation";

const CoverLetterComponent: React.FC = () => {
  const pathname = usePathname();
  const {
    user,
    coverLetter,
    coverLetters,
    setCoverLetters,
    deleteCoverLetter,
  } = useAppStore();
  const [title, setTitle] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (coverLetter) {
      setIsVisible(true);
    }
  }, [coverLetter]);

  const handleSaveCoverLetter = async () => {
    if (title.trim() === "") {
      toast.info("Please provide a name for the coverLetter.");
      return;
    } else if (!user?.uid || !coverLetter) {
      console.error("no userID found");
      toast.info("Unable to create coverLetter.");
      return;
    } else if (!coverLetter) {
      console.error("coverLetter is undefined");
      toast.info("Unable to create coverLetter.");
      return;
    }

    try {
      const newCoverLetter = {
        ...coverLetter,
        title,
        userId: user?.uid,
        id: uuidv4(),
      };
      await saveCoverLetterToFirestore(newCoverLetter);
      toast.success("Cover letter saved successfully!");
      setCoverLetters([...coverLetters, newCoverLetter]);
    } catch (error) {
      console.error("Error saving cover letter:", error);
      toast.error("Failed to save cover letter.");
    } finally {
      setIsModalOpen(false);
      setTitle(""); // Clear the input
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "coverLetters", id));
      deleteCoverLetter(id);
      toast.success(`Deleted cover letter successfully!`);
    } catch (error) {
      console.error("Error deleting cover letter:", error);
      toast.error("Error deleting cover letter");
    }
  };

  return (
    <Card
      className={`mt-8 bg-card shadow-lg transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <CardHeader className="bg-primary-light mb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-primary font-bold">Cover Letter</CardTitle>
        <div className="flex items-center">
          <DownloadButton contentType={ContentType.coverLetter} />{" "}
          {/* Add the DownloadButton here */}
          <Button onClick={() => setIsModalOpen(true)} className="bg-accent">
            Save Cover Letter
          </Button>
          {pathname !== "/create" && (
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (coverLetter && coverLetter.id) {
                  handleDelete(coverLetter.id);
                }
              }}
            >
              <FaTrash className="w-4 h-4 text-neutral" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="text-card-foreground">
        {coverLetter && (
          <div>
            <h2 className="text-lg font-bold mb-2">Introduction</h2>
            <p className="mb-4">{coverLetter.introduction}</p>
            <h2 className="text-lg font-bold mb-2">Body</h2>
            <p className="mb-2">
              <strong>Relevant Experience:</strong>{" "}
              {coverLetter.body.relevant_experience}
            </p>
            <p className="mb-2">
              <strong>Skills Match:</strong> {coverLetter.body.skills_match}
            </p>
            <p className="mb-2">
              <strong>Cultural Fit:</strong> {coverLetter.body.cultural_fit}
            </p>
            <p className="mb-4">
              <strong>Motivation:</strong> {coverLetter.body.motivation}
            </p>
            <h2 className="text-lg font-bold mb-2">Conclusion</h2>
            <p>{coverLetter.conclusion}</p>
          </div>
        )}
      </CardContent>

      {/* Modal for saving cover letter */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-4 bg-background">
          <h2 className="text-lg font-bold mb-2">Save Cover Letter</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a name for the cover letter"
            className="border border-gray-300 rounded p-2 w-full"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSaveCoverLetter} className="bg-accent">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default CoverLetterComponent;
