import { getDb } from "./db";

/**
 * Badge unlock logic.
 * Called after a proof_submission is approved.
 * Checks and awards badges the user has newly qualified for.
 */
export async function checkAndAwardBadges(userId: number, seasonId: number) {
  const sql = getDb();

  // Get user's approved proof stats for current season
  const approvedProofs = await sql`
    SELECT r_category, COUNT(*) as cnt
    FROM proof_submissions
    WHERE user_id = ${userId}
      AND status = 'approved'
      AND season_id = ${seasonId}
    GROUP BY r_category
  `;

  const totalApproved = approvedProofs.reduce(
    (sum, row) => sum + Number(row.cnt),
    0
  );
  const distinctRCategories = approvedProofs.length;
  const completedCategories = approvedProofs.map((r) => r.r_category);

  // --- BRONZE: first approved proof ---
  if (totalApproved >= 1) {
    await tryAwardBadge(sql, userId, "bronze", seasonId);
  }

  // --- SILVER: 5 approved across 3+ R categories ---
  if (totalApproved >= 5 && distinctRCategories >= 3) {
    await tryAwardBadge(sql, userId, "silver", seasonId);
  }

  // --- GOLD: at least one in EACH of the 5 R categories ---
  if (distinctRCategories >= 5) {
    await tryAwardBadge(sql, userId, "gold", seasonId);
  }

  // --- CATEGORY-SPECIFIC MEDALS ---
  for (const cat of completedCategories) {
    await tryAwardCategoryMedal(sql, userId, cat as string, seasonId);
  }
}

async function tryAwardBadge(
  sql: ReturnType<typeof getDb>,
  userId: number,
  tier: string,
  seasonId: number
) {
  // Check if badge already earned this season
  const existing = await sql`
    SELECT ub.id FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ${userId}
      AND b.tier = ${tier}
      AND ub.season_id = ${seasonId}
  `;
  if (existing.length > 0) return;

  // Get badge id
  const badge = await sql`
    SELECT id FROM badges WHERE tier = ${tier} AND r_required IS NULL LIMIT 1
  `;
  if (badge.length === 0) return;

  await sql`
    INSERT INTO user_badges (user_id, badge_id, season_id)
    VALUES (${userId}, ${badge[0].id}, ${seasonId})
    ON CONFLICT (user_id, badge_id, season_id) DO NOTHING
  `;
}

async function tryAwardCategoryMedal(
  sql: ReturnType<typeof getDb>,
  userId: number,
  rCategory: string,
  seasonId: number
) {
  const existing = await sql`
    SELECT ub.id FROM user_badges ub
    JOIN badges b ON ub.badge_id = b.id
    WHERE ub.user_id = ${userId}
      AND b.tier = 'category'
      AND b.r_required = ${rCategory}
      AND ub.season_id = ${seasonId}
  `;
  if (existing.length > 0) return;

  const badge = await sql`
    SELECT id FROM badges WHERE tier = 'category' AND r_required = ${rCategory} LIMIT 1
  `;
  if (badge.length === 0) return;

  await sql`
    INSERT INTO user_badges (user_id, badge_id, season_id)
    VALUES (${userId}, ${badge[0].id}, ${seasonId})
    ON CONFLICT (user_id, badge_id, season_id) DO NOTHING
  `;
}

/**
 * Get reward tier based on number of distinct R categories completed.
 */
export function getRewardTier(distinctRCount: number): {
  tier: number;
  items: { name: string; quantity: number }[];
} {
  switch (distinctRCount) {
    case 1:
      return { tier: 1, items: [{ name: "Ballpen", quantity: 1 }] };
    case 2:
      return {
        tier: 2,
        items: [
          { name: "Ballpen", quantity: 2 },
          { name: "Notebook", quantity: 1 },
        ],
      };
    case 3:
      return {
        tier: 3,
        items: [
          { name: "Ballpen", quantity: 3 },
          { name: "Notebook", quantity: 2 },
          { name: "Pencil Case", quantity: 1 },
        ],
      };
    case 4:
      return {
        tier: 4,
        items: [
          { name: "Ballpen", quantity: 3 },
          { name: "Notebook", quantity: 2 },
          { name: "Pencil Case", quantity: 1 },
          { name: "Art/Ruler Set", quantity: 1 },
        ],
      };
    case 5:
      return {
        tier: 5,
        items: [{ name: "Complete School Kit Bundle", quantity: 1 }],
      };
    default:
      return { tier: 0, items: [] };
  }
}
