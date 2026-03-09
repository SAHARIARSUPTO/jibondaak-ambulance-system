import { NextResponse } from 'next/server';
const TriageFormModel = require('@/models/TriageForm');

export async function GET() {
  try {
    const symptoms = TriageFormModel.getCommonSymptoms();

    return NextResponse.json({ 
      success: true, 
      symptoms
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
