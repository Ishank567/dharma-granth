import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";

// Static demo interpretation for GitHub Pages
const demoInterpretation = {
  id: 1,
  verse_id: 1,
  interpretation_text: "यह श्लोक महाभारत के पहले अध्याय का पहला श्लोक है। धृतराष्ट्र राजा अपनी सेना के बारे में पूछ रहे हैं कि कुरुक्षेत्र में क्या हुआ। यह युद्ध की शुरुआत का संकेत देता है।",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_ai_generated: false,
  ai_provider: null,
  ai_model: null,
  ai_temperature: null,
  ai_tokens_used: null,
  ai_cost: null,
  fallback_reason: null
};

export async function GET(request: NextRequest) {
  // For static demo, return sample interpretation
  return NextResponse.json({
    interpretation: demoInterpretation,
    status: 'success'
  });
}

export async function POST(request: NextRequest) {
  // For static demo, return sample interpretation
  return NextResponse.json({
    interpretation: demoInterpretation,
    status: 'success'
  });
}