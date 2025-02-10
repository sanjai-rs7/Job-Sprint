import Headings from "@/components/Headings";
import InterviewPin from "@/components/InterviewPin";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useAuth();
  useEffect(() => {
    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      interviewQuery,
      (snapshot) => {
        // console.log(snapshot.docs);
        const InterviewList: Interview[] = snapshot.docs.map((doc) => {
          console.log(doc.data());
          return doc.data() as Interview;
        });
        setInterviews(InterviewList);
        setIsLoading(false);
      },

      (error) => {
        console.log(error);
        toast.error("Error..!!", {
          description: "Something went wrong, Try again later!!!",
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Headings
          isSubHeading={false}
          title="Dashboard"
          description="Start your AI Mock Interview"
        />

        <Link to="/generate/create">
          <Button size={"default"}>
            <Plus className="w-5 h-5 mr-1"></Plus>
            Add new
          </Button>
        </Link>
      </div>

      <Separator className="my-6" />

      <div className="md:grid md:grid-cols-3 gap-4 py-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, ind) => (
            <Skeleton key={ind} className="h-24 md:h-32 rounded-md" />
          ))
        ) : interviews.length > 0 ? (
          interviews.map((interview, ind) => (
            // <p key={ind}>{interview.position}</p>
            <InterviewPin key={ind} data={interview} />
          ))
        ) : (
          <div className="md:col-span-3 w-full flex flex-col flex-grow items-center justify-center h-96">
            <img
              src="/svg/not-found.svg"
              alt=""
              className="w-52 h-52 object-contain"
            />

            <h2 className="text-lg font-semibold text-muted-foreground">
              No Data Found
            </h2>

            <p className="w-full md:w-96 text-center text-sm text-neutral-400 mt-4">
              There is no available data to show. Please add some new mock
              interviews
            </p>

            <Link to={"/generate/create"} className="mt-4">
              <Button size={"sm"}>
                <Plus className="min-w-5 min-h-5 mr-1" />
                Add New
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
