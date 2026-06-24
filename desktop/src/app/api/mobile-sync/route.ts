import { NextResponse } from 'next/server';
import { getDashboardData } from "@/actions/dashboard";
import { getFinancialsData } from "@/actions/financials";
import { getActiveQuests } from "@/actions/quests";
import { getGovernanceData } from "@/actions/governance";
import { getArenaData } from "@/actions/arena";

export async function GET() {
  try {
    const memberId = 1; // Default to member 1 for local testing
    
    // Fetch all data concurrently
    const [dashboardData, financialsData, questsData, governanceData, arenaData] = await Promise.all([
      getDashboardData(memberId),
      getFinancialsData(memberId),
      getActiveQuests(memberId),
      getGovernanceData(),
      getArenaData(memberId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        dashboard: dashboardData,
        financials: financialsData,
        quests: questsData,
        governance: governanceData,
        arena: arenaData,
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch data" }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
