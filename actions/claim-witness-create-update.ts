'use server';
import * as zod from 'zod';

import { db } from '@/lib/db'; // Assuming you have a Prisma database connection set up
import { WitnessSchema } from '@/schemas';

export const createOrUpdateWitness = async (values: zod.infer<typeof WitnessSchema>) => {
  // Validate the input data against the schema
  const validatedFields = WitnessSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error };
  }

  const { id, witnessFirstName, witnessLastName, witnessPhone, claimId }: any = validatedFields.data;

  try {
    console.log("FoundID", id)
    if (id) {
      // Update an existing witness
      const updatedWitness = await db.witness.update({
        where: { id },
        data: {
          witnessDetails: {
            update: {
              role: {
                update: {
                  account: {
                    update: {
                      firstname: witnessFirstName,
                      lastname: witnessLastName,
                      phone: witnessPhone,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return { success: updatedWitness, message: 'Witness has been updated successfully' };
    } else {
      // Create a new witness
      const createdWitness = await db.witness.create({
        data: {
          claimId,
          witnessDetails: {
            create: {
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
                      roleType: 'Witness', // Ensure this matches the exact RoleType in your database
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          witnessDetails: {
            include: {
              role: {
                include: {
                  account: true,
                  roletype: true,
                },
              },
            },
          },
        },
      });

      return { success: createdWitness, message: 'Witness has been created successfully' };
    }
  } catch (error) {
    console.error('Error creating or updating witness:', error);
    return { error: 'Failed to create or update witness', details: error };
  }
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
