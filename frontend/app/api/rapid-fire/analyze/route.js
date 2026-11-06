import { NextResponse } from 'next/server';
import { analyzeRapidFireSession } from '@/lib/rapidFireEngine';
import { generateAdaptiveFollowupQuestions } from '@/lib/adaptiveFollowupEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { trackId, responses, userProfile } = body || {};

    if (!trackId || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Invalid payload. trackId and responses array are required.' },
        { status: 400 }
      );
    }

    // Run structured analysis engine
    const analysis = analyzeRapidFireSession({ trackId, responses, userProfile });

    // Generate adaptive follow-up questions for the Detailed Questionnaire
    const adaptiveQuestions = generateAdaptiveFollowupQuestions(analysis);

    return NextResponse.json({
      success: true,
      analysis,
      adaptiveQuestions,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Rapid Fire analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to process Rapid Fire assessment.', details: error.message },
      { status: 500 }
    );
  }
}

