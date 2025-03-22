export interface Patient {
    id: number;
    name: string;
    surname: string;
    phone: string;
    other?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Appointment {
    id: number;
    patientId: number;
    reason: string;
    diagnosis?: string;
    prescription?: string;
    bp?: number;
    heartRate?: number;
    weight?: number;
    height?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
} 