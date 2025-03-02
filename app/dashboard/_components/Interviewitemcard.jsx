import React from "react";
import { useRouter } from "next/navigation"; // Next.js router import
import { Button } from "@/components/ui/button"; // Ensure correct path

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push(`/dashboard/interview/${interview.mockId}`); // Navigate dynamically
  };
  const onfeedback=()=>{
    router.push('/dashboard/interview/'+interview?.mockId+"/feedback");
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm w-80">
      <h2 className="font-bold text-primary text-lg">{interview?.jobTitle}</h2>
      <p className="text-sm text-gray-600">{interview?. jobExperience} Years of Experience</p>
      <p className="text-xs text-gray-400">Created At: {interview?.createdAt}</p>

      <div className="flex justify-between mt-3">
        <Button variant="outline" className="w-1/2"
        onClick={onfeedback}>
          Feedback
        </Button>
        <Button className="w-1/2" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
