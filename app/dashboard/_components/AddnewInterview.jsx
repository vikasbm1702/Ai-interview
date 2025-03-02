"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { chatSession } from '@/utils/AIGeminimodel';
import { Loader2 } from 'lucide-react';
import {v4 as uuidv4} from 'uuid';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';


function AddnewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [techStack, setTechStack] = useState("");
    const [experience, setExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const[jsonresponse,setjsonresponse]=useState([]);
    const {user}=useUser();
    const router=useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const inputPrompt = JSON.stringify({
            jobPosition: jobTitle,
            jobDescription: techStack,
            yearsOfExperience: experience,
            request: "Generate 5 interview questions with answers in JSON format."
        });

        try {
            // Send message to AI model and get response text
            const result = await chatSession.sendMessage(inputPrompt);
            const aiResponse = await result.response.text(); // Ensure it's awaited
        
            // Clean up the AI response by removing unnecessary formatting
            const cleanedJson = aiResponse.trim().replace(/^```json/, '').replace(/```$/, '');
        
            // Parse the cleaned JSON response
            const parsedJson = JSON.parse(cleanedJson);
            console.log(parsedJson);
        
            // Store the parsed JSON response
            setjsonresponse(parsedJson);
        
            // Insert the response into the database
            const resp = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: parsedJson, // Store actual parsed JSON instead of raw string
                jobExperience: experience,
                jobDesc: techStack,
                jobPosition: jobTitle,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY'),
            }).returning({ mockId: MockInterview.mockId });
        
            console.log("Inserted Id:", resp);
        
            // Navigate to the interview page if insertion was successful
            if (resp?.length > 0) {
                router.push(`dashboard/interview/${resp[0].mockId}`);
            } else {
                console.error("Database insert returned an empty response.");
            }
        
        } catch (error) {
            console.error("Error processing AI response:", error);
        }
         finally {
            setLoading(false);
            
        }
    };

    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setOpenDialog(true)}>
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="p-6">
                    <DialogHeader className="text-center">
                        <DialogTitle className="text-xl font-bold text-blue-600">
                            Tell us more about the job you are interviewing for
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onSubmit}>
                        <DialogDescription className="text-gray-500">
                            Add details about the job position, your skills, and years of experience.
                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-blue-700">Job Position / Role Name</label>
                                    <Input
                                        placeholder="Enter job title..."
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-blue-700">Job Description / Tech Stack</label>
                                    <Textarea
                                        placeholder="Enter job description.."
                                        value={techStack}
                                        onChange={(e) => setTechStack(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-blue-700">Years of Experience</label>
                                    <Input
                                        type="number"
                                        placeholder="Enter experience in years..."
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        max="50"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-4">
                                <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                                    Cancel
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white" type="submit" disabled={loading}>
                                    {loading ? <><Loader2 className="animate-spin mr-2" /> Generating...</> : "Start Interview"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddnewInterview;
