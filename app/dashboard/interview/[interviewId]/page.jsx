"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Webcam from "react-webcam";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
function Interview() {
  const params = useParams(); // Get interview ID from URL
  const [interviewDetails, setInterviewDetails] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetails(params.interviewId);
    }
  }, [params]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      console.log(result[0]);
      setInterviewDetails(result[0]); // Store interview details
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="my-10 flex flex-col items-center">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        
        {/* Left Side: Job Role Details */}
        <div className="flex flex-col p-4 rounded-lg border gap-4 bg-gray-100 shadow-md w-full h-full flex-grow">
  {interviewDetails ? (
    <>
      <h2 className="text-lg"><strong>Job Role/Job Position:</strong> {interviewDetails.jobPosition}</h2>
      <h2 className="text-lg"><strong>Job Description/Tech Stack:</strong> {interviewDetails.jobDesc}</h2>
      <h2 className="text-lg"><strong>Years of Experience:</strong> {interviewDetails.jobExperience}</h2>
    </>
  ) : (
    <h2 className="text-lg text-gray-500">Loading interview details...</h2>
  )}
</div>

<div className="flex flex-col items-center gap-5">
      
      {/* Webcam Container */}
      <div className="p-5 border rounded-lg flex justify-center items-center w-full h-60 bg-gray-100 shadow-md">
        {webCamEnabled ? (
          <Webcam
            className="w-full h-full rounded-lg"
            mirrored={true}
            onUserMedia={() => setWebCamEnabled(true)}
            onUserMediaError={() => setWebCamEnabled(false)}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Lightbulb className="text-yellow-500 text-3xl" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0122 9.618v4.764a2 2 0 01-2.447 1.894L15 14M4 6h16M4 18h16M4 12h4" />
            </svg>
            <h2 className="text-lg text-gray-500">Enable Webcam & Microphone</h2>
          </div>
        )}
      </div>

      {/* Enable / Turn Off Webcam Button */}
      <button
        className={`px-5 py-2 rounded-lg text-white shadow-md transition-all duration-300 ${
          webCamEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
        onClick={() => setWebCamEnabled(!webCamEnabled)}
      >
        {webCamEnabled ? "Turn Off Webcam" : "Enable Webcam & Microphone"}
      </button>

     {/* Start Button */}
     <Link href={"/dashboard/interview/"+params.interviewId+"/start"}>
    <Button>Start</Button>  
    </Link>

    </div>
      </div>
    </div>
  );
}

export default Interview;
