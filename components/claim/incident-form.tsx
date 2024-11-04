'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { createOrUpdateIncident } from '@/actions/claim-incident-create-update';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { IncidentSchema } from '@/schemas'; // Assuming you already have IncidentSchema
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';

type Incident = Array<zod.infer<typeof IncidentSchema>>;
interface IncidentFormProps {
  claimId: number;
  incident: Incident; 
}

export default function IncidentForm({ claimId, incident }: IncidentFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [incidentArr, setIncidentArr] = useState<Incident>(incident);
  const [success, setSuccess] = useState<string | undefined>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editingIncident, setEditingIncident] = useState<zod.infer<typeof IncidentSchema> | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof IncidentSchema>>({
    resolver: zodResolver(IncidentSchema),
    defaultValues: {
      injured: true,
      nameOfInjuredParty: '',
      relationshipToInjuredParty: '',
      dateOfIncident: new Date(),
      incidentLocation: '',
      inScopeOfEmployment: new Date(),
      descriptionOfAccident: '',
      policeReportFiled: false,
      precinct: '',
      officerNameAndDescription: '',
      accidentReportNumber: '',
      pictureTaken: false,
      pictureUpload: '',
      missedTimeFromWorkOrSchool: '',
      approximateLossOfEarnings: '',
      approximateMissedTimeFromSchool: '',
      haveRepresentation: false,
      attorneyName: '',
      reasonForRemovingRepresentation: '',
      claimId: claimId,
    },
  });

  const handleEditClick = (incidentData: zod.infer<typeof IncidentSchema>) => {
    setIsEdit(true);
    setEditingIncident(incidentData);
  
    (Object.keys(incidentData) as (keyof zod.infer<typeof IncidentSchema>)[]).forEach((key) => {
      form.setValue(key, incidentData[key]); 
    });
  };

  const onSubmit = (values: zod.infer<typeof IncidentSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      createOrUpdateIncident(values).then((data) => {
        setError(data.error);

        if (data.success) {
          if (isEdit && editingIncident) {
            // Update existing incident
            const updatedIncidents = incidentArr.map((item) =>
              item.id === editingIncident.id ? values : item
            );
            setIncidentArr(updatedIncidents);
          } else {
            // Create new incident
            setIncidentArr([...incidentArr, data.success as zod.infer<typeof IncidentSchema>]);
          }
        }
        setIsEdit(false); // Reset edit mode after submission
      });
    });
  };

  return (
    <>
      {incidentArr.length > 0 && !isEdit ? (
        <div>
          {incidentArr.map((item: zod.infer<typeof IncidentSchema>) => (
            <div className='space-5 flex justify-between rounded-md bg-lightpurple p-4' key={item?.id}>
              <div>
                <div>
                  <span className='font-semibold'>Injured:</span> {item?.injured ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className='font-semibold'>Police Report:</span> {item?.policeReportFiled ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className='font-semibold'>Missed time from work or School:</span>{' '}
                  {item?.missedTimeFromWorkOrSchool}
                </div>
              </div>
              <div>
                <span className='cursor-pointer' onClick={() => handleEditClick(item)}>Edit</span>
              </div>
            </div>
          ))}
        </div>
      ) : ""}
      {!incidentArr.length || isEdit ? (
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            {/* Injured */}
            <FormField
              control={form.control}
              name='injured'
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
                  <FormLabel className='text-md'>Were you injured in this incident?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!form.watch('injured') && (
              <>
                <FormField
                  control={form.control}
                  name='nameOfInjuredParty'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name of Injured Party</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter Name' value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='relationshipToInjuredParty'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Injured Party</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter Relationship' value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Date of Incident */}
            <FormField
              control={form.control}
              name='dateOfIncident'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Incident</FormLabel>
                  <FormControl>
                    <div className='flex w-full flex-col'>
                      <DatePicker
                        className='h-12 w-full rounded-md border border-input px-3 py-2 shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        dateFormat='yyyy-MM-dd'
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        showYearDropdown
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Incident Location */}
            <FormField
              control={form.control}
              name='incidentLocation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter Incident Location' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* In Scope of Employment */}
            <FormField
              control={form.control}
              name='inScopeOfEmployment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>In Scope of Employment</FormLabel>
                  <FormControl>
                    <div className='flex w-full flex-col'>
                      <DatePicker
                        className='h-12 w-full rounded-md border border-input px-3 py-2 shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                        dateFormat='yyyy-MM-dd'
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        showYearDropdown
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description of Accident */}
            <FormField
              control={form.control}
              name='descriptionOfAccident'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Accident</FormLabel>
                  <FormControl>
                    <textarea {...field} className='w-full rounded-md border p-2' placeholder='Enter Description' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='policeReportFiled'
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
                  <FormLabel className='text-md'>Police Report?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('policeReportFiled') && (
              <>
                <FormField
                  control={form.control}
                  name='precinct'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precinct</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter Precinct' value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='officerNameAndDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Officer Name and Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter Officer's Name and Description"
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {!form.watch('policeReportFiled') && (
              <FormField
                control={form.control}
                name='accidentReportNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accident/Complaint Report Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Accident/Complaint Report Number' value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Picture Taken */}
            <FormField
              control={form.control}
              name='pictureTaken'
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
                  <FormLabel className='text-md'>Was a picture taken?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('pictureTaken') && (
              <FormField
                control={form.control}
                name='pictureUpload'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Picture Upload</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Upload Picture' value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Missed Time from Work or School */}
            <FormField
              control={form.control}
              name='missedTimeFromWorkOrSchool'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Missed time from work or school?</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={'Work'}>Work</SelectItem>
                      <SelectItem value={'School'}>School</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('missedTimeFromWorkOrSchool') == 'Work' && (
              <FormField
                control={form.control}
                name='approximateLossOfEarnings'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approximate Loss of Earnings</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter Approximate Loss' value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('missedTimeFromWorkOrSchool') == 'School' && (
              <FormField
                control={form.control}
                name='approximateMissedTimeFromSchool'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approximate Missed Time from School</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter Missed Time from School' value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Representation */}
            <FormField
              control={form.control}
              name='haveRepresentation'
              render={({ field }) => (
                <FormItem className='mb-3 flex items-center'>
                  <FormControl>
                    <input
                      checked={field.value}
                      className='mr-3 block h-[20px] w-[20px]'
                      onChange={field.onChange}
                      type='checkbox'
                    />
                  </FormControl>
                  <FormLabel className='text-md'>Do you have representation?</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('haveRepresentation') && (
              <>
                <FormField
                  control={form.control}
                  name='attorneyName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attorney Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Attorney's Name" value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='reasonForRemovingRepresentation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Removing Representation</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter Reason' value={field.value ?? ''} />
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
                {isEdit && <Button className='w-full p-6 mr-2' disabled={isPending} onClick={() => setIsEdit(false)}  type='button'>
                Cancel
                </Button> }
                <Button className='w-full p-6' disabled={isPending} type='submit'>
                  {isEdit ? 'Update' : 'Save'}
                </Button>
            </div>
          </form>
        </Form>
      ) : ""}
    </>
  );
}
