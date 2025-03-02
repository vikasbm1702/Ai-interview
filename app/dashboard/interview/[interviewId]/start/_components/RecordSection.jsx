"use client"
import React, { useState, useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { Mic, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { chatSession } from '@/utils/AIGeminimodel';
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';

export default function RecordSection({ mockInterviewquestions, activeQuestionIndex,interviewdata }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const {user}=useUser();


  const { error, isRecording, results, startSpeechToText, stopSpeechToText,setResults } =
    useSpeechToText({
      continuous: false,
      useLegacyResults: false,
    });

  useEffect(() => {
    if (results.length > 0) {
      let latestTranscript = results[results.length - 1]?.transcript || "";
      setUserAnswer(latestTranscript);
      const currentQuestion = mockInterviewquestions.interviewQuestions?.[activeQuestionIndex]?.question || "No question available";
      fetchAIFeedback(latestTranscript, currentQuestion);
    }
  }, [results]);

  const fetchAIFeedback = async (answer, question) => {
    if (answer.length < 10) {
      toast.error("Error while saving your answer. Please record again.");
      return;
    }

    const feedbackPrompt = `Question: ${question}, \nUser Answer: ${answer}. \nDepends on question and user answer, please give us a rating for the answer and feedback as an area of improvement in just 3 to 5 lines. \nProvide the response in JSON format with a \"rating\" field.`;
    setLoading(true);
    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const cleanedResponse = responseText.trim().replace(/^```json/, '').replace(/```$/, '');
      const jsonResponse = JSON.parse(cleanedResponse);
      setAiFeedback(jsonResponse);
      await saveToDatabase(answer, question, jsonResponse);
    } catch (err) {
      console.error("Error fetching AI feedback:", err);
      toast.error("Failed to fetch AI feedback.");
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async (userAnswer, question, feedbackData) => {
    try {
      const resp = await db.insert(UserAnswer).values( {
        mockIdRef: interviewdata?.mockId,
        question: mockInterviewquestions.interviewQuestions?.[activeQuestionIndex]?.question || "",
        correctAns: mockInterviewquestions.interviewQuestions?.[activeQuestionIndex]?.answer || "",
        userAns: userAnswer,
        feedback: feedbackData?.feedback,
        rating: feedbackData?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      });
  
      if (resp) {
        toast('User Answer recorded successfully');
        setResults([]);
      }
    } catch (error) {
      console.error('Error saving data to database:', error);
      toast.error('Failed to save user answer. Please try again.');
    }
  };
  
  const SaveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍♂️</p>;

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-[400px] h-[250px] bg-black rounded-lg flex items-center justify-center">
        <Webcam
          audio={false}
          videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
          screenshotFormat="image/jpeg"
          className="rounded-lg w-full h-full"
        />
      </div>

      <Button
        className="mt-4 bg-gray-200 px-6 py-2 rounded-lg flex items-center gap-2 text-black shadow-md"
        onClick={SaveUserAnswer}
        disabled={loading}
      >
        <Mic size={18} className="text-blue-500" /> {isRecording ? "Stop Recording" : "Record Answer"}
      </Button>

      <Button
        className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md"
        onClick={() => setShowAnswer(true)}
        disabled={!userAnswer || loading}
      >
        <Eye size={18} /> Show User Answer
      </Button>
    </div>
  );
}
