'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { FaPenToSquare, FaTrash } from "react-icons/fa6";

import 'react-datepicker/dist/react-datepicker.css';

import { createOrUpdateTreatment, deleteTreatment } from '@/actions/claim-treatment-create-update'; 
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TreatmentSchema } from '@/schemas'; 
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';

type Treatment = Array<zod.infer<typeof TreatmentSchema>>;
interface TreatmentFormProps {
  claimId: number;
  treatment: Treatment;
}

export default function TreatmentForm({ claimId, treatment }: TreatmentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [treatmentArr, setTreatmentArr] = useState<Treatment>(treatment);
  const [showBtn, setShowBtn] = useState<Boolean>(treatment.length > 0 ? true : false);
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [editingTreatment, setEditingTreatment] = useState<zod.infer<typeof TreatmentSchema> | null>(null); 
  
  const form = useForm<zod.infer<typeof TreatmentSchema>>({
    resolver: zodResolver(TreatmentSchema),
    defaultValues: {
      id: undefined,
      takenToHospital: true,
      hospitalName: '',
      dateOfAdmission: null,
      dateOfDischarge: null,
      currentlyBeingTreated: true,
      doctorName: '',
      doctorAddress: '',
      lastVisitDate: null,
      hasHealthInsurance: true,
      healthInsuranceProvider: '',
      policyNumber: '',
      receivesBenefits: true,
      claimId: claimId,
    },
  });

  const handleEditClick = (treatmentData: zod.infer<typeof TreatmentSchema>) => {
    setShowBtn(false);
    setError('');
    setSuccess('');
    setEditingTreatment(treatmentData);
    Object.keys(treatmentData).forEach((key) => {
      form.setValue(key as keyof zod.infer<typeof TreatmentSchema>, treatmentData[key as keyof typeof treatmentData]);
    });
  };

  const handleDeleteClick = (treatmentId: number | undefined) => {
    if (treatmentId && window.confirm('Are you sure you want to delete this treatment?')) {
      startTransition(() => {
        deleteTreatment(treatmentId).then((data: any) => {
          if (data.success) {
            setTreatmentArr((prev) => prev.filter((item) => item.id !== treatmentId));
            form.reset()
            setSuccess('Treatment deleted successfully');
          } else {
            setError('Failed to delete treatment.');
          }
        });
      });
    }
  };

  const onSubmit = (values: zod.infer<typeof TreatmentSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      createOrUpdateTreatment(values).then((data) => {
        setError(data.error);
        if (data?.success) {
          if (editingTreatment) {
            const updatedTreatments = treatmentArr.map((item) =>
              item.id === editingTreatment.id ? values : item
            );
            setTreatmentArr(updatedTreatments);
            setEditingTreatment(null);
          } else {
            setTreatmentArr([...treatmentArr, data.success as zod.infer<typeof TreatmentSchema>]);
          }
          setShowBtn(true);
        }
      });
    });
  };

  useEffect(() => {
    if (treatmentArr.length > 0) {
      setShowBtn(true);
    }
  }, [treatmentArr]);

  return (
    <>
      {treatmentArr.length > 0 && (
        <div className='mb-3'>
          {treatmentArr.map((item: zod.infer<typeof TreatmentSchema>) => (
            <div className='mb-1 flex justify-between rounded-md bg-lightpurple p-4' key={item?.id}>
              <div>
                <div>
                  <span className='font-semibold'>Taken to a hospital:</span> {item?.takenToHospital ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className='font-semibold'>Currently being treated:</span>{' '}
                  {item?.currentlyBeingTreated ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className='font-semibold'>Health insurance: </span>
                  {item?.hasHealthInsurance ? 'Yes' : 'No'}
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
            setShowBtn(false);
            form.reset(); // Reset form when adding new treatment
          }}
        >
          Add Treatment
        </Button>
      )}

      {!treatmentArr.length || !showBtn ? (
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
              name='takenToHospital'
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
                  <FormLabel className='text-md'>Were you taken to a hospital?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('takenToHospital') && (
              <>
                <FormField
                  control={form.control}
                  name='hospitalName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of hospital </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Name of hospital' value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='dateOfAdmission'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of admission</FormLabel>
                      <FormControl>
                        <div className='flex w-full flex-col'>
                          <DatePicker
                            className='h-12 w-full rounded-md border border-input px-3 py-2 shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                            dateFormat='yyyy-MM-dd'
                            onChange={(date) => field.onChange(date)}
                            placeholderText='YYYY-MM-dd'
                            selected={field.value}
                            showYearDropdown
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='dateOfDischarge'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of discharge</FormLabel>
                      <FormControl>
                        <div className='flex w-full flex-col'>
                          <DatePicker
                            className='h-12 w-full rounded-md border border-input px-3 py-2 shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                            dateFormat='yyyy-MM-dd'
                            onChange={(date) => field.onChange(date)}
                            placeholderText='YYYY-MM-dd'
                            selected={field.value}
                            showYearDropdown
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name='currentlyBeingTreated'
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
                  <FormLabel className='text-md'>Are you currently being treated?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('currentlyBeingTreated') && (
              <>
                <FormField
                  control={form.control}
                  name='doctorName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of doctor</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Name of doctor' value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='doctorAddress'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Doctor address' value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastVisitDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last visit date</FormLabel>
                      <FormControl>
                        <div className='flex w-full flex-col'>
                          <DatePicker
                            className='h-12 w-full rounded-md border border-input px-3 py-2 shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                            dateFormat='yyyy-MM-dd'
                            onChange={(date) => field.onChange(date)}
                            placeholderText='YYYY-MM-dd'
                            selected={field.value}
                            showYearDropdown
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name='hasHealthInsurance'
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
                  <FormLabel className='text-md'>Do you have health insurance?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('hasHealthInsurance') && (
              <>
                <FormField
                  control={form.control}
                  name='healthInsuranceProvider'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Health Insurance provider</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Name of Health Insurance provider' value={field.value ?? ''} />
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
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Policy Number' value={field.value ?? ''} />
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
                {treatmentArr.length > 0 && <Button className='w-full p-6 mr-2' disabled={isPending} onClick={() => { setEditingTreatment(null); setShowBtn(true); form.reset(); }}  type='button'>
                Cancel
                </Button>}
                <Button className='w-full p-6' disabled={isPending} type='submit'>
                {editingTreatment ? 'Update Treatment' : 'Save Treatment'}
                </Button>
            </div>
          </form>
        </Form>
      ) : ""}
    </>
  );
}
