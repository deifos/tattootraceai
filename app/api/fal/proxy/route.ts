import { route } from "@fal-ai/server-proxy/nextjs";
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getTotalAvailableCredits } from '@/lib/credits';

// Custom POST handler with credit checking
export const POST = async (req: NextRequest) => {
  try {
    // Check if this request requires credits (set by client)
    const requiresCredits = req.headers.get("x-requires-credits") === "true";
    
    if (requiresCredits) {
      // Check authentication
      const session = await auth.api.getSession({ headers: await headers() });
      
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Check if user has sufficient credits
      const creditInfo = await getTotalAvailableCredits(session.user.id);
      
      if (creditInfo.total < 1) {
        return NextResponse.json(
          { error: 'Insufficient credits' },
          { status: 402 }
        );
      }
      
      console.log(`Credit-requiring request from user ${session.user.id}, credits: ${creditInfo.total}`);
    }
    
    // If everything passed, execute the proxy handler
    return route.POST(req);
  } catch (error) {
    console.error('Error in FAL proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

// For GET requests we use the built-in proxy handler (no credit check needed)
export const GET = route.GET;