import { Ghost } from "lucide-react";
import ModalComponent from "./ModalComponent";
import { Button } from "./ui/button";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const SaveModal = ({ isOpen, onClose, onConfirm, loading }: SaveModalProps) => {
  return (
    <ModalComponent
      title="Are your sure?"
      description="This action cannot be undone. You can't edit or re-answer this question after saving."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-full space-x-4 flex items-center justify-end">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-900"
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </ModalComponent>
  );
};

export default SaveModal;
