'use server';
import * as zod from 'zod';

import { db } from '@/lib/db'; // Assuming you have a database connection set up
import { WitnessSchema } from '@/schemas';

export const createOrUpdateWitness = async (values: zod.infer<typeof WitnessSchema>) => {
  const validatedFields = WitnessSchema.safeParse(values);


  console.log(values)
  if (!validatedFields.success) return { error: 'Invalid fields' };

  const { id, witnessFirstName, witnessLastName, witnessPhone, claimId } = validatedFields.data;
  if (id) {
    // const claimDataUpdated = await db.witness.update({
    // where: { id: id },
    // data: {
    //     witnessFirstName,
    //     witnessLastName,
    //     witnessPhone,
    //     claimId,
    // },
    // });
    return { success: 'Witness has been updated' };
  } else {
    const claimDataCreated = await db.witness.create({
      data: {
        claimId: claimId.toString(),
        witnessDetails: {
          create: [
            {
              role: {
                create: {
                  account: {
                    create: {
                      firstname: witnessFirstName,
                      lastname: witnessLastName,
                      phone: witnessPhone,
                    },
                  },
                  roletype: {
                    connect: {
                      roleType: 'WITNESS',
                    },
                  },
                },
              },
            },
          ],
        },
      },
    });

    return { success: claimDataCreated };
  }

  return { error: 'Something wrong' };
};

// Delete function for Witness
// export const deleteWitness = async (id: number) => {
//   try {
//     const deletedWitness = await db.witness.delete({
//       where: { id: id },
//     });
//     return { success: `Witness with ID ${id} has been deleted` };
//   } catch (error) {
//     console.error('Error deleting witness:', error);
//     return { error: 'Failed to delete witness' };
//   }
// };
