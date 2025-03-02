"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuestionSection from "./_components/Questionsection";
import RecordSection from "./_components/RecordSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";  // ✅ Correct lowercase



function Start() {
  const params = useParams();
  const [interviewdata,setinterviewdata]=useState();
  const[mockInterviewquestions,setmockinterviewquestions]=useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(2);
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
  
       const jsonMockResp=JSON.parse(result[0].jsonMockResp);
       console.log(jsonMockResp);
       setmockinterviewquestions(jsonMockResp);
       setinterviewdata(result[0]);
        
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };
    console.log("mockInterviewQuestion:", mockInterviewquestions);
console.log("mockInterviewQuestion.length:", mockInterviewquestions.interviewQuestions?.length);
console.log("activeQuestionIndex:", activeQuestionIndex);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Questions Section */}
      <QuestionSection
        mockInterviewquestions={mockInterviewquestions}
        activeQuestionIndex={activeQuestionIndex}
      />

      {/* Video/ Audio Recording */}
      <div>
        {/* Video/Audio Recording Component Goes Here */}
        <RecordSection
        mockInterviewquestions={mockInterviewquestions}
        activeQuestionIndex={activeQuestionIndex}
        interviewdata={interviewdata}
        />
      </div>
      <div className='flex justify-end gap-6'>
        
  {activeQuestionIndex > 0 && 
    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
      Previous
    </Button>
  }
  {activeQuestionIndex !==mockInterviewquestions.interviewQuestions?.length - 1 && 
    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
      Next
    </Button>
  }
 
  {activeQuestionIndex ===mockInterviewquestions.interviewQuestions?.length - 1 && 
   <Link href={'/dashboard/interview/'+ interviewdata?.mockId+"/feedback"}>
    <Button>End Interview</Button>
  </Link>}
</div>

    </div>
  );
  
}

export default Start