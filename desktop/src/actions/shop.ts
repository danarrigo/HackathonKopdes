"use server";
import { db } from "@/db";
import { items, memberItems, memberProgress } from "@/db/schema/gamification";
import { eq, and } from "drizzle-orm";

export async function buyShopItem(memberId: number, itemCode: string, cost: number) {
  try {
    // 1. Get or create item in the database
    let dbItem = await db.select().from(items).where(eq(items.effectType, itemCode));
    if (dbItem.length === 0) {
      // Insert dynamic item for the database mapping
      const [newItem] = await db.insert(items).values({
        name: itemCode == 's1' ? 'Freeze Streak' : itemCode == 's2' ? 'Point Bomb' : itemCode == 's3' ? 'Streak Shield' : 'Poin Booster',
        description: 'Store Item',
        priceInPoints: cost,
        effectType: itemCode,
      }).returning();
      dbItem = [newItem];
    }

    const price = dbItem[0].priceInPoints;

    // 2. Check points balance
    const progress = await db.select().from(memberProgress).where(eq(memberProgress.memberId, memberId));
    if (progress.length === 0) return { success: false, error: "Member progress not found" };

    if (progress[0].pointsBalance < price) {
      return { success: false, error: "Insufficient points" };
    }

    // 3. Deduct points
    await db.update(memberProgress).set({
      pointsBalance: progress[0].pointsBalance - price,
      updatedAt: new Date()
    }).where(eq(memberProgress.id, progress[0].id));

    // 4. Update member item inventory
    const existingItem = await db.select().from(memberItems).where(
      and(
        eq(memberItems.memberId, memberId),
        eq(memberItems.itemId, dbItem[0].id)
      )
    );

    if (existingItem.length > 0) {
      await db.update(memberItems).set({
        quantity: existingItem[0].quantity + 1,
        updatedAt: new Date()
      }).where(eq(memberItems.id, existingItem[0].id));
    } else {
      await db.insert(memberItems).values({
        memberId,
        itemId: dbItem[0].id,
        quantity: 1
      });
    }

    return { success: true, updatedPoints: progress[0].pointsBalance - price };
  } catch (error) {
    console.error("Buy Shop Item DB Error:", error);
    return { success: false, error: "Failed to purchase item" };
  }
}
