import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./ToolTipButton";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import RecordAnswer from "./RecordAnswer";

interface QuestionSectionProps {
  quesArr: { question: string; answer: string }[];
}

const QuestionSection = ({ quesArr }: QuestionSectionProps) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

  const handleAudioPlay = (question: string) => {
    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      setCurrentSpeech(null);
    } else {
      const speech = new SpeechSynthesisUtterance(question);
      window.speechSynthesis.speak(speech);
      setIsAudioPlaying(true);
      setCurrentSpeech(speech);
    }
  };
  if (currentSpeech) {
    console.log();
  }

  return (
    <div className="w-full min-h-96 border-2 rounded-lg p-4">
      <Tabs
        defaultValue={quesArr[0]?.question}
        className="w-full"
        orientation="horizontal"
      >
        <TabsList className="w-full flex bg-transparent flex-wrap items-center justify-start gap-4">
          {quesArr.map((obj, ind) => (
            <TabsTrigger
              key={ind}
              value={obj.question}
              className={cn(
                "data-[state=active]:bg-purple-200 data-[state=active]:shadow-md px-3 rounded-full"
              )}
            >{`Question ${ind + 1}`}</TabsTrigger>
          ))}
        </TabsList>

        {quesArr.map((obj, ind) => (
          <TabsContent key={ind} value={obj.question} className="">
            <div className="flex items-center justify-between">
              <p className="text-base text-left tracking-wider text-neutral-700">
                {obj.question}
              </p>

              <div className="flex items-center justify-end">
                <TooltipButton
                  content={isAudioPlaying ? "Stop" : "Start"}
                  icon={
                    isAudioPlaying ? (
                      <VolumeX className="min-w-5 min-h-5 text-muted-foreground" />
                    ) : (
                      <Volume2 className="min-w-5 min-h-5 text-muted-foreground" />
                    )
                  }
                  onClick={() => {
                    handleAudioPlay(obj.question);
                  }}
                />
              </div>
            </div>

            <RecordAnswer
              obj={obj}
              isWebCamEnabled={isWebCamEnabled}
              setIsWebCamEnabled={setIsWebCamEnabled}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default QuestionSection;
