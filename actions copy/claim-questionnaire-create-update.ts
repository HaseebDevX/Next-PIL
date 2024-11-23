// 'use server';
// import * as zod from 'zod';

// import { db } from '@/lib/db';
// import { QuestionnaireSchema } from '@/schemas';

// export const createOrUpdateQuestionnaire = async (values: zod.infer<typeof QuestionnaireSchema>) => {
//   const validatedFields = QuestionnaireSchema.safeParse(values);
//   if (!validatedFields.success) return { error: 'Invalid fields' };

//   const {
//     id,
//     driverOrPassenger,
//     driverFirstName,
//     driverLastName,
//     driverOwnsVehicle,
//     vehicleOwnerFirstName,
//     vehicleOwnerLastName,
//     relationshipToDriver,
//     vehicleYear,
//     vehicleMake,
//     vehicleModel,
//     vehicleInsuranceCarrier,
//     vehicleInsurancePolicyNumber,
//     claimAlreadyFiled,
//     claimNumber,
//     claimRepresentativeName,
//     claimRepresentativeNumber,
//     noFaultApplicationFiled,
//     inRideShareVehicle,
//     otherRideShareInvolved,
//     numberOfPassengers,
//     passengerNamesAndPhones,
//     otherVehiclesInvolved,
//     claimId,
//   } = validatedFields.data;
//   if (id) {
//     const claimDataUpdated = await db.questionnaire.update({
//       where: { id: id },
//       data: {
//         driverOrPassenger,
//         driverFirstName,
//         driverLastName,
//         driverOwnsVehicle,
//         vehicleOwnerFirstName,
//         vehicleOwnerLastName,
//         relationshipToDriver,
//         vehicleYear,
//         vehicleMake,
//         vehicleModel,
//         vehicleInsuranceCarrier,
//         vehicleInsurancePolicyNumber,
//         claimAlreadyFiled,
//         claimNumber,
//         claimRepresentativeName,
//         claimRepresentativeNumber,
//         noFaultApplicationFiled,
//         inRideShareVehicle,
//         otherRideShareInvolved,
//         numberOfPassengers,
//         passengerNamesAndPhones,
//         otherVehiclesInvolved,
//         claimId,
//       },
//     });
//     return { success: 'Witness has been updated' };
//   } else {
//     const claimDataCreated = await db.questionnaire.create({
//       data: {
//         driverOrPassenger,
//         driverFirstName,
//         driverLastName,
//         driverOwnsVehicle,
//         vehicleOwnerFirstName,
//         vehicleOwnerLastName,
//         relationshipToDriver,
//         vehicleYear,
//         vehicleMake,
//         vehicleModel,
//         vehicleInsuranceCarrier,
//         vehicleInsurancePolicyNumber,
//         claimAlreadyFiled,
//         claimNumber,
//         claimRepresentativeName,
//         claimRepresentativeNumber,
//         noFaultApplicationFiled,
//         inRideShareVehicle,
//         otherRideShareInvolved,
//         numberOfPassengers,
//         passengerNamesAndPhones,
//         otherVehiclesInvolved,
//         claimId,
//       },
//     });
//     return { success: claimDataCreated };
//   }

//   return { error: 'Something wrong' };
// };


// export const deleteQuestionnaire = async (id: number) => {
//   try {
//     await db.questionnaire.delete({
//       where: { id },
//     });
//     return { success: 'Questionnaire deleted successfully' };
//   } catch (error) {
//     return { error: 'Failed to delete questionnaire' };
//   }
// };