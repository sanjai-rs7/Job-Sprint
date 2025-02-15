import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import Headings from "@/components/Headings";
import InterviewPin from "@/components/InterviewPin";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { db } from "@/config/firebase.config";
import { cn } from "@/lib/utils";
import { Interview, UserAnswer } from "@/types";
import LoaderPage from "@/views/LoaderPage";
import { useAuth } from "@clerk/clerk-react";
import { AccordionItem } from "@radix-ui/react-accordion";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CircleCheck, Star } from "lucide-react";
import { NumericKeys } from "node_modules/react-hook-form/dist/types/path/common";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Feedback = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const [activeFeed, setActiveFeed] = useState("");
  const navigate = useNavigate();
  const { userId } = useAuth();

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

      const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
          const queryRef = query(
            collection(db, "userAnswers"),
            where("userId", "==", userId),
            where("mockIdRef", "==", interviewId)
          );

          const queryRes = await getDocs(queryRef);

          const interviewData: UserAnswer[] = queryRes.docs.map(
            (doc) => doc.data() as UserAnswer
          );

          setFeedbacks(interviewData);
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
      fetchFeedbacks();
    }
  }, [interviewId, navigate, userId]);

  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return 0.0;
    const totalRatings = feedbacks.reduce(
      (acc, feeback) => acc + feeback.rating,
      0
    );

    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="" />;
  }
  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="flex items-center justify-between">
        <CustomBreadcrumb
          breadCrumbPage={"Feedback"}
          breadCrumbItems={[
            { label: "Mock Interview", link: "/generate" },
            {
              label: `${interview?.position}`,
              link: `/generate/interview/${interview?.id}`,
            },
          ]}
        />
      </div>
      <Headings
        title="Congratulations !"
        description="Your personalized feedback is now available. Dive in to see your strengths, areas for improvement, and tips to help you ace your next interview."
      />

      <p className="text-base text-muted-foreground">
        Your overall interview ratings :{" "}
        <span className="text-emerald-500 font-semibold text-xl">
          {overAllRating} / 10
        </span>
      </p>

      {interview && <InterviewPin data={interview} isMockPage={true} />}

      {feedbacks && (
        <Accordion
          type="single"
          collapsible
          className="border rounded-lg shadow-md"
        >
          {feedbacks.map((feedback) => (
            <AccordionItem key={feedback.id} value={feedback.id}>
              <AccordionTrigger
                onClick={() => setActiveFeed(feedback.id)}
                className={cn(
                  "px-5 py-3 flex items-center justify-between text-base rounded-t-lg transition-colors hover:no-underline",
                  activeFeed === feedback.id
                    ? "bg-gradient-to-r from-purple-50 to-blue-50"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{feedback.question}</span>
              </AccordionTrigger>

              <AccordionContent className="px-5 py-6 bg-white rounded-b-lg space-y-5 shadow-inner">
                <div className="text-lg font-semibold to-gray-700">
                  <Star className="inline mr-2 text-yellow-400" />
                  Rating : {feedback.rating}
                </div>

                <Card className="border-none space-y-3 p-4 bg-green-100 rounded-lg shadow-md">
                  <CardTitle className="flex items-center">
                    <CircleCheck className="mr-2 text-green-500" />
                    Expected Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feedback.correct_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-blue-100 rounded-lg shadow-md">
                  <CardTitle className="flex items-center">
                    <CircleCheck className="mr-2 text-blue-500" />
                    Your Answer
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feedback.user_ans}
                  </CardDescription>
                </Card>

                <Card className="border-none space-y-3 p-4 bg-red-100 rounded-lg shadow-md">
                  <CardTitle className="flex items-center">
                    <CircleCheck className="mr-2 text-red-500" />
                    Feedback
                  </CardTitle>

                  <CardDescription className="font-medium text-gray-700">
                    {feedback.feedback}
                  </CardDescription>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default Feedback;
