import { CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type NoItemsFoundProps = {
  onClick: () => void;
};

/**
 * Renders a message indicating that no items were found along with an option to add new items.
 *
 * @param {Object} props - The properties object.
 * @param {function} props.onClick - The callback function to be executed when the "Add new item" button is clicked.
 *
 * @return A React component displaying a "No items found" message and a button to add new items.
 */
export default function NoItemFound({ onClick }: NoItemsFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CircleOff className="text-primary mb-2" />
      <h3 className="text-lg font-medium">No items found</h3>
      <p className="text-foreground/60 mt-1 text-sm">Try add new items</p>
      <Button variant="outline" className="mt-4" onClick={onClick}>
        Add new item
      </Button>
    </div>
  );
}
