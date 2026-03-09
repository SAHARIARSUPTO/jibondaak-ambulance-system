import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
const FirstAidGuideModel = require('@/models/FirstAidGuide');

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('jibondaak');

    const guides = await FirstAidGuideModel.findAll(db);

    return NextResponse.json({ 
      success: true, 
      guides
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
