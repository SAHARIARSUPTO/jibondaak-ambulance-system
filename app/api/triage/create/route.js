import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const TriageFormModel = require('@/models/TriageForm');

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const body = await request.json();
    const { bookingId, patientAge, patientGender, symptoms, additionalNotes } = body;

    // Create triage form
    const triageForm = await TriageFormModel.create(db, {
      bookingId,
      patientAge,
      patientGender,
      symptoms,
      additionalNotes,
      sharedWithDriver: true,
      sharedWithHospital: true
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Triage form submitted successfully',
      triageForm
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
}
