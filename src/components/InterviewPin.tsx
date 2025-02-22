import { Card, CardDescription, CardFooter, CardTitle } from "./ui/card";
import { Interview } from "@/types";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./ToolTipButton";
import { Newspaper, Pencil, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

interface InterviewPinProps {
  data: Interview;
  isMockPage?: boolean;
}

const InterviewPin = ({ data, isMockPage = false }: InterviewPinProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const onDelete = async () => {
    setLoading(true);
    try {
      const interviewRef = doc(db, "interviews", data.id);
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("mockIdRef", "==", data.id)
      );

      const querySnap = await getDocs(userAnswerQuery);
      const batch = writeBatch(db);
      batch.delete(interviewRef);
      querySnap.forEach((docRef) => batch.delete(docRef.ref));
      await batch.commit();
      toast.success("Success", {
        description: "Your interview has been removed",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "Something went wrong!. Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="p-4 rounded-lg shadow-none hover:shadow-xl shadow-gray-400 cursor-pointer transition-all space-y-4">
      <CardTitle>{data.position}</CardTitle>
      <CardDescription>{data.description}</CardDescription>
      <div className="flex w-full flex-wrap items-center gap-2">
        {data.techStack.split(", ").map((word, ind) => (
          <Badge
            key={ind}
            variant={"outline"}
            className="text-muted-foreground hover:text-white hover:bg-purple-500 hover:border-black bg-gray-200"
          >
            {word}
          </Badge>
        ))}
      </div>

      <CardFooter
        className={cn(
          "w-full flex items-center p-0",
          isMockPage ? "justify-end" : "justify-between"
        )}
      >
        <p>
          {`${new Date(data.createdAt.toDate()).toLocaleDateString("en-US", {
            dateStyle: "long",
          })} - ${new Date(data.createdAt.toMillis()).toLocaleTimeString(
            "en-US",
            { timeStyle: "short" }
          )}`}
        </p>

        {!isMockPage && (
          <div className="flex items-center justify-center ">
            <TooltipButton
              content="Edit"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/${data.id}`);
              }}
              disbaled={false}
              buttonClassName="hover:text-purple-800"
              icon={<Pencil />}
              loading={false}
            />

            <TooltipButton
              content="Delete"
              buttonVariant={"ghost"}
              onClick={onDelete}
              disbaled={false}
              buttonClassName="hover:text-red-500"
              icon={<Trash2 />}
              loading={loading}
            />

            <TooltipButton
              content="Feedback"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/feedback/${data.id}`);
              }}
              disbaled={false}
              buttonClassName="hover:text-emerald-500"
              icon={<Newspaper />}
              loading={false}
            />

            <TooltipButton
              content="Start"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/interview/${data.id}`);
              }}
              disbaled={false}
              buttonClassName="hover:text-sky-500"
              icon={<Sparkles />}
              loading={false}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default InterviewPin;
