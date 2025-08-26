import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGlobalStore } from '@/store/use-global-store';

/**
 * A provider that renders an alert dialog based on the global state. The dialog
 * displays a title, description, and actions for confirmation and cancellation.
 * It uses the global store to manage the visibility and configuration of the alert dialog.
 *
 * @return Returns the AlertDialog component if `alertOpen` is true;
 * otherwise, returns null to indicate no dialog is displayed.
 */
export function AlertDialogProvider() {
  const { alertOpen, closeAlert, alertConfig } = useGlobalStore();

  const {
    title = 'Confirmation Required',
    description = 'Are you sure you want to perform this action?',
    confirmLabel = 'Continue',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
  } = alertConfig || {};

  const handleConfirm = () => {
    onConfirm?.();
    closeAlert();
  };

  const handleCancel = () => {
    onCancel?.();
    closeAlert();
  };

  if (!alertOpen) return null;

  return (
    <AlertDialog open={alertOpen} onOpenChange={closeAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm}>{confirmLabel}</AlertDialogAction>
          <AlertDialogCancel onClick={handleCancel}>{cancelLabel}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
