import React, { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import { uploadImageToFirebase } from "../utils/firebase";
import { useAppStore } from "../store";

const ShareResume = ({
  imageUrl,
  templateName,
}: {
  imageUrl: string;
  templateName: string;
}) => {
  const { user } = useAppStore();
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const title = "Check out my resume!";

  useEffect(() => {
    const fetchUrl = async () => {
      if (imageUrl && user) {
        const url = await uploadImageToFirebase({
          uid: user.uid,
          imageUrl,
          templateName,
        });
        setShareUrl(url);
      }
    };
    fetchUrl();
  }, [imageUrl]);

  if (!shareUrl) {
    return null; // Wait until image URL is available
  }

  return (
    <div
      className={`space-x-2 space-y-2 mb-2 transition-opacity duration-700 ease-in-out ${
        shareUrl ? "opacity-100" : "opacity-0"
      }`}
    >
      <h3 className="font-bold">Share my resume on:</h3>

      <FacebookShareButton url={shareUrl} title={title}>
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>

      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>

      <LinkedinShareButton url={shareUrl} title={title}>
        <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
    </div>
  );
};

export default ShareResume;
