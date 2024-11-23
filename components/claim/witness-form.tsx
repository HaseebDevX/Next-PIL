'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { FaPenToSquare, FaTrash } from 'react-icons/fa6';

import { createOrUpdateWitness, 
    // deleteWitness 
} from '@/actions/claim-witness-create-update';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WitnessSchema } from '@/schemas';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';

type Witness = Array<zod.infer<typeof WitnessSchema>>;
interface WitnessFormProps {
  claimId:  string | undefined;
  witness: Witness;
}

export default function WitnessForm(
  {
    claimId,
    witness
  }: WitnessFormProps
) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [witnessArr, setWitnessArr] = useState<Witness>([]);
  const [showBtn, setShowBtn] = useState<Boolean>(false);
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [editingWitness, setEditingWitness] = useState<zod.infer<typeof WitnessSchema> | null>(null);

  const form = useForm<zod.infer<typeof WitnessSchema>>({
    resolver: zodResolver(WitnessSchema),
    defaultValues: {
      id: undefined,
      witnessFirstName: '',
      witnessLastName: '',
      witnessPhone: '',
      claimId: claimId,
    },
  });

  const handleEditClick = () => {
    setShowBtn(false);
    // setEditingWitness(witnessData);

    // Object.keys(witnessData).forEach((key) => {
    //   form.setValue(key as keyof zod.infer<typeof WitnessSchema>, witnessData[key as keyof typeof witnessData]); // Cast the key properly
    // });
  };

  const handleDeleteClick = (witnessId: number | null | undefined) => {
    if (witnessId && window.confirm('Are you sure you want to delete this witness?')) {
      startTransition(() => {
        // Assuming you have a delete API function
        // deleteWitness(witnessId).then((data) => {
        //   if (data.success) {
        //     setWitnessArr((prevWitnesses) => prevWitnesses.filter((item) => item.id !== witnessId));
        //     form.reset()
        //     setSuccess("Witness deleted successfully!");
        //   } else {
        //     setError("Failed to delete witness.");
        //   }
      });
      //   });
    }
  };
//Todo tahir
  const onSubmit = (values: zod.infer<typeof WitnessSchema>) => {
    setError('');
    setSuccess('');
        console.log(values)

    startTransition(() => {
        //   createOrUpdateWitness(values).then((data) => {
        //     setError(data.error);
        //     if (data?.success) {
        //       if (editingWitness) {
        //         // Update existing witness
        //         const updatedWitnesses = witnessArr.map((item) =>
        //           item.id === editingWitness.id ? values : item
        //         );
        //         setWitnessArr(updatedWitnesses);
        //         setEditingWitness(null); // Clear editing state after update
        //       } else {
        //         // Add new witness
        //         setWitnessArr([...witnessArr, data.success as zod.infer<typeof WitnessSchema>]);
        //       }
        //       setShowBtn(true); // Show "Add Witness" button again
        //     }
        //   });
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
          className='w-[120px] p-6'
          onClick={() => {
            setShowBtn(false);
            form.reset();
          }}
        >
          Add Witness
        </Button>
      )}

      {!witnessArr.length || !showBtn ? (
        <Form {...form}>
          <form
            className='space-y-4'
              onSubmit={form.handleSubmit(onSubmit)}
          >
            <>
              <FormField
                control={form.control}
                name='witnessFirstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name of Witness</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter First Name of Witness' value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='witnessLastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name of Witness</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter Witness Last Name' value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='witnessPhone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter Witness Phone' value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>

            <FormField
              control={form.control}
              name='claimId'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormLabel>Claim ID</FormLabel>
                  <FormControl>{/* <Input {...field} value={claimId} /> */}</FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className='grid grid-cols-4 gap-4'>
              {/* {witnessArr.length > 0 &&  */}
              <Button
                disabled={isPending}
                //  onClick={() => { setEditingWitness(null); setShowBtn(true); form.reset(); }}
                type='button'
              >
                Cancel
              </Button>

              <Button disabled={isPending} type='submit'>
                Save Witness
              </Button>
            </div>
          </form>
        </Form>
      ) : null}
    </>
  );
}
