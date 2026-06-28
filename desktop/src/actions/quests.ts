"use server";
import { db } from "@/db";
import { quests, memberQuests } from "@/db/schema/achievements";
import { memberProgress } from "@/db/schema/gamification";
import { eq, and } from "drizzle-orm";

export async function getActiveQuests(memberId: number = 1) {
  try {
    const activeMemberQuests = await db.select()
      .from(memberQuests)
      .where(eq(memberQuests.memberId, memberId));
      
    const allQuests = await db.select().from(quests);
    
    return allQuests.map(quest => {
      const progress = activeMemberQuests.find(mq => mq.questId === quest.id);
      return { ...quest, progress };
    });
  } catch (error) {
    console.error("Quests DB Error:", error);
    return [];
  }
}

export async function toggleQuest(memberId: number, questId: number) {
  try {
    const quest = await db.select().from(quests).where(eq(quests.id, questId));
    if (quest.length === 0) return { success: false, error: "Quest not found" };
    const pointsReward = quest[0].rewardPoints;

    const existingProgress = await db.select().from(memberQuests).where(
      and(
        eq(memberQuests.memberId, memberId),
        eq(memberQuests.questId, questId)
      )
    );

    let newStatus = true;
    if (existingProgress.length > 0) {
      newStatus = !existingProgress[0].isCompleted;
      await db.update(memberQuests).set({
        isCompleted: newStatus,
        completedAt: newStatus ? new Date() : null,
        updatedAt: new Date()
      }).where(eq(memberQuests.id, existingProgress[0].id));
    } else {
      await db.insert(memberQuests).values({
        memberId,
        questId,
        isCompleted: true,
        completedAt: new Date()
      });
    }

    // Update member points balance
    const mProgress = await db.select().from(memberProgress).where(eq(memberProgress.memberId, memberId));
    if (mProgress.length > 0) {
      const currentPoints = mProgress[0].pointsBalance;
      const updatedPoints = newStatus ? (currentPoints + pointsReward) : Math.max(0, currentPoints - pointsReward);
      await db.update(memberProgress).set({
        pointsBalance: updatedPoints,
        updatedAt: new Date()
      }).where(eq(memberProgress.id, mProgress[0].id));
    }

    return { success: true, isCompleted: newStatus };
  } catch (error) {
    console.error("Toggle Quest DB Error:", error);
    return { success: false, error: "Failed to toggle quest status" };
  }
}
