'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

import { createOrUpdateWitness, deleteWitness } from '@/actions/claim-witness-create-update';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WitnessSchema } from '@/schemas'; 
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';

type Witness = Array<zod.infer<typeof WitnessSchema>>;
interface WitnessFormProps {
  claimId: number;
  witness: Witness;
}

export default function WitnessForm({ claimId, witness }: WitnessFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [witnessArr, setWitnessArr] = useState<Witness>(witness);
  const [showBtn, setShowBtn] = useState<Boolean>(false);
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [editingWitness, setEditingWitness] = useState<zod.infer<typeof WitnessSchema> | null>(null); 

  const form = useForm<zod.infer<typeof WitnessSchema>>({
    resolver: zodResolver(WitnessSchema),
    defaultValues: {
      id: undefined,
      isWitness: true,
      witnessName: '',
      witnessPhone: '',
      claimId: claimId as number,
    },
  });

  const handleEditClick = (witnessData: zod.infer<typeof WitnessSchema>) => {
    setShowBtn(false);
    setEditingWitness(witnessData);

    Object.keys(witnessData).forEach((key) => {
      form.setValue(key as keyof zod.infer<typeof WitnessSchema>, witnessData[key as keyof typeof witnessData]); // Cast the key properly
    });
  };

  const handleDeleteClick = (witnessId: number | null | undefined) => {
    if (witnessId && window.confirm("Are you sure you want to delete this witness?")) {
      startTransition(() => {
        // Assuming you have a delete API function
        deleteWitness(witnessId).then((data) => {
          if (data.success) {
            setWitnessArr((prevWitnesses) => prevWitnesses.filter((item) => item.id !== witnessId));
            form.reset()
            setSuccess("Witness deleted successfully!");
          } else {
            setError("Failed to delete witness.");
          }
        });
      });
    }
  };

  const onSubmit = (values: zod.infer<typeof WitnessSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      createOrUpdateWitness(values).then((data) => {
        setError(data.error);
        if (data?.success) {
          if (editingWitness) {
            // Update existing witness
            const updatedWitnesses = witnessArr.map((item) =>
              item.id === editingWitness.id ? values : item
            );
            setWitnessArr(updatedWitnesses);
            setEditingWitness(null); // Clear editing state after update
          } else {
            // Add new witness
            setWitnessArr([...witnessArr, data.success as zod.infer<typeof WitnessSchema>]);
          }
          setShowBtn(true); // Show "Add Witness" button again
        }
      });
    });
  };

  useEffect(() => {
    if (witnessArr.length > 0) {
      setShowBtn(true);
    }
  }, [witnessArr]);

  return (
    <>
      {witnessArr.length > 0 && (
        <div className='mb-3'>
          {witnessArr.map((item: zod.infer<typeof WitnessSchema>) => (
            <div className='mb-1 flex justify-between rounded-md bg-lightpurple p-4' key={item?.id}>
              <div>
                <div>
                  <span className='font-semibold'>Witness:</span> {item?.isWitness ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className='font-semibold'>Witness Name:</span> {item?.witnessName}
                </div>
                <div>
                  <span className='font-semibold'>Witness Phone: </span>
                  {item?.witnessPhone}
                </div>
              </div>
              <div className='flex space-x-4'>
                <span className='cursor-pointer' onClick={() => handleEditClick(item)}>
                  <FaPenToSquare />
                </span>
                <span className='cursor-pointer text-red-600' onClick={() => handleDeleteClick(item.id)}>
                  <FaTrash />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBtn && (
        <Button
          className='w-[120px] p-6'
          onClick={() => {
            setShowBtn(false); // Hide add button when showing the form
            form.reset(); // Reset form fields when adding a new witness
          }}
        >
          Add Witness
        </Button>
      )}

      {!witnessArr.length || !showBtn ? (
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isWitness'
              render={({ field }) => (
                <FormItem className='mt-3 flex items-center'>
                  <FormControl>
                    <input
                      checked={field.value}
                      className='mr-3 block h-[20px] w-[20px]'
                      onChange={field.onChange}
                      type='checkbox'
                    />
                  </FormControl>
                  <FormLabel className='text-md'>Were there any Witnesses?*</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('isWitness') && (
              <>
                <FormField
                  control={form.control}
                  name='witnessName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Witness</FormLabel>
                      <FormControl>
                        <Input {...field}  placeholder='Enter Name of Witness' value={field.value ?? ''} />
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
                      <FormLabel>Witness Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter Witness Phone' value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name='claimId'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormLabel>Claim ID</FormLabel>
                  <FormControl>
                    <Input {...field} value={claimId} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className='grid grid-cols-2 gap-4'>
                 {witnessArr.length > 0 && 
                 <Button className='w-full p-6 mr-2' disabled={isPending} onClick={() => { setEditingWitness(null); setShowBtn(true); form.reset(); }}  type='button'>
                Cancel
                </Button> }
                <Button className='w-full p-6' disabled={isPending} type='submit'>
                  {editingWitness ? 'Update Witness' : 'Save Witness'}
                </Button>
            </div>
          </form>
        </Form>
      ) : null}
    </>
  );
}
