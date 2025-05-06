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
import { ModifyPaymentForm } from "../forms/payment/edit-form"



export function PaymentModifySheet({children, paymentData}) {

  return (
    <Sheet>
        {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit class</SheetTitle>
          <SheetDescription>
            Make changes to the class here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <SheetContent>
            <div className="grid gap-4 p-8">
              <ModifyPaymentForm paymentData={paymentData} />
            </div>
        </SheetContent>
      </SheetContent>
    </Sheet>
  )
}
