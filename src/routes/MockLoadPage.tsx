import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import InterviewPin from "@/components/InterviewPin";
import { Button } from "@/components/ui/button";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import LoaderPage from "@/views/LoaderPage";
import { doc, getDoc } from "firebase/firestore";
import { Lightbulb, Sparkles, WebcamIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Webcam from "react-webcam";

const MockLoadPage = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    if (interviewId) {
      const fetchInterviewDetails = async () => {
        setIsLoading(true);
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            // console.log(interviewDoc.data());
            setInterview({ ...interviewDoc.data() } as Interview);
          } else {
            navigate("/generate", { replace: true });
          }
        } catch (error) {
          console.log(error);
          toast.error("Error..!", {
            description: "Something went wrong. Please try again later.",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchInterviewDetails();
    }
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="" />;
  }
  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex items-center justify-between">
        <CustomBreadcrumb
          breadCrumbPage={interview?.position || ""}
          breadCrumbItems={[{ label: "Mock Interview", link: "/generate" }]}
        />

        <Link to={`/generate/interview/${interviewId}/start`}>
          <Button>
            Start <Sparkles />
          </Button>
        </Link>
      </div>

      {interview && <InterviewPin data={interview} isMockPage={true} />}

      <Alert className="bg-yellow-100/50 border-yellow-200 p-4 rounded-lg flex items-start gap-3 -mt-3">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <div>
          <AlertTitle className="text-yellow-800 font-semibold">
            Important Information
          </AlertTitle>
          <AlertDescription className="text-sm text-yellow-700 mt-1">
            Please enable your webcam and microphone to start the AI-generated
            mock interview. The interview consists of five questions. You’ll
            receive a personalized report based on your responses at the end.{" "}
            <br />
            <br />
            <span className="font-medium">Note:</span> Your video is{" "}
            <strong>never recorded</strong>. You can disable your webcam at any
            time.
          </AlertDescription>
        </div>
      </Alert>

      <div className="flex items-center justify-center">
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
        <Button onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}>
          {isWebCamEnabled ? "Disable Webcam" : "Enable Webcam"}
        </Button>
      </div>
    </div>
  );
};

export default MockLoadPage;
