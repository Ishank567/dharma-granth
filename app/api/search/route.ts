import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";

// Static demo data for GitHub Pages
const demoResults = [
  {
    id: 1,
    book_name: "गीता",
    chapter_number: 1,
    verse_number: 1,
    sanskrit_text: "धृतराष्ट्र उवाच धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय॥",
    hindi_translation: "धृतराष्ट्र बोले - हे संजय! धर्मभूमि कुरुक्षेत्र में एकत्र हुए युद्ध की इच्छा वाले मेरे और पाण्डवों के पुत्रों ने क्या किया?",
    english_translation: "Dhritarashtra said: O Sanjay, what did my sons and the sons of Pandu do when they gathered on the holy field of Kurukshetra, eager for battle?",
    category: "गीता"
  },
  {
    id: 2,
    book_name: "रामचरितमानस",
    chapter_number: 1,
    verse_number: 1,
    sanskrit_text: "श्रीगुरु चरन सरोज रज निज मन मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥",
    hindi_translation: "गुरु के चरणकमलों की रज को अपने मन रूपी दर्पण पर धारण करके, मैं श्रीरघुनाथजी के निर्मल यश का वर्णन करता हूँ, जो चारों फलों का दाता है।",
    english_translation: "Having applied the dust of the lotus feet of my Guru to the mirror of my mind, I narrate the pure glory of Shri Raghunathji, who bestows the four fruits.",
    category: "रामायण"
  }
];

export async function GET(request: NextRequest) {
  // For static demo, return sample results
  return NextResponse.json({
    results: demoResults,
    query: "demo",
    page: 1,
    totalPages: 1,
    total: 2,
  });
}
