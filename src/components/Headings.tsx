import { cn } from "@/lib/utils";

interface HeadingsProps {
  title: string;
  description?: string;
  isSubHeading?: boolean;
}

const Headings = ({
  title,
  description,
  isSubHeading = false,
}: HeadingsProps) => {
  return (
    <div className="">
      <h1
        className={cn(
          "text-2xl md:text-3xl text-gray-900 font-semibold font-sans mb-2",
          isSubHeading && "text-lg md:text-xl"
        )}
      >
        {title}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default Headings;
