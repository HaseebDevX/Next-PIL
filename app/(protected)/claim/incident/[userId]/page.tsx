'use client';
import { IncidentSchema } from '@/schemas';
import React, { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { ClaimType, Relationship } from '@prisma/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardHeading } from '@/components/claim/cardHeading';
import ThemeChip from '@/components/ui/chip';
import { SimpleText } from '@/components/claim/simpleText';
import DatePicker from 'react-datepicker';
import { Input } from '@/components/ui/input';
import ThemeRadioGroup from '@/components/ui/radio-group/radio-group';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';
import { createOrUpdateIncident } from '@/actions/claim-incident-create-update';
import { useParams, useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';
import { createClaim } from '@/actions/claim-create';
import RadioGroupDemo from '@/components/ui/radio-group/radio-group';
export default function CreateNewClaim() {
  const params = useParams();
  const userId = params?.userId;
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [dateCreated, setDateCreated] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<zod.infer<typeof IncidentSchema>>({
    resolver: zodResolver(IncidentSchema),
    defaultValues: {
      date: new Date(),
      // location: '',
      // description: '',
      // policeOfficer: '',
      // reportNumber: '',
      // amountLoss: '',
      // timeLoss: '',
      // priorRepresentationReason: '',

      injured: false,
      id: undefined,
      time: new Date(),
      timeOfDay: 'PM',
      workRelated: true,
      policeReportCompleted: false,
      policeStation: '',
      reportCompleted: false,
      supportingDocument: false,
      supportingDocumentUpload: '',
      lostEarning: false,
      namePriorRepresentation: '',
      priorRepresentation: false,
      claimId: '',
    },
  });
  const selectedClaimType = form.watch('claimType');

  useEffect(() => {
    if (selectedClaimType) {
      createNewClaim();
    }
  }, [selectedClaimType]);
  const onSubmit = (values: zod.infer<typeof IncidentSchema>) => {
    console.log(values);

    setError('');
    setSuccess('');
    startTransition(() => {
      createOrUpdateIncident(values).then((data) => {
        console.log(data);

        setError(data.error);
        if (data?.success) {
          setSuccess('Incident Created');
          router.push('/claim');
        }
      });
    });
  };
  const createNewClaim = async () => {
    const payload = {
      userId: userId,
      relationship: Relationship.Other,
      type: selectedClaimType,
    };
    console.log(payload);

    await createClaim(payload).then((claim) => {
      console.log(claim);

      if (claim.success) {
        form.setValue('claimId', claim.success.id);
      } else {
        console.log("Can't create claim");
      }
    });
  };

  const [dob, setDob] = useState<Date | null>(new Date());

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const options = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];
  const [selectedOption, setSelectedOption] = useState('default');

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
    console.log('Selected:', value);
  };
  return (
    <div className='flex w-full flex-row justify-center  px-[10px] pt-2.5 md:px-0  md:pt-10 lg:px-0 xl:px-0'>
      <div className='w-full md:w-[499px]'>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            {!selectedClaimType && (
              <FormField
                control={form.control}
                name='claimType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Claim Type*</FormLabel>
                    <Select
                      // need to set the default value does not come from form defaults
                      disabled={isPending}
                      onValueChange={(e) => {
                        field.onChange(e);
                        setDateCreated(formatDate(new Date()));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ClaimType).map((el) => (
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
            )}
            {selectedClaimType && (
              <div className='mt-[21px] flex  flex-row rounded-[12px] border border-purple bg-white p-[15px]'>
                <div className='flex-grow space-y-[5px]'>
                  <div className='flex flex-row space-x-[5px] '>
                    <CardHeading title={selectedClaimType.replaceAll('_', ' ')} />
                    <ThemeChip title='Pending Info' color='bg-themeRed' />
                  </div>
                  <div className='flex flex-row space-x-2.5 '>
                    <SimpleText title='Date created:' />
                    <SimpleText title={dateCreated || ''} />
                  </div>
                </div>
              </div>
            )}

            <div className='mt-[21px] flex  flex-row rounded-[12px] border border-purple bg-white p-[15px]'>
              <div className='flex-grow space-y-[5px]'>
                <CardHeading title='Incident' />
                <div className='pb-5' />

                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Of Incident</FormLabel>
                      <FormControl>
                        <div className='flex w-full flex-col'>
                          <DatePicker
                            className='h-12 w-full rounded-md border border-input px-3 py-2 shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                            dateFormat='yyyy-MM-dd '
                            name='date'
                            onChange={(date) => {
                              field.onChange(date);
                              setDob(date);
                            }}
                            placeholderText=''
                            scrollableYearDropdown
                            selected={dob}
                            showYearDropdown
                            yearDropdownItemNumber={100}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='workRelated'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Were you at work at the time of the accident?</FormLabel>
                      <FormControl>
                        <RadioGroupDemo
                          options={options}
                          vertical={false}
                          name='workRelated'
                          defaultValue={field.value.toString()}
                          onChange={(val: string) => {
                            console.log(val);
                            field.onChange(val === 'Yes');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Location</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter Incident Location' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description of Accident</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Description...' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name='policeReportCompleted'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Was a Police Report Filed?</FormLabel>
                      <FormControl>
                        <RadioGroupDemo
                          options={options}
                          vertical={false}
                          name='policeReportCompleted'
                          defaultValue={field.value.toString()}
                          onChange={(val: string) => {
                            console.log(val);

                            field.onChange(val === 'Yes');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name='policeReportCompleted'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Police report required?</FormLabel>
                      <FormControl>
                        <RadioGroupDemo
                          options={options}
                          vertical={false}
                          name='policeReportCompleted'
                          defaultValue={field.value.toString()}
                          onChange={(val: string) => {
                            console.log(val);

                            field.onChange(val === 'Yes');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='policeStation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Police Station/Precinct</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter police station...' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='policeOfficer'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Officer Name and Description</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter police officer...' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='reportCompleted'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Was an Accident Report or Complaint Report Filed?</FormLabel>
                      <FormControl>
                        <RadioGroupDemo
                          options={options}
                          vertical={false}
                          name='reportCompleted'
                          defaultValue={field.value.toString()}
                          onChange={(val: string) => {
                            console.log(val);

                            field.onChange(val === 'Yes');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='reportNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accident/Complaint Report Number</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter report number' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lostEarning'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lost earning is required?</FormLabel>
                      <FormControl>
                        <RadioGroupDemo
                          options={options}
                          vertical={false}
                          name='lostEarning'
                          defaultValue={field.value.toString()}
                          onChange={(val: string) => {
                            console.log(val);

                            field.onChange(val === 'Yes');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='amountLoss'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approximate Loss of Earning</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter amount loss' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='timeLoss'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Approximate Missed Time from School? (If in school)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter time loss' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='priorRepresentation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prior representation is required?</FormLabel>
                      <FormControl>
                        <RadioGroupDemo
                          options={options}
                          vertical={false}
                          name='priorRepresentation'
                          defaultValue={field.value.toString()}
                          onChange={(val: string) => {
                            console.log(val);
                            field.onChange(val === 'Yes');
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='namePriorRepresentation'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name prior Representation</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter name prior representation' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='priorRepresentationReason'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prior Representation Reason</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter prior representation reason' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={error} />
                <FormSuccess message={success} />
                <div className='pt-5'></div>
                {/* <Button className=' my-4 w-full p-6' disabled={isPending} type='submit'> */}
                <Button className=' ' disabled={isPending} type='submit'>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
