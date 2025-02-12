import {
  CircleStop,
  Loader,
  Mic,
  RefreshCcwDotIcon,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import Webcam from "react-webcam";
import { TooltipButton } from "./ToolTipButton";
import { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { toast } from "sonner";
import { chatSession } from "@/scripts/gemini";

interface RecordAnswerProps {
  obj: { question: string; answer: string };
  isWebCamEnabled: boolean;
  setIsWebCamEnabled: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

const RecordAnswer = ({
  obj,
  isWebCamEnabled,
  setIsWebCamEnabled,
}: RecordAnswerProps) => {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [feedbackAndRating, setFeedbackAndRating] = useState<AIResponse | null>(
    null
  );

  useEffect(() => {
    const combinedTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");
    setUserAnswer(combinedTranscripts);
    console.log(combinedTranscripts);
  }, [results]);

  const cleanJsonResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/(json|```|`)/g, "");
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        console.log("Length : ", userAnswer?.length);
        toast.error("Error", {
          description: "Your answer should be more than 30 characters.",
        });
        return;
      }

      const feedback = await generateFeedback(
        obj.question,
        obj.answer,
        userAnswer
      );
      // console.log(feedback);
      setFeedbackAndRating(feedback);
    } else {
      startSpeechToText();
    }
  };

  const generateFeedback = async (
    ques: string,
    ans: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);

    const prompt = `
      Question: "${ques}"
      User Answer: "${userAns}"
      Correct Answer: "${ans}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;
    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const result: AIResponse = cleanJsonResponse(aiResult.response.text());
      return result;
    } catch (error) {
      console.log(error);
      toast("Error", {
        description: "An error occurred while generating feedback.",
      });
      return { ratings: 0, feedback: "Unable to generate feedback" };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    results.length = 0;
    stopSpeechToText();
    startSpeechToText();
  };

  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <div className="w-full h-[375px] md:w-[500px] bg-gray-200 flex items-center justify-center rounded-md">
          {isWebCamEnabled ? (
            <Webcam
              onUserMedia={() => setIsWebCamEnabled(true)}
              onUserMediaError={() => setIsWebCamEnabled(false)}
              className="w-full h-full object-cover rounded-md"
            ></Webcam>
          ) : (
            <WebcamIcon className="w-36 h-36 text-muted-foreground" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <TooltipButton
          content={isWebCamEnabled ? "Turn Off" : "Turn On"}
          icon={
            isWebCamEnabled ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}
        />
        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={() => {
            recordUserAnswer();
          }}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5 animate-spin" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => {}}
          disbaled={!feedbackAndRating}
        />
      </div>
      <div className="bg-gray-200 p-4 shadow-md">
        <h2 className="text-lg font-semibold">Your Answer:</h2>
        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your ansewer here"}
        </p>

        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech: </strong>
            {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default RecordAnswer;
