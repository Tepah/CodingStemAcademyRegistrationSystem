import React from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ModifyPaymentForm } from "../forms/payment/edit-form"



export function PaymentModifySheet({ children, paymentData }) {
  const formRef = React.useRef(null);

  const handleFormSubmit = () => {
    // Trigger the form's submit function programmatically
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <Sheet>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Payment</SheetTitle>
          <SheetDescription>
            Modify donation details and save changes.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto pr-4 my-4 mx-2 border rounded-lg">
          <ModifyPaymentForm paymentData={paymentData} formRef={formRef} />
        </div>

        <SheetFooter className="flex flex-row-reverse justify-between mt-auto pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleFormSubmit}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
