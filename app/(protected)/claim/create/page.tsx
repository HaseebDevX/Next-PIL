'use client';
import { IncidentSchema } from '@/schemas';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { ClaimType } from '@prisma/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardHeading } from '@/components/claim/cardHeading';
import ThemeChip from '@/components/ui/chip';
import { SimpleText } from '@/components/claim/simpleText';
import DatePicker from 'react-datepicker';
import { Input } from '@/components/ui/input';
import ThemeRadioGroup from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';
import { createOrUpdateIncident } from '@/actions/claim-incident-create-update';

export default function CreateNewClaim() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [dateCreated, setDateCreated] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const form = useForm<zod.infer<typeof IncidentSchema>>({
    resolver: zodResolver(IncidentSchema),
  });
  const selectedClaimType = form.watch('claimType');

  const onSubmit = (values: zod.infer<typeof IncidentSchema>) => {
    console.log('on submit is called ');

    setError('');
    setSuccess('');
    startTransition(() => {
      createOrUpdateIncident(values).then((data) => {
        setError(data.error);
        setSuccess(JSON.stringify(data.success));
      });
    });
  };
  const [dob, setDob] = useState<Date | null>(new Date());

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return (
    <div className='flex w-full flex-row justify-center  px-[10px] pt-2.5 md:px-0  md:pt-10 lg:px-0 xl:px-0'>
      <div className='w-full md:w-[499px]'>
        {' '}
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
                <FormField
                  control={form.control}
                  name='policeOfficer'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Police officer</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter police officer...' />
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
                      <FormLabel>Report number</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter report number' />
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
                      <FormLabel>Amount loss</FormLabel>
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
                      <FormLabel>Time loss</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder='Enter time loss' />
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
                <Button className=' my-4 w-full p-6' disabled={isPending} type='submit'>
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
