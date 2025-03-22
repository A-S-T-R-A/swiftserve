import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.appointment.deleteMany();
    await prisma.patient.deleteMany();

    const john = await prisma.patient.create({
        data: {
            name: 'John',
            surname: 'Doe',
            phone: '123-456-7890',
            other: 'Allergic to penicillin'
        }
    });

    const jane = await prisma.patient.create({
        data: {
            name: 'Jane',
            surname: 'Smith',
            phone: '987-654-3210',
            other: 'Has asthma'
        }
    });

    await prisma.appointment.create({
        data: {
            patientId: john.id,
            reason: 'Annual checkup',
            diagnosis: 'Healthy',
            prescription: 'Vitamin D supplements',
            bp: 120,
            heartRate: 72,
            weight: 75.5,
            height: 180,
            notes: 'Patient seems to be in good health'
        }
    });

    await prisma.appointment.create({
        data: {
            patientId: jane.id,
            reason: 'Asthma follow-up',
            diagnosis: 'Moderate asthma',
            prescription: 'Albuterol inhaler',
            bp: 130,
            heartRate: 80,
            weight: 65.0,
            height: 165,
            notes: 'Patient should avoid triggers and continue medication'
        }
    });

    console.log('Database has been seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 