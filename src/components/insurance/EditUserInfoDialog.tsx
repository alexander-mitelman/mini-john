
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  age: z.coerce.number().min(18, "Age must be at least 18").max(120, "Age must be less than 120"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  income: z.string().min(1, "Income is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: {
    age: number;
    zipCode: string;
    income: string;
  };
  onSubmit: (values: FormValues) => void;
}

export const EditUserInfoDialog: React.FC<EditUserInfoDialogProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: initialValues.age,
      zipCode: initialValues.zipCode,
      income: initialValues.income.replace("$", "").replace(",", ""),
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Format the income to include $ and commas
    const formattedIncome = `$${Number(values.income).toLocaleString()}`;
    onSubmit({
      ...values,
      income: formattedIncome,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[rgba(67,83,255,1)]">Edit Your Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income</FormLabel>
                  <FormControl>
                    <Input placeholder="100000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-[rgba(67,83,255,1)] hover:bg-[rgba(67,83,255,0.8)]"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
