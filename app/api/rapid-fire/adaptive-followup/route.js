import { NextResponse } from 'next/server';
import { generateAdaptiveFollowupQuestions } from '@/lib/adaptiveFollowupEngine';

export async function POST(request) {
  try {
    const body = await request.json();
    const { analysis } = body || {};

    if (!analysis) {
      return NextResponse.json(
        { error: 'Rapid Fire analysis object is required.' },
        { status: 400 }
      );
    }

    const adaptiveQuestions = generateAdaptiveFollowupQuestions(analysis);

    return NextResponse.json({
      success: true,
      adaptiveQuestions,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Adaptive follow-up generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate adaptive follow-up questions.', details: error.message },
      { status: 500 }
    );
  }
}

