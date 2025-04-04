
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
  age: z.coerce.number().min(0, "Age must be at least 0").max(150, "Age must be less than 150"),
  zipCode: z.string().refine(
    (value) => {
      const zipCodeRegex = /^\d{5}$/;
      return zipCodeRegex.test(value);
    }, 
    { message: "Zip code must be a 5-digit number" }
  ),
  income: z.string()
    .refine(
      (value) => /^\d*$/.test(value), 
      { message: "Income must contain only numbers" }
    )
    .refine(
      (value) => {
        const num = Number(value);
        return !isNaN(num) && num >= 0 && num <= 999999999;
      },
      { message: "Income must be between 0 and 999,999,999" }
    ),
});

type FormValues = z.infer<typeof formSchema> & {
  zipPrefixChanged?: boolean;
};

interface EditUserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: {
    age: number;
    zipCode: string;
    income: string;
  };
  onSubmit: (values: FormValues) => void;
  focusField?: 'age' | 'zipCode' | 'income';
}

export const EditUserInfoDialog: React.FC<EditUserInfoDialogProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSubmit,
  focusField,
}) => {
  const ageInputRef = useRef<HTMLInputElement>(null);
  const zipCodeInputRef = useRef<HTMLInputElement>(null);
  const incomeInputRef = useRef<HTMLInputElement>(null);
  
  const [zipPrefix, setZipPrefix] = useState<string>("");

  const form = useForm<Omit<FormValues, 'zipPrefixChanged'>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: initialValues.age,
      zipCode: initialValues.zipCode,
      income: initialValues.income.replace(/\$|,/g, ""),
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        age: initialValues.age,
        zipCode: initialValues.zipCode,
        income: initialValues.income.replace(/\$|,/g, ""),
      });
      setZipPrefix(initialValues.zipCode.slice(0, 3));
    }
  }, [initialValues, isOpen, form]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (focusField === 'age' && ageInputRef.current) {
          ageInputRef.current.focus();
        } else if (focusField === 'zipCode' && zipCodeInputRef.current) {
          zipCodeInputRef.current.focus();
        } else if (focusField === 'income' && incomeInputRef.current) {
          incomeInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, focusField]);

  const handleSubmit = (values: Omit<FormValues, 'zipPrefixChanged'>) => {
    const formattedIncome = `$${Number(values.income).toLocaleString()}`;
    
    const newZipPrefix = values.zipCode.slice(0, 3);
    const zipPrefixChanged = newZipPrefix !== zipPrefix;
    
    onSubmit({
      ...values,
      income: formattedIncome,
      zipPrefixChanged,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[rgba(67,83,255,1)]">Edit Your Information</DialogTitle>
          <DialogDescription className="text-[#6C757D]">
            Update your personal details to get accurate insurance quotes.
          </DialogDescription>
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
                    <Input 
                      type="number" 
                      min="0"
                      max="150"
                      {...field} 
                      ref={(e) => {
                        field.ref(e);
                        ageInputRef.current = e;
                      }}
                    />
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
                    <Input 
                      {...field} 
                      maxLength={5}
                      placeholder="Enter 5-digit zip code"
                      ref={(e) => {
                        field.ref(e);
                        zipCodeInputRef.current = e;
                      }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
                        field.onChange(value);
                      }}
                    />
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
                    <Input 
                      placeholder="Enter annual income" 
                      {...field} 
                      ref={(e) => {
                        field.ref(e);
                        incomeInputRef.current = e;
                      }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
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
