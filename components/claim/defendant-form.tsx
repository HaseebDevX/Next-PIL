'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { DefendantRole } from '@prisma/client';
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

import { createOrUpdateDefendant, deleteDefendant } from '@/actions/claim-defendant-create-update';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DefendantSchema } from '@/schemas';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';

type Defendant = Array<zod.infer<typeof DefendantSchema>>;
interface InjuryFormProps {
  claimId: number;
  defendant: Defendant;
}

export default function DefendantForm({ claimId, defendant }: InjuryFormProps) {
  const [error, setError] = useState<string | undefined>('');
  const [defendantArr, setDefendantArr] = useState<Defendant>(defendant);
  const [success, setSuccess] = useState<string | undefined>('');
  const [showBtn, setShowBtn] = useState<Boolean>(defendant.length > 0 ? true : false);
  const [isPending, startTransition] = useTransition();
  const [editingDefendant, setEditingDefendant] = useState<zod.infer<typeof DefendantSchema> | null>(null);

  const form = useForm<zod.infer<typeof DefendantSchema>>({
    resolver: zodResolver(DefendantSchema),
    defaultValues: {
      id: undefined,
      name: '',
      phone: '',
      address: '',
      role: '' as DefendantRole,
      insuranceCarrier: '',
      policyHolder: '',
      policyNumber: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      vehicleColor: '',
      vehiclePlateNumber: '',
      vehicleRegisteredState: '',
      claimId: claimId as number,
    },
  });

  const onSubmit = (values: zod.infer<typeof DefendantSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      createOrUpdateDefendant(values).then((data) => {
        setError(data.error);
        if (data?.success) {
          if (editingDefendant) {
            const updatedDefendants = defendantArr.map((item) =>
              item.id === editingDefendant.id ? values : item
            );
            setDefendantArr(updatedDefendants);
            setShowBtn(true);
            setEditingDefendant(null);
          } else {
            setDefendantArr([...defendantArr, data.success as zod.infer<typeof DefendantSchema>]);
          }
        }
      });
    });
  };

  const handleEditClick = (defendantData: zod.infer<typeof DefendantSchema>) => {
    setEditingDefendant(defendantData);
    setShowBtn(false)
    setError('');
    setSuccess('');
    Object.keys(defendantData).forEach((key) => {
      form.setValue(key as keyof zod.infer<typeof DefendantSchema>, defendantData[key as keyof typeof defendantData]);
    });
  };

  
  const handleDeleteClick = (id: number | undefined) => {
    if (id && window.confirm('Are you sure you want to delete this defendant?')) {
      startTransition(() => {
        deleteDefendant(id).then((data: any) => {
          if (data.success) {
            setDefendantArr(defendantArr.filter((item) => item.id !== id));
            form.reset(); 
            setSuccess('Defendant deleted successfully!');
          } else {
            setError('Failed to delete defendant.');
          }
        });
      });
    }
  };

  return (
    <>
      {defendantArr.length > 0 && (
        <div className='mb-3'>
          {defendantArr.map((item: zod.infer<typeof DefendantSchema>) => (
            <div className='mb-1 flex justify-between rounded-md bg-lightpurple p-4' key={item?.id}>
              <div>
                <div>
                  <span className='font-semibold'>Defendant Name:</span> {item?.name}
                </div>
                <div>
                  <span className='font-semibold'>Defendant Address:</span> {item?.address}
                </div>
                <div>
                  <span className='font-semibold'>Defendant Role: </span>
                  {item?.role}
                </div>
              </div>
              <div className='flex space-x-4'>
                <span className='cursor-pointer' onClick={() => handleEditClick(item)}><FaPenToSquare /></span>
                <span className='cursor-pointer text-red-600' onClick={() => handleDeleteClick(item.id)}><FaTrash /></span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showBtn && (
        <Button
          className='w-[120px] p-6'
          onClick={() => {
            setShowBtn(false);
          }}
        >
          Add Defendant
        </Button>
      )}
      {!defendantArr.length || !showBtn ? (
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter Incident Location' type='number' value={undefined} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Name' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Phone' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Address' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Role</FormLabel>
                  <Select
                    // need to set the default value does not come from form defaults
                    disabled={isPending}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(DefendantRole).map((el) => (
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
            <FormField
              control={form.control}
              name='insuranceCarrier'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Insurance Carrier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Insurance Carrier' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='policyHolder'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Policy Holder</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Policy Holder' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='policyNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Policy Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Policy Number' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p>
              Fill the below if only for Car Accident, Trucking Accident, Motorcycle Accident or Ride-Share Accident
            </p>
            <FormField
              control={form.control}
              name='vehicleMake'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Vehicle Make</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Vehicle Make ' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleModel'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Vehicle Model</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Vehicle Model' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleYear'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Vehicle Year</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Vehicle Year' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleColor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Vehicle Color</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Vehicle Color' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehiclePlateNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Vehicle Plate Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Vehicle Plate Number' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='vehicleRegisteredState'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Defendant Vehicle Registered State</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Defendant Vehicle Registered State' value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='claimId'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormLabel>Claim ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter Reason' value={claimId} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className='grid grid-cols-2 gap-4'>
            {defendantArr.length > 0 && <Button className='w-full p-6 mr-2' disabled={isPending} onClick={() => { setEditingDefendant(null); setShowBtn(true); form.reset(); }}  type='button'>
                Cancel
              </Button>}
              <Button className='w-full p-6' disabled={isPending} type='submit'>
                {editingDefendant ? 'Update Defendant' : 'Save Defendant'}
              </Button>
            </div>
          </form>
        </Form>
      ) : ""}
    </>
  );
}