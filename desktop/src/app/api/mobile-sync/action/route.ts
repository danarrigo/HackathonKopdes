import { NextResponse } from 'next/server';
import { castVote } from "@/actions/governance";
import { toggleQuest } from "@/actions/quests";
import { buyShopItem } from "@/actions/shop";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, memberId } = body;

    let result: any = { success: false, error: "Invalid action" };

    if (action === 'vote') {
      const { proposalId, voteType } = body;
      // Map voteType from mobile app ('Setuju' -> 'agree', 'Tolak' -> 'reject', 'Abstain' -> 'abstain')
      const mappedVoteType = voteType === 'Setuju' ? 'agree' : voteType === 'Tolak' ? 'reject' : 'abstain';
      result = await castVote(memberId || 1, proposalId || 1, mappedVoteType);
    } else if (action === 'toggle-quest') {
      const { questId } = body;
      result = await toggleQuest(memberId || 1, questId);
    } else if (action === 'buy-item') {
      const { itemId, cost } = body;
      result = await buyShopItem(memberId || 1, itemId, cost);
    }

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error("API Action Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { 
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
