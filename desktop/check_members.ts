import { db } from './src/db';
import { members } from './src/db/schema';

async function main() {
  const allMembers = await db.select().from(members);
  console.log("All members:", allMembers);
}

main().catch(console.error);
