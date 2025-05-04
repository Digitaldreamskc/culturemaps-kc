import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/database';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const data = await request.json();

    // Insert the submission into the location_submissions table
    const { data: submission, error } = await supabase
      .from('location_submissions')
      .insert({
        name: data.name,
        category: data.category,
        description: data.description,
        website: data.website,
        photo_url: data.photoUrl,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        submitted_by: data.submittedBy,
        contact_email: data.contactEmail,
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting location:', error);
      return NextResponse.json(
        { error: 'Failed to submit location' },
        { status: 500 }
      );
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error in submit route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 