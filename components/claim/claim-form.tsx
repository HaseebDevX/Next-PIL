'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ClaimType } from '@prisma/client';

import { createOrUpdateClaim } from '@/actions/claim-create-update';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ClaimSchema, ClaimDatabaseSchema } from '@/schemas';

interface ClaimFormProps {
  claimData: zod.infer<typeof ClaimDatabaseSchema>;
}

export default function ClaimForm({ claimData }: ClaimFormProps) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<zod.infer<typeof ClaimSchema>>({
    resolver: zodResolver(ClaimSchema),
    defaultValues: {
      id: claimData?.id,
      name: claimData?.name || '',
      claimType: claimData?.claimType as ClaimType,
      userId: claimData?.userId,
    },
  });
  const formSubmit1 = (values: zod.infer<typeof ClaimSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      createOrUpdateClaim(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data.success) {
          // router.prefetch('/dashboard');
          setTimeout(() => {
            setSuccess('');
          }, 2000);
        }
      });
    });
  };
  return (
    <>
      <h1 className='mb-3 flex items-start text-2xl font-medium text-purple'>
        Claim ID: {claimData?.id}{' '}
        <span className='ml-3 rounded-xl bg-yellow-200 px-2 text-sm text-black'>{claimData?.claimStatus}</span>
      </h1>
      <Form {...form}>
        <form className='flex w-full items-end space-x-4' onSubmit={form.handleSubmit(formSubmit1)}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-1/3'>
                <FormLabel>Claim Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder='Name' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='claimType'
            render={({ field }) => (
              <FormItem className='w-1/3'>
                <FormLabel>Claim Type</FormLabel>
                <Select defaultValue={claimData?.claimType || ''} disabled={isPending} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select Claim Type' />
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
          <FormField
            control={form.control}
            name='userId'
            render={({ field }) => (
              <FormItem className='hidden'>
                <FormLabel>user</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder='Name' value={claimData?.userId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='w-1/3'>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button className='w-full p-6' disabled={isPending} type='submit'>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
