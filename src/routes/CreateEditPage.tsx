import { db } from "@/config/firebase.config";
import FormMockInterview from "@/forms/FormMockInterview";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CreateEditPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const fetchInteview = async () => {
      if (interviewId) {
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        try {
          if (interviewDoc.exists()) {
            setInterview({ ...interviewDoc.data() } as Interview);
          }
        } catch (err) {
          console.log("ERROR at CreateEditPage ", err);
        }
      }
    };

    fetchInteview();
  }, [interviewId]);

  return (
    <div>
      <FormMockInterview initialData={interview} />
    </div>
  );
};

export default CreateEditPage;
