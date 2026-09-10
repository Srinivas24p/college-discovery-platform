import { getCollegeByIdOrSlug } from "../lib/services/collegeService";
import { prisma } from "../lib/prisma";

async function runDetailTests() {
  console.log("🚀 Running College Detail API & Service Tests...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: unknown) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`, detail !== undefined ? detail : "");
      failed++;
    }
  }

  try {
    // 1. Fetch by valid slug
    console.log("--- 1. Fetch by Slug (iit-bombay) ---");
    {
      const college = await getCollegeByIdOrSlug("iit-bombay");
      assert(college !== null, "Found college by slug 'iit-bombay'");
      assert(college?.name === "Indian Institute of Technology Bombay", "College name matches");
      assert(college?.location.city === "Mumbai", "Location city is Mumbai");
      assert(college?.location.state === "Maharashtra", "Location state is Maharashtra");
      assert((college?.courses.length ?? 0) === 3, `Courses count is 3 (got ${college?.courses.length})`);
      assert((college?.placements.length ?? 0) > 0, "Placements list populated");
      assert((college?.reviews.length ?? 0) > 0, "Reviews list populated");
      assert((college?.cutoffs.length ?? 0) > 0, "Cutoffs list populated");

      // Verify detailed review data
      const firstReview = college?.reviews[0];
      assert(Boolean(firstReview?.authorName), "Review author exists");
      assert(Boolean(firstReview?.pros), "Review pros exists");
      assert(Boolean(firstReview?.cons), "Review cons exists");
    }

    // 2. Fetch by valid ID
    console.log("\n--- 2. Fetch by ID ---");
    {
      const first = await prisma.college.findFirst();
      assert(first !== null, "Found a college in database to test ID lookup");

      if (first) {
        const byId = await getCollegeByIdOrSlug(first.id);
        assert(byId !== null, `Found college by database ID: ${first.id}`);
        assert(byId?.name === first.name, "Name matches ID lookup");
      }
    }

    // 3. Fetch non-existent college (404 scenario)
    console.log("\n--- 3. Non-Existent College Lookup ---");
    {
      const nonExistent = await getCollegeByIdOrSlug("non-existent-college-9999");
      assert(nonExistent === null, "Returns null for non-existent slug");

      const emptyLookup = await getCollegeByIdOrSlug("   ");
      assert(emptyLookup === null, "Returns null for empty string");
    }
  } catch (error) {
    console.error("❌ Detail test error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log(`\n========================================`);
  console.log(`📊 DETAIL TESTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runDetailTests();
