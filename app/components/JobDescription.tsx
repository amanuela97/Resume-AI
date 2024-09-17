"use client";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import TextTab from "./TextTab";
import LinkTab from "./LinkTab";

export default function JobDescription() {
  const [activeTab, setActiveTab] = useState("text");

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-lg shadow-lg bg-card">
      <h2 className="text-2xl font-bold mb-4">Job Description</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="link">Link</TabsTrigger>
        </TabsList>
        {/* Flexbox container to make the tabs content equal height */}
        <div className="flex flex-col">
          <div className="flex-grow">
            <TabsContent value="text" className="mt-0 min-h-[290px]">
              <TextTab />
            </TabsContent>
            <TabsContent value="link" className="mt-0 min-h-[290px]">
              <LinkTab />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
