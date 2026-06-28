/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getDashboardData } from "@/actions/dashboard";
import { getFinancialsData } from "@/actions/financials";
import { getActiveQuests } from "@/actions/quests";
import { getGovernanceData, getKoperasiStats } from "@/actions/governance";
import { getArenaData, getBattleHistory } from "@/actions/arena";
import { getMemberBadges, getWinRate, getStoreItems, getLeaderboard, getLeaderboardProvincial, getLeaderboardNational, getMemberInventory } from "@/actions/gamification";
import { getMarketplaceItems } from "@/actions/shop";
import { getEventsByCooperative, getMemberEventParticipations } from "@/actions/events";
import { getActiveMembers } from "@/actions/members";
import { getActiveLoan } from "@/actions/financials";
import { createSupabaseClient } from '@/utils/supabase/client-api';
import { db } from '@/db';
import { members } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let memberId = -1;
    let cooperativeId = -1;
    let currentProvinsi: string | null = null;

    const headerList = await headers();
    const authHeader = headerList.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required: missing Bearer token' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    const token = authHeader.substring(7);
    const supabase = createSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session token' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    const [member] = await db.select().from(members).where(eq(members.userId, user.id));
    if (!member) {
      return NextResponse.json(
        { success: false, error: 'No member profile linked to this account' },
        { status: 403, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    memberId = member.id;
    if (member.cooperativeId) cooperativeId = member.cooperativeId;
    currentProvinsi = member.provinsi || null;
    
    // Fetch data sequentially to prevent connection pool exhaustion (max 15 connections)
    const dashboardData = await getDashboardData(memberId);
    const financialsData = await getFinancialsData(memberId);
    const questsData = await getActiveQuests(memberId);
    const governanceData = await getGovernanceData(cooperativeId);
    const arenaData = await getArenaData(memberId);
    const koperasiStats = await getKoperasiStats(cooperativeId);
    const battleHistoryData = await getBattleHistory(memberId);
    const badgesData = await getMemberBadges(memberId);
    const winRateData = await getWinRate(memberId);
    const storeItemsData = await getStoreItems();
    const leaderboardData = await getLeaderboard(cooperativeId);
    const inventoryData = await getMemberInventory(memberId);
    const marketplaceData = await getMarketplaceItems();
    const eventsData = await getEventsByCooperative(cooperativeId);
    const eventParticipationsData = await getMemberEventParticipations(memberId);
    const leaderboardByProvinsi = currentProvinsi ? await getLeaderboardProvincial(currentProvinsi).catch(() => []) : [];
    const leaderboardByNasional = await getLeaderboardNational().catch(() => []);
    const activeMembersData = cooperativeId ? await getActiveMembers(cooperativeId).catch(() => []) : [];
    const activeLoanData = await getActiveLoan(memberId).catch(() => null);

    return NextResponse.json({
      success: true,
      data: {
        dashboard: {
          ...dashboardData,
          level: dashboardData?.progress?.level ?? 1,
        },
        financials: financialsData,
        quests: questsData,
        governance: governanceData,
        arena: {
          ...arenaData,
          pastBattles: battleHistoryData?.pastBattles || []
        },
        koperasiStats: koperasiStats,
        badges: badgesData,
        winRate: winRateData,
        storeItems: storeItemsData,
        leaderboard: leaderboardData,
        inventory: inventoryData,
        marketplaceItems: marketplaceData,
        events: (eventsData as any)?.events || [],
        joinedEventIds: ((eventParticipationsData as any)?.participations || []).map((p: any) => p?.event?.id).filter((id: any) => id != null),
        leaderboardByProvinsi,
        leaderboardByNasional: leaderboardByNasional,
        activeMembers: activeMembersData,
        activeLoan: activeLoanData,
        activeEffect: dashboardData?.progress?.activeEffect ?? null,
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
