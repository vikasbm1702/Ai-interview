"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const { interviewId } = useParams(); // ✅ Get interviewId properly
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      console.log("Feedback Data:", result);
      setFeedbackList(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      {feedbackList.length === 0 ? (
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-600">No interview list is found.</h1>
          <Button className="mt-4" onClick={() => router.replace('/dashboard')}>
            Go Home
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-green-600">Congratulations!</h1>
          <p className="text-lg font-semibold">Here is your interview feedback</p>
          <p className="text-blue-600">
            Your overall interview rating: <span className="font-bold">7/10</span>
          </p>

          {feedbackList.map((item, index) => (
            <Card key={index} className="mt-4 shadow-lg w-full max-w-xl">
              <CardContent className="p-4">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full text-left justify-start">
                      {item.question}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="w-full mt-2 space-y-2">
                    <p className="text-gray-700"><strong>Rating:</strong> {item.rating}</p>
                    <p className="text-red-600"><strong>Your Answer:</strong> {item.userAns}</p>
                    <p className="text-green-600"><strong>Correct Answer:</strong> {item.correctAns}</p>
                    <p className="text-blue-600"><strong>Feedback:</strong> {item.feedback}</p>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}

          <Button className="mt-4" onClick={() => router.replace('/dashboard')}>
            Go Home
          </Button>
        </>
      )}
    </div>
  );
}

export default Feedback;
