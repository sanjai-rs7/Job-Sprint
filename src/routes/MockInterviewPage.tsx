import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import QuestionSection from "@/components/QuestionSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import LoaderPage from "@/views/LoaderPage";
import { doc, getDoc } from "firebase/firestore";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MockInterviewPage = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

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
    <div>
      <CustomBreadcrumb
        breadCrumbPage="Start"
        breadCrumbItems={[
          { label: "Mock Interview", link: "/generate" },
          {
            label: `${interview?.position}`,
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />
      <div className="w-full my-6">
        <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {interview?.questions && (
        <div>
          <QuestionSection quesArr={interview.questions} />
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
