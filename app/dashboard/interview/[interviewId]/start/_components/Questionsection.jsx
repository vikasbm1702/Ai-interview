import React from "react";
import { Volume2 } from "lucide-react"; // Import speaker icon

function Questionsection({ mockInterviewquestions = {}, activeQuestionIndex }) {
  const questionsArray = Array.isArray(mockInterviewquestions.interviewQuestions)
    ? mockInterviewquestions.interviewQuestions
    : [];

  if (questionsArray.length === 0) {
    console.warn("No valid questions found in mockInterviewquestions:", mockInterviewquestions);
  }

  // Function to handle text-to-speech
  const speakQuestion = () => {
    const questionText = questionsArray[activeQuestionIndex]?.question;
    if (!questionText) return;

    const speech = new SpeechSynthesisUtterance(questionText);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.cancel(); // Stop any existing speech
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {questionsArray.map((question, index) => (
          <h2
            key={index}
            className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer
            ${activeQuestionIndex === index ? "bg-primary text-white" : ""}`}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>

      {/* Question Text */}
      <h2 className="my-5 text-md md:text-lg">
        {questionsArray[activeQuestionIndex]?.question || "No question available"}
      </h2>

      {/* Speaker Icon Below the Question */}
      <button
        onClick={speakQuestion}
        className="mt-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
        aria-label="Listen to question"
      >
        <Volume2 size={24} className="text-gray-700" />
      </button>

      <div className="border rounded-lg p-5 bg-blue-100">
        <h2 className="flex gap-2 items-center text-primary">
          <strong>Note:</strong>
        </h2>
        <h2>{process.env.NEXT_PUBLIC_QUESTION_NOTE || "Default Note: Answer thoughtfully!"}</h2>
      </div>
    </div>
  );
}

export default Questionsection;
