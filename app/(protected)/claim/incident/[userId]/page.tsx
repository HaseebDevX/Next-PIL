/* eslint-disable import/order */
'use client';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { ClaimType, Relationship } from '@prisma/client';
import DatePicker from 'react-datepicker';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { ClaimSchema, IncidentSchema, injuredIncidentSchema } from '@/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardHeading } from '@/components/claim/cardHeading';
import ThemeChip from '@/components/ui/chip';
import { SimpleText } from '@/components/claim/simpleText';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-messages/FormError';
import { FormSuccess } from '@/components/form-messages/FormSuccess';
import { createOrUpdateIncident, getIncidentById } from '@/actions/claim-incident-create-update';

import 'react-datepicker/dist/react-datepicker.css';
import { createClaim } from '@/actions/claim-create';
import { createAccount } from '@/actions/account';
import RadioGroupDemo from '@/components/ui/radio-group/radio-group';
import { getIncidentByClaimId } from '@/data/incident';
import { formateToDDMMYY } from '@/lib/formate-date';
import { createRoleType } from '@/actions/role-type';
import { createRole } from '@/actions/role';

import WitnessFormComponent from '@/components/claim/witness-form';

export default function CreateNewClaim() {
  const searchParams = useSearchParams();
  const claimIdForUpdate = searchParams.get('claimId');
  const incidentId = searchParams.get('incidentId');
  const params = useParams();
  const userId = params?.userId;
  const router = useRouter();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [dateCreated, setDateCreated] = useState<string>();
  const formDataLoaded = useRef<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [savedClaimId, setClaimSavedId] = useState<string>();

  const form = useForm<zod.infer<typeof IncidentSchema>>({
    resolver: zodResolver(IncidentSchema),
    defaultValues: {
      date: new Date(),
      location: '',
      description: '',
      policeOfficer: '',
      reportNumber: '',
      amountLoss: '',
      timeLoss: '',
      priorRepresentationReason: '',
      injured: false,
      id: undefined,
      time: new Date(),
      timeOfDay: 'PM',
      workRelated: false,
      policeReportCompleted: false,
      policeStation: '',
      reportCompleted: false,
      supportingDocument: false,
      supportingDocumentUpload: '',
      lostEarning: false,
      namePriorRepresentation: '',
      priorRepresentation: false,
      claimId: '',
      roleId: '',
    },
  });
  const { control, getValues } = useForm<zod.infer<typeof injuredIncidentSchema>>({
    resolver: zodResolver(injuredIncidentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      attorneyFirstName: '',
      attorneyLastName: '',
    },
  });

  const selectedClaimType = form.watch('claimType');

  useEffect(() => {
    if (claimIdForUpdate && !formDataLoaded.current) {
      setIncidentData(claimIdForUpdate);
    }
  }, [claimIdForUpdate, formDataLoaded]);
  
  const getIncidentByIncidentId = async () => {
    if (incidentId) {
      try {
        const incidentData = await getIncidentById(incidentId);
  
        if (incidentData) {
          form.setValue("date", new Date(incidentData.date) || new Date());
          form.setValue("location", incidentData.location || "");
          form.setValue("description", incidentData.description || "");
          form.setValue("policeOfficer", incidentData.policeOfficer || "");
          form.setValue("reportNumber", incidentData.reportNumber || "");
          form.setValue("amountLoss", incidentData.amountLoss || "");
          form.setValue("timeLoss", incidentData.timeLoss || "");
          form.setValue("priorRepresentationReason", incidentData.priorRepresentationReason || "");
          form.setValue("id", incidentData.id || undefined);
          form.setValue("time", new Date(incidentData.time) || new Date());
          form.setValue("timeOfDay", incidentData.timeOfDay || "PM");
          form.setValue("workRelated", incidentData.workRelated || false);
          form.setValue("policeReportCompleted", incidentData.policeReportCompleted || false);
          form.setValue("policeStation", incidentData.policeStation || "");
          form.setValue("reportCompleted", incidentData.reportCompleted || false);
          form.setValue("supportingDocument", incidentData.supportingDocument || false);
          form.setValue("supportingDocumentUpload", incidentData.supportingDocumentUpload || "");
          form.setValue("lostEarning", incidentData.lostEarning || false);
          form.setValue("priorRepresentation", incidentData.priorRepresentation || false);
          form.setValue("claimId", incidentData.claimId || "");
          form.setValue("roleId", incidentData.roleId || "");
        }
      } catch (error) {
        console.error("Error fetching incident data:", error);
      }
    }
  };

  useEffect(() => {
    getIncidentByIncidentId();
  }, []);

  const setIncidentData = async (id: string) => {
    if(claimIdForUpdate){
      setClaimSavedId(claimIdForUpdate)
    }
    formDataLoaded.current = true;
    let claimToEditString = sessionStorage.getItem('claimToEdit');
    const claimToEdit: zod.infer<typeof ClaimSchema> = JSON.parse(claimToEditString || '');

    form.setValue('claimType', claimToEdit.type);
    const incidentToEdit = claimToEdit?.incident || {};

    Object.keys(incidentToEdit).forEach((key) => {
      if (key === 'date') {
        const tempDate = new Date(incidentToEdit[key as keyof typeof incidentToEdit]);
        setDateCreated(formateToDDMMYY(tempDate));
        form.setValue(key as keyof zod.infer<typeof IncidentSchema>, tempDate);
      } else {
        form.setValue(
          key as keyof zod.infer<typeof IncidentSchema>,
          incidentToEdit[key as keyof typeof incidentToEdit]
        );
      }
    });

    form.setValue('supportingDocument', false);
    form.setValue('time', new Date());
  };
  const onError = (errors: any) => {};

  const onSubmit = async (values: zod.infer<typeof IncidentSchema>) => {
    const userInfo = sessionStorage.getItem('userInfo');

    const userDetails = JSON.parse(userInfo ?? '');

    const formValues = getValues();

    const accountPayload = {
      firstname: formValues?.firstName || userDetails?.firstname,
      lastname: formValues?.lastName || userDetails?.lastname,
      phone: formValues?.phone || userDetails?.phone,
      email: formValues?.email || userDetails?.email,
      mailingAddress: formValues?.address || userDetails?.mailingAddress1,
    };

    const roleTypePayload = {
      roleType: 'Injury party',
    };
    const claimPayload = {
      relationship: Relationship.Other,
      type: selectedClaimType,
      injured: form.getValues('injured'),
      clientRole: {
        create: {
          account: {
            create: {
              ...accountPayload,
            },
          },
          roletype: {
            create: {
              ...roleTypePayload,
            },
          },
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    };

    const claim = await createClaim(claimPayload);
    const claimId = claim.success.id;
    const attorneyPayload = {
      firstname: formValues?.attorneyFirstName,
      lastname: formValues?.attorneyLastName,
    };
    setClaimSavedId(claimId);
    setError('');
    setSuccess('');
    startTransition(() => {
      createOrUpdateIncident(values, claimId, attorneyPayload).then((data) => {
        setError(data.error);
        if (data?.success) {
          setSuccess('Success');
          // router.replace('/claim');
          setTimeout(() => {
            router.refresh();
          }, 500);
        }
      });
    });
  };

  const [incidentDate, setIncidentDate] = useState<Date | null>(null);

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

  return (
    <div className='flex w-full flex-row justify-center  px-[10px] pt-2.5 md:px-0 mb-16 md:pt-10 lg:px-0 xl:px-0'>
      <div className='w-full md:w-[499px]'>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit, onError)}>
            {!claimIdForUpdate && !selectedClaimType && (
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
                    <ThemeChip color='bg-themeRed' title='Pending Info' />
                  </div>
                  <div className='flex flex-row space-x-2.5 '>
                    <SimpleText title='Date created:' />
                    <SimpleText title={dateCreated || ''} />
                  </div>
                </div>
              </div>
            )}

            {selectedClaimType && (
              <>
                {/* Incident Part */}
                <div className='mt-[21px] flex  flex-row rounded-[12px] border border-purple bg-white p-[15px]'>
                  <div className='flex-grow space-y-[5px]'>
                    <CardHeading title='Incident' />
                    <div className='pb-5' />
                    <FormField
                      control={form.control}
                      name='injured'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Were you injured in this incident?</FormLabel>
                          <FormControl>
                            <RadioGroupDemo
                              defaultValue={field.value ? 'Yes' : 'No'}
                              name='injured'
                              onChange={(val: string) => {
                                field.onChange(val === 'Yes');
                              }}
                              options={options}
                              vertical={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.getValues('injured') === false && (
                      <>
                        <FormField
                          control={control}
                          name='firstName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Enter First Name' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
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

                        <FormField
                          control={control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Enter Email' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name='phone'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Enter Phone' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name='address'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Enter Address' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

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
                                dateFormat='dd-MM-yyyy'
                                name='date'
                                onChange={(date) => {
                                  field.onChange(date);
                                  setIncidentDate(date);
                                }}
                                placeholderText='Enter Date'
                                scrollableYearDropdown
                                selected={incidentDate}
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
                      name='workRelated'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Were you at work at the time of the accident?</FormLabel>
                          <FormControl>
                            <RadioGroupDemo
                              defaultValue={field.value ? 'Yes' : 'No'}
                              name='workRelated'
                              onChange={(val: string) => {
                                // console.log(val);
                                field.onChange(val === 'Yes');
                              }}
                              options={options}
                              vertical={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.getValues('workRelated') === true && (
                      <>
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
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name='policeReportCompleted'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Was a Police Report Filed?</FormLabel>
                          <FormControl>
                            <RadioGroupDemo
                              defaultValue={field.value ? 'Yes' : 'No'}
                              name='policeReportCompleted'
                              onChange={(val: string) => {
                                // console.log(val);

                                field.onChange(val === 'Yes');
                              }}
                              options={options}
                              vertical={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.getValues('policeReportCompleted') === true && (
                      <>
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
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name='reportCompleted'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Was an Accident Report or Complaint Report Filed?</FormLabel>
                          <FormControl>
                            <RadioGroupDemo
                              defaultValue={field.value ? 'Yes' : 'No'}
                              name='reportCompleted'
                              onChange={(val: string) => {
                                // console.log(val);

                                field.onChange(val === 'Yes');
                              }}
                              options={options}
                              vertical={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.getValues('reportCompleted') === true && (
                      <>
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
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name='supportingDocument'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Picture Taken?</FormLabel>
                          <FormControl>
                            <RadioGroupDemo
                              defaultValue={field.value ? 'Yes' : 'No'}
                              name='supportingDocument'
                              onChange={(val: string) => {
                                // console.log(val);

                                field.onChange(val === 'Yes');
                              }}
                              options={options}
                              vertical={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.getValues('supportingDocument') === true && (
                      <>
                        <FormField
                          control={form.control}
                          name='supportingDocumentUpload'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Upload </FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Upload image' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name='lostEarning'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Missed time from work or school?</FormLabel>
                          <FormControl>
                            <RadioGroupDemo
                              defaultValue={field.value ? 'Yes' : 'No'}
                              name='lostEarning'
                              onChange={(val: string) => {
                                // console.log(val);

                                field.onChange(val === 'Yes');
                              }}
                              options={options}
                              vertical={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.getValues('lostEarning') === true && (
                      <>
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
                      </>
                    )}

                    <FormField
                      control={form.control}
                      name='priorRepresentation'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Do you currently have representation regarding this claim?</FormLabel>
                          <FormControl>
                            <RadioGroupDemo
                              defaultValue={field.value ? 'Yes' : 'No'}
                              name='priorRepresentation'
                              onChange={(val: string) => {
                                // console.log(val);
                                field.onChange(val === 'Yes');
                              }}
                              options={options}
                              vertical={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.getValues('priorRepresentation') === true && (
                      <>
                        <FormField
                          control={form.control}
                          name='priorRepresentationReason'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Reason for wanting to remove your current representation from your claim?
                              </FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Enter name prior representation' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name='attorneyFirstName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name Attorney</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Enter first name' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name='attorneyLastName'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} disabled={isPending} placeholder='Enter last name' />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <div className='pt-5' />
                    {/* <Button className=' my-4 w-full p-6' disabled={isPending} type='submit'> */}
                    <Button className='cursor-pointer' disabled={isPending} type='submit'>
                      Submit
                    </Button>
                  </div>
                </div>

                
              </>
            )}
          </form>
        </Form>
        {/* Witness Part  */}
        {(selectedClaimType && savedClaimId) && ( <div className='mt-[21px] flex  flex-row rounded-[12px] border border-purple bg-white p-[15px]'>
            <div className='flex-grow space-y-[5px]'>
              <CardHeading title='Witness' />
              <div className='pb-5' />
              <WitnessFormComponent claimId={savedClaimId} witness={[]}                  />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
