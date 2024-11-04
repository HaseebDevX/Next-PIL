'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { InjuryPoint, InjurySide, InjuryType } from '@prisma/client';
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

import { createOrUpdateInjury, deleteInjury } from '@/actions/claim-injury-create-update'; // Assuming you have deleteInjury
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { InjurySchema } from '@/schemas';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';

type Injury = Array<zod.infer<typeof InjurySchema>>;
interface InjuryFormProps {
  claimId: number;
  injury: Injury;
}

export default function InjuryForm({ claimId, injury }: InjuryFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [injuryArr, setInjuryArr] = useState<Injury>(injury);
  const [showBtn, setShowBtn] = useState<Boolean>(false);
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [editingInjury, setEditingInjury] = useState<zod.infer<typeof InjurySchema> | null>(null); // To handle edit state

  const form = useForm<zod.infer<typeof InjurySchema>>({
    resolver: zodResolver(InjurySchema),
    defaultValues: {
      id: undefined,
      injuryPoint: '' as InjuryPoint,
      injurySide: '' as InjurySide,
      injuryType: '' as InjuryType,
      claimId: claimId as number,
    },
  });

  // Function to handle form submission for both creating and updating
  const onSubmit = (values: zod.infer<typeof InjurySchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      createOrUpdateInjury(values).then((data) => {
        setError(data.error);
        if (data?.success) {
          if (editingInjury) {
            // Update existing injury
            const updatedInjuries = injuryArr.map((item) =>
              item.id === editingInjury.id ? values : item
            );
            setInjuryArr(updatedInjuries);
            setEditingInjury(null); // Clear edit state after update
          } else {
            // Add new injury
            setInjuryArr([...injuryArr, data.success as zod.infer<typeof InjurySchema>]);
          }
          setShowBtn(true); // Show "Add Injury" button again
        }
      });
    });
  };

  const handleEditClick = (injuryData: zod.infer<typeof InjurySchema>) => {
    setShowBtn(false); 
    setError('');
    setSuccess('');
    setEditingInjury(injuryData); 
    Object.keys(injuryData).forEach((key) => {
      form.setValue(key as keyof zod.infer<typeof InjurySchema>, injuryData[key as keyof typeof injuryData]); 
    });
  };

  
  const handleDeleteClick = (injuryId: number | undefined) => {
    if (injuryId && window.confirm('Are you sure you want to delete this injury?')) {
      startTransition(() => {
        deleteInjury(injuryId).then((data) => {
          if (data.success) {
            setInjuryArr((prevInjuries) => prevInjuries.filter((item) => item.id !== injuryId));
            form.reset()
            setSuccess('Injury deleted successfully!');
          } else {
            setError('Failed to delete injury.');
          }
        });
      });
    }
  };

  useEffect(() => {
    if (injuryArr.length > 0) {
      setShowBtn(true);
    }
  }, [injuryArr]);

  return (
    <>
      {injuryArr.length > 0 && (
        <div className='mb-3'>
          {injuryArr.map((item: zod.infer<typeof InjurySchema>) => (
            <div className='mb-1 flex justify-between rounded-md bg-lightpurple p-4' key={item?.id}>
              <div>
                <div>
                  <span className='font-semibold'>Injury position:</span> {item?.injuryPoint}
                </div>
                <div>
                  <span className='font-semibold'>Injury side:</span> {item?.injurySide}
                </div>
                <div>
                  <span className='font-semibold'>Injury type: </span> {item?.injuryType}
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
            form.reset(); // Reset form fields when adding a new injury
          }}
        >
          Add Injury
        </Button>
      )}

      {!injuryArr.length || !showBtn ? (
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            {/* Injury Form Fields */}
            <div className='flex space-x-3'>
              <div className='w-1/3'>
                <FormField
                  control={form.control}
                  name='injuryPoint'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Point</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={form.watch('injuryPoint')} // Ensure value is set correctly
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(InjuryPoint).map((el) => (
                            <SelectItem key={el} value={el}>
                              {el.replaceAll('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='w-1/3'>
                <FormField
                  control={form.control}
                  name='injurySide'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Side</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={form.watch('injurySide')} // Ensure value is set correctly
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(InjurySide).map((el) => (
                            <SelectItem key={el} value={el}>
                              {el.replaceAll('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='w-1/3'>
                <FormField
                  control={form.control}
                  name='injuryType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Type</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        value={form.watch('injuryType')} // Ensure value is set correctly
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(InjuryType).map((el) => (
                            <SelectItem key={el} value={el}>
                              {el.replaceAll('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
              {injuryArr.length > 0 && <Button className='w-full p-6 mr-2' disabled={isPending} onClick={() => { setEditingInjury(null); setShowBtn(true); form.reset();}}  type='button'>
                Cancel
                </Button>}
                <Button className='w-full p-6' disabled={isPending} type='submit'>
                  {editingInjury ? 'Update Injury' : 'Save Injury'}
                </Button>
            </div>
          </form>
        </Form>
      ) : null}
    </>
  );
}
