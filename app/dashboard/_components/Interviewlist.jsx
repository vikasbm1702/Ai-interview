"use client"
import React, { useState, useEffect } from "react";
 // Ensure correct import path
import { db } from "@/utils/db"; // Ensure you import your database connection
import { eq, desc } from "drizzle-orm"; // Ensure correct ORM import
import { useUser } from "@clerk/nextjs";
import { MockInterview } from "@/utils/schema";
import Interviewitemcard from "./Interviewitemcard";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview) // Ensure MockInterview is correctly imported
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

      console.log(result);
      setInterviewList(result);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Interview List</h2>
      {interviewList && interviewList.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {interviewList.map((interview, index) => (
            <Interviewitemcard interview={interview} key={index} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No interviews found.</p>
      )}
    </div>
  );
  
  
}

export default InterviewList;
