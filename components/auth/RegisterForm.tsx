/* eslint-disable react/no-unescaped-entities */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { ClaimType, WereYouInjured } from '@prisma/client';
import Image from 'next/image';
import logo from '@/public/logo.png';
import rImage from '@/public/icons/Rimage.svg';
import arrowRight from '@/public/icons/arrow-right.svg';
import { register } from '@/actions/register';
import { CardWrapper } from '@/components/auth/CardWrapper';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RegisterSchema } from '@/schemas';
import Link from 'next/link';

export function RegisterForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const form = useForm<zod.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      phone: '',
    },
  });

  const onSubmit = (values: zod.infer<typeof RegisterSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };
 
  return (
    <div className='flex h-screen  flex-col md:flex-row'>
     
    
    {/* Right Section */}
 
    <div className='flex flex-col items-center justify-center bg-graywhite p-6 md:w-2/3 md:p-10'>
      <div className=' items-start justify-items-start   '>
        <p className='font-wicklowMedium text-[30px] font-bold text-black'>Already have an account?</p>
        <Link
          className='font-gingerRegular mt-2 flex w-max items-center rounded-lg bg-purple px-4 py-2 text-[20px] font-bold text-white'
          href='/login'
        >
          Login
          <span className='ml-6'>
            <Image alt='Paininjurylaw' className='' height={24} priority src={arrowRight} width={24} />{' '}
          </span>
        </Link>

        <h2 className='font-wicklowMedium mt-8 text-[30px] font-bold text-gray-800'>Create Your Account</h2>

        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <div className='flex space-x-4'>
                <div className='w-1/2'>
                  <FormField
                    control={form.control}
                    name='firstname'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name*</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='First Name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='w-1/2'>
                  <FormField
                    control={form.control}
                    name='lastname'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name*</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Last Name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Phone number' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='injured'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Were You Injured*</FormLabel>
                    <Select
                      // need to set the default value does not come from form defaults
                      disabled={isPending}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select  ' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(WereYouInjured).map((el) => (
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
                name='claimType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Claim Type*</FormLabel>
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
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Your Email address' type='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='******' type='password' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <div className='flex items-center'>
              <input
                type='checkbox'
                className='text-purple-600 focus:ring-purple-500 h-4 w-4 rounded border-gray-300'
              />
              <label className='ml-2 text-sm text-gray-700'>
                I consent to receive text messages from paininjurylaw about services.
              </label>
            </div>
            <Button className='w-full bg-purple p-6' disabled={isPending} type='submit'>
              Create Account
            </Button>
          </form>
        </Form>
      </div>
    </div>
  </div> 
  );
}
