'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WitnessSchema } from '@/schemas';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';
import { createOrUpdateWitness } from '@/actions/claim-witness-create-update';

type Witness = Array<zod.infer<typeof WitnessSchema>>;

interface WitnessFormProps {
  claimId: string | undefined;
  witness: Witness;
}

export default function WitnessForm({ claimId, witness }: WitnessFormProps) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [witnessArr, setWitnessArr] = useState<Witness>(witness || []);
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof WitnessSchema>>({
    resolver: zodResolver(WitnessSchema),
    defaultValues: {
      id: null,
      witnessFirstName: '',
      witnessLastName: '',
      witnessPhone: '',
      claimId,
    },
  });

  const onError = (errors: any) => {
    console.log('Validation errors:', errors); // Debug validation issues
  };

  const onSubmit = async (values: zod.infer<typeof WitnessSchema>) => {
    setError('');
    setSuccess('');
    startTransition(async () => {
      try {
        console.log("values", values)
        const response: any = await createOrUpdateWitness(values);
        if (response.error) {
          setError(response.error);
        } else {
          // Add the newly created witness to the local state
          setWitnessArr([...witnessArr, response.success]);
          form.reset();
          setShowBtn(true); // Show "Add Witness" button
          setSuccess('Witness added successfully!');
        }
      } catch (err) {
        console.error('Error creating witness:', err);
        setError('Failed to save witness. Please try again.');
      }
    });
  };

  useEffect(() => {
    if (witnessArr.length > 0) {
      setShowBtn(true);
    }
  }, [witnessArr]);

  return (
    <>
      {showBtn && (
        <Button
          className="w-[120px] p-6"
          onClick={() => {
            form.reset();
            setShowBtn(false);
          }}
        >
          Add Witness
        </Button>
      )}

      {!showBtn && (
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit, onError)} // Properly handle submission
          >
            <FormField
              control={form.control}
              name="witnessFirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name of Witness</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter First Name of Witness" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="witnessLastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name of Witness</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Witness Last Name" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="witnessPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Witness Phone" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="claimId"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Claim ID</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="grid grid-cols-4 gap-4">
              <Button
                onClick={() => {
                  form.reset();
                  setShowBtn(true);
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button className="cursor-pointer" type="submit">
                Save Witness
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
