// 'use client';
// import * as zod from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState, useTransition } from 'react';
// import { useForm } from 'react-hook-form';
// import { driverOrPassenger } from '@prisma/client';
// import DatePicker from 'react-datepicker';
// import { FaPenToSquare, FaTrash } from "react-icons/fa6";

// import 'react-datepicker/dist/react-datepicker.css';

// import { createOrUpdateQuestionnaire, deleteQuestionnaire } from '@/actions/claim-questionnaire-create-update';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { QuestionnaireSchema } from '@/schemas';
// import { FormError } from '@/components/form-messages/FormError';
// import { FormSuccess } from '@/components/form-messages/FormSuccess';

// type Questionnaire = Array<zod.infer<typeof QuestionnaireSchema>>;
// interface QuestionnaireFormProps {
//   claimId: number;
//   questionnaire: Questionnaire;
// }

// export default function QuestionnaireForm({ claimId, questionnaire }: QuestionnaireFormProps) {
//   const router = useRouter();
//   const [error, setError] = useState<string | undefined>('');
//   const [questionnaireArr, setQuestionnaireArr] = useState<Questionnaire>(questionnaire);
//   const [success, setSuccess] = useState<string | undefined>('');
//   const [isPending, startTransition] = useTransition();
//   const [editingQuestionnaire, setEditingQuestionnaire] = useState<zod.infer<typeof QuestionnaireSchema> | null>(null);

//   const form = useForm<zod.infer<typeof QuestionnaireSchema>>({
//     resolver: zodResolver(QuestionnaireSchema),
//     defaultValues: {
//       id: undefined,
//       driverOrPassenger: '' as driverOrPassenger,
//       driverFirstName: '',
//       driverLastName: '',
//       driverOwnsVehicle: true,
//       vehicleOwnerFirstName: '',
//       vehicleOwnerLastName: '',
//       relationshipToDriver: '',
//       vehicleYear: '',
//       vehicleMake: '',
//       vehicleModel: '',
//       vehicleInsuranceCarrier: '',
//       vehicleInsurancePolicyNumber: '',
//       claimAlreadyFiled: false,
//       claimNumber: '',
//       claimRepresentativeName: '',
//       claimRepresentativeNumber: '',
//       noFaultApplicationFiled: true,
//       inRideShareVehicle: true,
//       otherRideShareInvolved: true,
//       numberOfPassengers: '',
//       passengerNamesAndPhones: '',
//       otherVehiclesInvolved: '',
//       claimId: claimId,
//     },
//   });

//   const onSubmit = (values: zod.infer<typeof QuestionnaireSchema>) => {
//     setError('');
//     setSuccess('');
//     startTransition(() => {
//       createOrUpdateQuestionnaire(values).then((data) => {
//         setError(data.error);
//         if (data?.success) {
//           if (editingQuestionnaire) {
//             const updatedQuestionnaires = questionnaireArr.map((item) =>
//               item.id === editingQuestionnaire.id ? values : item
//             );
//             setQuestionnaireArr(updatedQuestionnaires);
//             setEditingQuestionnaire(null); // Clear editing state
//           } else {
//             setQuestionnaireArr([...questionnaireArr, data.success as zod.infer<typeof QuestionnaireSchema>]);
//           }
//         }
//       });
//     });
//   };

//   const handleEditClick = (questionnaireData: zod.infer<typeof QuestionnaireSchema>) => {
//     setEditingQuestionnaire(questionnaireData);
//     setError('');
//     setSuccess('');
//     Object.keys(questionnaireData).forEach((key) => {
//       form.setValue(key as keyof zod.infer<typeof QuestionnaireSchema>, questionnaireData[key as keyof typeof questionnaireData]);
//     });
//   };
  
//   const handleDeleteClick = (id: number | undefined) => {
//     if (id && window.confirm('Are you sure you want to delete this questionnaire?')) {
//       startTransition(() => {
//         deleteQuestionnaire(id).then((data: any) => {
//           if (data.success) {
//             setQuestionnaireArr(questionnaireArr.filter((item) => item.id !== id));
//             form.reset()
//             setSuccess('Questionnaire deleted successfully!');
//           } else {
//             setError('Failed to delete questionnaire.');
//           }
//         });
//       });
//     }
//   };

//   return (
//     <>
//       {questionnaireArr.length > 0 && (
//         <div className='mb-3'>
//           {questionnaireArr.map((item: zod.infer<typeof QuestionnaireSchema>) => (
//             <div className='mb-1 flex justify-between rounded-md bg-lightpurple p-4' key={item?.id}>
//               <div>
//                 <div>
//                   <span className='font-semibold'>Were you the Driver or a Passenger*: </span>
//                   {item?.driverOrPassenger}
//                 </div>
//                 <div>
//                   <span className='font-semibold'>Vehicle: </span>
//                   {item?.vehicleYear} {item?.vehicleMake} {item?.vehicleModel}
//                 </div>
//                 <div>
//                   <span className='font-semibold'>Was a claim already filed with the vehicle insurance company?</span>
//                   {item?.claimAlreadyFiled ? 'Yes' : 'No'}
//                 </div>
//               </div>
//               <div className='flex space-x-4'>
//                 <span className='cursor-pointer' onClick={() => handleEditClick(item)}><FaPenToSquare/>
//                 </span>
//                 <span className='cursor-pointer text-red-600' onClick={() => handleDeleteClick(item.id)}><FaTrash /></span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//       {!questionnaireArr.length || editingQuestionnaire ? (
//         <Form {...form}>
//           <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
//             {/* Other Form Fields */}
//             <FormField
//               control={form.control}
//               name='driverOrPassenger'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Were you the Driver or a Passenger?</FormLabel>
//                   <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder='Select' />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {Object.values(driverOrPassenger).map((el) => (
//                         <SelectItem key={el} value={el}>
//                           {el.replaceAll('_', ' ')}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {form.watch('driverOrPassenger') === driverOrPassenger.Passenger && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name='driverFirstName'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Driver First Name </FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Driver First Name ' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='driverLastName'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Driver Last Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Driver Last Name' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </>
//             )}

//             <FormField
//               control={form.control}
//               name='driverOwnsVehicle'
//               render={({ field }) => (
//                 <FormItem className='mt-3 flex items-center'>
//                   <FormControl>
//                     <input
//                       checked={field.value}
//                       className='mr-3 block h-[20px] w-[20px]'
//                       onChange={field.onChange}
//                       type='checkbox'
//                     />
//                   </FormControl>
//                   <FormLabel className='text-md'>Does Driver Owned Vehicle?</FormLabel>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {!form.watch('driverOwnsVehicle') && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name='vehicleOwnerFirstName'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Vehicle Owner First Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Vehicle Owner First Name' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='vehicleOwnerLastName'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Vehicle Owner Last Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Vehicle Owner Last Name' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </>
//             )}

//             {form.watch('driverOrPassenger') === driverOrPassenger.Passenger && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name='relationshipToDriver'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Relationship to Driver</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Relationship to Driver' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </>
//             )}

//             <FormField
//               control={form.control}
//               name='vehicleYear'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Vehicle Year</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder='Vehicle Year' type='number' value={field.value} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name='vehicleMake'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Vehicle Make</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder='Vehicle Make' value={field.value ?? ''} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name='vehicleModel'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Vehicle Model</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder='Vehicle Model' value={field.value ?? ''} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name='vehicleInsuranceCarrier'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Vehicle Insurance Carrier</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder='Vehicle Insurance Carrier' value={field.value ?? ''} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name='vehicleInsurancePolicyNumber'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Vehicle Insurance Policy Number</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder='Vehicle Insurance Policy Number' value={field.value ?? ''} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name='claimAlreadyFiled'
//               render={({ field }) => (
//                 <FormItem className='mt-3 flex items-center'>
//                   <FormControl>
//                     <input
//                       checked={field.value}
//                       className='mr-3 block h-[20px] w-[20px]'
//                       onChange={field.onChange}
//                       type='checkbox'
//                     />
//                   </FormControl>
//                   <FormLabel className='text-md'>
//                     Was a claim already filed with the vehicle insurance company?
//                   </FormLabel>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {form.watch('claimAlreadyFiled') && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name='claimNumber'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Claim Number</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Claim Number' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='claimRepresentativeName'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Claim Representative Name</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Claim Representative Name' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='claimRepresentativeNumber'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Claim Representative Number</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Claim Representative Number' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </>
//             )}
//             <FormField
//               control={form.control}
//               name='noFaultApplicationFiled'
//               render={({ field }) => (
//                 <FormItem className='mt-3 flex items-center'>
//                   <FormControl>
//                     <input
//                       checked={field.value}
//                       className='mr-3 block h-[20px] w-[20px]'
//                       onChange={field.onChange}
//                       type='checkbox'
//                     />
//                   </FormControl>
//                   <FormLabel className='text-md'>Was a no-fault application already filed?</FormLabel>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name='inRideShareVehicle'
//               render={({ field }) => (
//                 <FormItem className='mt-3 flex items-center'>
//                   <FormControl>
//                     <input
//                       checked={field.value}
//                       className='mr-3 block h-[20px] w-[20px]'
//                       onChange={field.onChange}
//                       type='checkbox'
//                     />
//                   </FormControl>
//                   <FormLabel className='text-md'>
//                     Were you in a Uber/Lyft /Ride Share Vehicle during the time of the accident?
//                   </FormLabel>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name='otherRideShareInvolved'
//               render={({ field }) => (
//                 <FormItem className='mt-3 flex items-center'>
//                   <FormControl>
//                     <input
//                       checked={field.value}
//                       className='mr-3 block h-[20px] w-[20px]'
//                       onChange={field.onChange}
//                       type='checkbox'
//                     />
//                   </FormControl>
//                   <FormLabel className='text-md'>
//                     Were any of the other vehicles involved an Uber/Lyft/Ride Share Vehicle during the time of the
//                     accident?
//                   </FormLabel>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {form.watch('otherRideShareInvolved') && (
//               <>
//                 <FormField
//                   control={form.control}
//                   name='numberOfPassengers'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Claim Number</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Number of Passengers' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='passengerNamesAndPhones'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Name and Phone of Passengers</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder='Name and Phone of Passengers' value={field.value ?? ''} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </>
//             )}
//             <FormField
//               control={form.control}
//               name='otherVehiclesInvolved'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>How many other vehicles were involved in the accident?* </FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder='How many other vehicles were involved in the accident?* '
//                       type='number'
//                       value={field.value ?? ''}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name='claimId'
//               render={({ field }) => (
//                 <FormItem className='hidden'>
//                   <FormLabel>Claim ID</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder='Enter Reason' value={claimId} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* Submit Button */}
//             <FormError message={error} />
//             <FormSuccess message={success} />
//             <div className='grid grid-cols-2 gap-4'>
//             {questionnaireArr.length > 0 && <Button className='w-full p-6 mr-2' disabled={isPending} onClick={() => setEditingQuestionnaire(null)}  type='button'>
//                 Cancel
//                 </Button>}
//                 <Button className='w-full p-6' disabled={isPending} type='submit'>
//                   {editingQuestionnaire ? 'Update Questionnaire' : 'Save Questionnaire'}
//                 </Button>
//             </div>
//           </form>
//         </Form>
//       ) : ""}
//     </>
//   );
// }