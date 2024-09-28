"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Select, { MultiValue, StylesConfig } from "react-select";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ColorOption } from "../utils/types";
import { colorOptions } from "../utils/constants";
import { uploadTemplate } from "../utils/firebase";
import { toast } from "react-toastify";

const colorStyles: StylesConfig<ColorOption, true> = {
  option: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.value,
    color: [
      "#ffffff",
      "#FFD700",
      "#FFA500",
      "#FF4500",
      "#32CD32",
      "#9ACD32",
    ].includes(data.value)
      ? "black"
      : "white",
  }),
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: data.value,
    color: [
      "#ffffff",
      "#FFD700",
      "#FFA500",
      "#FF4500",
      "#32CD32",
      "#9ACD32",
    ].includes(data.value)
      ? "black"
      : "white",
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: [
      "#ffffff",
      "#FFD700",
      "#FFA500",
      "#FF4500",
      "#32CD32",
      "#9ACD32",
    ].includes(data.value)
      ? "black"
      : "white",
  }),
};

export default function UploadTemplate() {
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [selectedColors, setSelectedColors] = useState<MultiValue<ColorOption>>(
    []
  );
  const [docxFile, setDocxFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    if (name && previewImage && selectedColors && docxFile) {
      await uploadTemplate({
        name,
        previewImage,
        colorsArray: selectedColors.map((color) => color.value),
        docxFile,
      });
    } else {
      toast.error("missing required field");
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md  rounded-lg shadow-md p-6 bg-card">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Template</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="previewImage">Preview Image</Label>
            <Input
              id="previewImage"
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={(e) => handleFileChange(e, setPreviewImage)}
              required
            />
          </div>
          <div>
            <Label htmlFor="colors">Colors</Label>
            <Select
              inputId="colors"
              isMulti
              options={colorOptions}
              value={selectedColors}
              onChange={(selected) => setSelectedColors(selected)}
              styles={colorStyles}
              className="mt-1"
              placeholder="Select colors..."
              required
            />
          </div>
          <div>
            <Label htmlFor="docxFile">Document File (DOCX)</Label>
            <Input
              id="docxFile"
              type="file"
              accept=".docx"
              onChange={(e) => handleFileChange(e, setDocxFile)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Upload Template
          </Button>
        </form>
      </div>
    </div>
  );
}
