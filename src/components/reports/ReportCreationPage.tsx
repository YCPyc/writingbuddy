import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SendIcon } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../../../lib/supabaseClient";
import { assignmentRepository } from "@/src/domains/assignments/repository";
import { assignmentService } from "@/src/domains/assignments/service";
import {
  Assignment,
  AssignmentWithChatHistory,
} from "@/src/domains/assignments/model";
import { reportRepository } from "../../domains/reports/repository";
import { reportService } from "../../domains/reports/service";
import { useAuth } from "../../components/auth/AuthProvider";

type ReportCreationPageProps = {
  onBack: () => void;
  classCode: string;
  onSuccess: (tab: string) => void;
};

// Define form validation schema
const formSchema = z.object({
  assignmentData: z.string().min(1, "Please select an assignment"),
});

type FormData = z.infer<typeof formSchema>;

export function ReportCreationPage({
  onBack,
  classCode,
  onSuccess,
}: ReportCreationPageProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignmentData: "",
    },
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<string>("");
  const [streamedText, setStreamedText] = useState<string>("");
  const [assignments, setAssignments] = useState<AssignmentWithChatHistory[]>(
    []
  );
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const messageListenerRef = useRef<any>(null);
  const { id: userId } = useAuth();

  // Fetch assignments when component mounts
  useEffect(() => {
    async function fetchAssignments() {
      setIsLoadingAssignments(true);
      try {
        // Fetch assignments from Supabase
        const newAssignmentService = assignmentService(
          assignmentRepository(supabase)
        );
        const assignments = await newAssignmentService.getAssignments(
          classCode
        );
        if (assignments) {
          // Process the data to include chat history
          const processedData = await Promise.all(
            assignments.map(async (assignment: Assignment) => {
              // Fetch chat history for each assignment
              const chatHistory =
                await newAssignmentService.getAssignmentChatHistory(
                  assignment.assignment_code
                );

              return {
                assignment_code: assignment.assignment_code,
                title: assignment.title,
                instruction: assignment.instruction || "",
                rubric: assignment.rubric || "No rubric available",
                standard: assignment.standard || "No standards available",
                due_date: assignment.due_date || "",
                class_code: assignment.class_code || "",
                exemplar: assignment.exemplar || "",
                updated_at: assignment.updated_at || "",
                created_at: assignment.created_at || null,
                chat_history: chatHistory || [],
              };
            })
          );

          setAssignments(processedData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoadingAssignments(false);
      }
    }

    fetchAssignments();
  }, [classCode]);

  // Function to clean up the streamed text
  const cleanStreamedText = (text: string) => {
    // Remove the quotation marks that appear at the beginning and end of chunks
    let cleaned = text.replace(/"/g, "");
    cleaned = cleaned.replace(/\\n/g, "\n");
    return cleaned;
  };

  // Function to parse the AI stream chunks
  const parseStreamChunk = (chunk: string) => {
    try {
      // Check if it's a text chunk (starts with 0:)
      if (chunk.startsWith("0:")) {
        // Extract the text content (remove the 0: prefix)
        const textContent = chunk.substring(3);
        return textContent;
      }
      if (chunk.startsWith("e:")) {
        setIsGenerating(false);
        return null;
      }
    } catch (error) {
      console.error("Error parsing chunk:", error);
      return chunk;
    }
  };

  const handleSubmit = async (data: FormData) => {
    setIsGenerating(true);
    setReportContent("");
    setStreamedText("");

    try {
      // Parse the selected assignment data
      const assignmentData = JSON.parse(data.assignmentData);
      console.log(assignmentData);
      // Remove any existing message listener
      if (messageListenerRef.current) {
        chrome.runtime.onMessage.removeListener(messageListenerRef.current);
      }

      // Set up a new message listener
      const messageListener = (message: any) => {
        console.log("message", message);
        if (message.type === "chat_chunk") {
          setStreamedText((prev) => prev + message.chunk);
        } else if (message.type === "chat_error") {
          console.error("Chat error:", message.error);
          setIsGenerating(false);
        } else if (message.type === "chat_complete") {
          setStreamedText(message.fullText);
          setIsGenerating(false);
        }
        return true;
      };

      messageListenerRef.current = messageListener;
      chrome.runtime.onMessage.addListener(messageListener);

      // Send a message to the background script
      await chrome.runtime.sendMessage({
        type: "chat_request",
        messages: [
          {
            role: "user",
            content: `Generate a concise report for the following assignment:
            
Title: ${assignmentData.title}

Instructions: ${assignmentData.instructions}

Rubric: ${assignmentData.rubric}

Standards: ${assignmentData.standards}

${
  assignmentData.chat_history
    ? `Here are the students' chat history with an AI assistant. Identify the student's strengths and areas for improvement from the chat history. But do not mention the chat history in the report: ${assignmentData.chat_history}`
    : ""
}

Format the report with markdown headings and bullet points for: Overview, Strengths, Areas for Improvement, and Recommendations.`,
          },
        ],
      });

      console.log("Message sent to background");
    } catch (error) {
      console.error("Error sending message to background:", error);
      setIsGenerating(false);
    }
  };

  // Process the streamed text when it changes
  useEffect(() => {
    if (streamedText) {
      const cleanedText = cleanStreamedText(streamedText);
      setReportContent(cleanedText);
    }

    // Check if the stream is complete
    if (
      streamedText.includes("finishReason") &&
      streamedText.includes("stop")
    ) {
      setIsGenerating(false);
    }
  }, [streamedText]);

  // Clean up the message listener when component unmounts
  useEffect(() => {
    return () => {
      if (messageListenerRef.current) {
        chrome.runtime.onMessage.removeListener(messageListenerRef.current);
      }
    };
  }, []);

  const saveReport = async () => {
    if (!userId || !reportContent) return;

    try {
      const reportServiceInstance = reportService(reportRepository(supabase));
      const parsedData = JSON.parse(form.getValues().assignmentData);
      console.log(parsedData);
      const reportId = await reportServiceInstance.createReport({
        content: reportContent,
        teacher_id: userId,
        assignment_code: parsedData.assignment_code,
      });

      if (reportId) {
        console.log("Report saved successfully with ID:", reportId);
        onSuccess("reports");
      } else {
        console.error("Failed to save report");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-3xl">
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold">Generate Assignment Report</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>
            Select an assignment to generate a comprehensive report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="assignmentData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment</FormLabel>
                    <Select
                      disabled={isLoadingAssignments}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an assignment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingAssignments ? (
                          <SelectItem value="loading" disabled>
                            Loading assignments...
                          </SelectItem>
                        ) : assignments.length > 0 ? (
                          assignments.map((assignment) => (
                            <SelectItem
                              key={assignment.assignment_code}
                              value={JSON.stringify({
                                title: assignment.title,
                                instructions: assignment.instruction,
                                rubric: assignment.rubric,
                                standards: assignment.standard,
                                chat_history: assignment.chat_history,
                                assignment_code: assignment.assignment_code,
                              })}
                            >
                              {assignment.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No assignments available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose an assignment to analyze
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isGenerating ||
                  isLoadingAssignments ||
                  !form.getValues().assignmentData
                }
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <SendIcon className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(reportContent || isGenerating) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Report</CardTitle>
            <CardDescription>
              AI-generated analysis of student performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {reportContent ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {reportContent}
                </ReactMarkdown>
              ) : (
                <div className="flex items-center mt-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                  <div
                    className="h-2 w-2 bg-primary rounded-full animate-pulse mx-1"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-primary rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              onClick={saveReport}
              disabled={isGenerating || !reportContent}
            >
              Save Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
