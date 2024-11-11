// 'use server';
// import * as zod from 'zod';

// import { db } from '@/lib/db';
// import { InjurySchema } from '@/schemas';

// export const createOrUpdateInjury = async (values: zod.infer<typeof InjurySchema>) => {
//   const validatedFields = InjurySchema.safeParse(values);
//   if (!validatedFields.success) return { error: 'Invalid fields' };

//   const { id, injuryPoint, injurySide, injuryType, claimId } = validatedFields.data;
//   if (id) {
//     const claimDataUpdated = await db.injury.update({
//       where: { id: id },
//       data: {
//         injuryPoint,
//         injurySide,
//         injuryType,
//         claimId,
//       },
//     });
//     return { success: 'Witness has been updated' };
//   } else {
//     const claimDataCreated = await db.injury.create({
//       data: {
//         injuryPoint,
//         injurySide,
//         injuryType,
//         claimId,
//       },
//     });
//     return { success: claimDataCreated };
//   }

//   return { error: 'Something wrong' };
// };

// export const deleteInjury = async (id: number) => {
//   try {
//     const deletedInjury = await db.injury.delete({
//       where: { id },
//     });
//     return { success: `Injury with ID ${id} has been deleted.` };
//   } catch (error) {
//     console.error('Error deleting injury:', error);
//     return { error: 'Failed to delete injury.' };
//   }
// };