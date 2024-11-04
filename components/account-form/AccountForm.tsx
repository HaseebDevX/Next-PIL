'use client';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { type ExtendedUser } from '@/next-auth';
import { accounts } from '@/actions/account';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AccountSchema } from '@/schemas';
import { MATERIALSTATUS, EMPLOYMENTSTATUS } from '@/data/constants';

interface UserInfoProps {
  user?: ExtendedUser;
}
export function AccountForm({ user }: UserInfoProps) {
  const router = useRouter();
  const [dob, setDob] = useState<Date | null>(new Date());
  const [isEighteen, setIsEighteen] = useState<boolean>(false);
  const [isMailing, setIsMailing] = useState(false);
  const [isElectroniccomm, setElectroniccomm] = useState(true);
  const [maritalStatus, setMaritalStatus] = useState<string>('');
  const [employmentStatus, setEmploymentStatus] = useState<string>('');
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof AccountSchema>>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      id: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: new Date(),
      isUnder18: false,
      fatherFirstName: '',
      fatherLastName: '',
      motherFirstName: '',
      motherLastName: '',
      mailingAddress1: '',
      mailingAddress2: '',
      mailingCity: '',
      mailingState: '',
      mailingZipCode: '',
      isPOBoxOrDifferentAddress: false,
      physicalAddress1: '',
      physicalAddress2: '',
      physicalCity: '',
      physicalState: '',
      physicalZipCode: '',
      phone1: '',
      phone2: '',
      email: '',
      consentForElectronicComm: false,
      maritalStatus: '',
      spouseFirstName: '',
      spouseLastName: '',
      spousePhone: '',
      employmentStatus: '',
      employerName: '',
      employerTitle: '',
      employmentType: '',
      pay: '',
      schoolName: '',
      expectedGraduationYear: '',
      userId: user?.id,
    },
  });
  const onSubmit = (values: zod.infer<typeof AccountSchema>) => {
    setError('');
    setSuccess('');
    startTransition(() => {
      accounts(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if (data.success) {
          // router.prefetch('/dashboard');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      });
    });
  };

  if (user) {
    return (
      <div className='flex rounded-lg bg-white p-8 shadow-lg'>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <div className='flex space-x-2'>
                <div className='w-full'>
                  <FormField
                    control={form.control}
                    name='firstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='First Name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='w-full'>
                  <FormField
                    control={form.control}
                    name='middleName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Middle Name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='w-full'>
                  <FormField
                    control={form.control}
                    name='lastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Enter Last Name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      // need to set the default value does not come from form defaults
                      disabled={isPending}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select Gender' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Male'>Male</SelectItem>
                        <SelectItem value='Female'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Of Birth</FormLabel>
                    <FormControl>
                      <div className='flex w-full flex-col'>
                        <DatePicker
                          className='h-12 w-full rounded-md border border-input px-3 py-2 shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                          dateFormat='yyyy-MM-dd'
                          name='dateOfBirth'
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
                name='isUnder18'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <label className='flex items-start'>
                        <input
                          checked={isEighteen}
                          className='mr-3 block h-[20px] w-[20px]'
                          onChange={(event) => {
                            field.onChange(event.target.checked);
                            setIsEighteen(event.target.checked);
                          }}
                          type='checkbox'
                        />
                        If under 18 years old
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEighteen && (
                <>
                  <FormField
                    control={form.control}
                    name='fatherFirstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Father first name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='fatherLastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Father last name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='motherFirstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Mother first name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='motherLastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Mother last name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name='mailingAddress1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing Address 1*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Mailing Address 1' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='mailingAddress2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing Address 2</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Mailing Address 2' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='mailingCity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing City</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Mailing City' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='mailingState'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing State*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Mailing State' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='mailingZipCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mailing Zip Code*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Mailing Zip Code' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isPOBoxOrDifferentAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <label className='flex items-start'>
                        <input
                          checked={isMailing}
                          className='mr-3 block h-[20px] w-[20px]'
                          onChange={(event) => {
                            field.onChange(event.target.checked);
                            setIsMailing(event.target.checked);
                          }}
                          type='checkbox'
                        />
                        Is your current mailing address a PO Box or not the same address listed on your state issues
                        identification? If Yes then please provide Physical Address*
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isMailing && (
                <>
                  <FormField
                    control={form.control}
                    name='physicalAddress1'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Physical Address 1</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Physical Address 1' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='physicalAddress2'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Physical Address 2</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Physical Address 2' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='physicalCity'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mailing City</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Mailing City' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='physicalState'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mailing State</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Mailing State' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='physicalZipCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mailing Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Mailing Zip Code' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name='phone1'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone 1*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Phone 1' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone2'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone 2*</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder='Phone 2' />
                    </FormControl>
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
                      <Input {...field} disabled={isPending} placeholder='Email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='consentForElectronicComm'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <label className='flex items-start'>
                        <input
                          checked={isElectroniccomm}
                          className='mr-3 block h-[20px] w-[20px]'
                          name='consentForElectronicComm'
                          onChange={(event) => {
                            field.onChange(event.target.checked);
                            setElectroniccomm(event.target.checked);
                          }}
                          type='checkbox'
                        />
                        Consent For Electronic Communication*
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='maritalStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setMaritalStatus(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MATERIALSTATUS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {['Married', 'Divorced', 'Separated'].includes(maritalStatus) && (
                <>
                  <FormField
                    control={form.control}
                    name='spouseFirstName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse First Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Spouse first name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='spouseLastName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Spouse last name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='spousePhone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse Phone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Spouse Phone' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name='employmentStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setEmploymentStatus(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EMPLOYMENTSTATUS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {employmentStatus === 'Employed' && (
                <>
                  <FormField
                    control={form.control}
                    name='employerName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Employer Name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='employerTitle'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer Title</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Employer Title' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='employmentType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer Type</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Employer Type' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='pay'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pay</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Pay' type='number' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {employmentStatus === 'Student' && (
                <>
                  <FormField
                    control={form.control}
                    name='schoolName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='School Name' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='expectedGraduationYear'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Graduation Year</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} placeholder='Expected Graduation Year' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='User ID' value={user?.id} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button className='w-full p-6' disabled={isPending} type='submit'>
              Complete Profile
            </Button>
          </form>
        </Form>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
