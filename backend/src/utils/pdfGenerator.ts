import PDFDocument from 'pdfkit';
import { Appointment, Patient } from '@prisma/client';

type AppointmentWithPatient = Appointment & {
    patient: Patient;
};

export async function generateAppointmentPDF(
    appointment: AppointmentWithPatient
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', (chunk) => buffers.push(Buffer.from(chunk)));

            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            doc.fontSize(25).text('Medical Appointment', { align: 'center' });
            doc.moveDown();

            doc.moveTo(50, doc.y)
                .lineTo(doc.page.width - 50, doc.y)
                .stroke();
            doc.moveDown();

            doc.fontSize(16).text('Patient Information', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12);
            doc.text(`Name: ${appointment.patient.name} ${appointment.patient.surname}`);
            doc.text(`Phone: ${appointment.patient.phone}`);
            if (appointment.patient.other) {
                doc.text(`Additional Info: ${appointment.patient.other}`);
            }
            doc.moveDown();

            doc.fontSize(16).text('Appointment Details', { underline: true });
            doc.moveDown(0.5);
            doc.fontSize(12);
            doc.text(`Date: ${appointment.createdAt.toLocaleString()}`);
            doc.text(`Reason for Visit: ${appointment.reason}`);

            if (appointment.diagnosis) {
                doc.moveDown(0.5);
                doc.fontSize(14).text('Diagnosis:');
                doc.fontSize(12).text(appointment.diagnosis);
            }

            if (appointment.prescription) {
                doc.moveDown(0.5);
                doc.fontSize(14).text('Prescription:');
                doc.fontSize(12).text(appointment.prescription);
            }

            const hasVitals = appointment.bp || appointment.heartRate ||
                appointment.weight || appointment.height;

            if (hasVitals) {
                doc.moveDown();
                doc.fontSize(16).text('Vital Signs', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(12);

                if (appointment.bp) doc.text(`Blood Pressure: ${appointment.bp} mmHg`);
                if (appointment.heartRate) doc.text(`Heart Rate: ${appointment.heartRate} bpm`);
                if (appointment.weight) doc.text(`Weight: ${appointment.weight} kg`);
                if (appointment.height) doc.text(`Height: ${appointment.height} cm`);
            }

            if (appointment.notes) {
                doc.moveDown();
                doc.fontSize(16).text('Notes', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(12).text(appointment.notes);
            }

            doc.moveDown(2);
            doc.fontSize(10).text('This is an automatically generated document.', { align: 'center' });
            doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}