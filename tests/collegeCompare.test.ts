import { getCollegesForComparison } from "../lib/services/collegeService";
import { prisma } from "../lib/prisma";

async function runCompareTests() {
  console.log("🚀 Running College Comparison API & Service Tests...\n");

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
    // 1. Compare 2 colleges
    console.log("--- 1. Compare 2 Colleges ---");
    {
      const result = await getCollegesForComparison(["iit-bombay", "iit-delhi"]);
      assert(result.length === 2, `Returned exactly 2 colleges (got ${result.length})`);
      assert(result[0].slug === "iit-bombay", "First college is IIT Bombay");
      assert(result[1].slug === "iit-delhi", "Second college is IIT Delhi");

      // Verify placement, fees, rating, location fields
      for (const col of result) {
        assert(Boolean(col.location.city && col.location.state), `Location present for ${col.name}`);
        assert(typeof col.minAnnualFee === "number" && typeof col.maxAnnualFee === "number", `Fees present for ${col.name}`);
        assert(typeof col.rating === "number", `Rating present for ${col.name}`);
        assert(col.placements.length > 0, `Placement data present for ${col.name}`);
      }
    }

    // 2. Compare 3 colleges
    console.log("\n--- 2. Compare 3 Colleges ---");
    {
      const result = await getCollegesForComparison(["iit-bombay", "bits-pilani", "rvce-bengaluru"]);
      assert(result.length === 3, `Returned exactly 3 colleges (got ${result.length})`);
      assert(result[0].slug === "iit-bombay", "First college matches");
      assert(result[1].slug === "bits-pilani", "Second college matches");
      assert(result[2].slug === "rvce-bengaluru", "Third college matches");
    }

    // 3. Duplicate selection prevention
    console.log("\n--- 3. Duplicate Selection Prevention ---");
    {
      const result = await getCollegesForComparison(["iit-bombay", "iit-bombay", "iit-delhi"]);
      assert(result.length === 2, "Duplicates are pruned (got 2 colleges for 3 requests with duplicate)");
      assert(result[0].slug === "iit-bombay", "First is IIT Bombay");
      assert(result[1].slug === "iit-delhi", "Second is IIT Delhi");
    }

    // 4. Ceiling enforcement: more than 3 colleges capped at 3
    console.log("\n--- 4. Ceiling Enforcement (Max 3) ---");
    {
      const result = await getCollegesForComparison([
        "iit-bombay",
        "iit-delhi",
        "bits-pilani",
        "nit-trichy",
        "iiit-hyderabad",
      ]);
      assert(result.length === 3, `Pruned to maximum 3 colleges (got ${result.length})`);
    }

    // 5. Empty comparison
    console.log("\n--- 5. Empty Comparison ---");
    {
      const result = await getCollegesForComparison([]);
      assert(result.length === 0, "Empty array returns 0 colleges");

      const blankResult = await getCollegesForComparison(["", "   "]);
      assert(blankResult.length === 0, "Whitespace array returns 0 colleges");
    }

    // 6. Graceful handling of missing / mixed non-existent colleges
    console.log("\n--- 6. Graceful Handling of Missing / Non-Existent Colleges ---");
    {
      const result = await getCollegesForComparison(["iit-bombay", "does-not-exist-999"]);
      assert(result.length === 1, "Only existing college returned when 1 does not exist");
      assert(result[0].slug === "iit-bombay", "Valid college is retained");
    }

    // 7. Removing a college scenario
    console.log("\n--- 7. Removing a College ---");
    {
      const initial = ["iit-bombay", "iit-delhi", "bits-pilani"];
      const afterRemoval = initial.filter((id) => id !== "iit-delhi");
      const result = await getCollegesForComparison(afterRemoval);
      assert(result.length === 2, "After removal array contains 2 colleges");
      assert(result.every((c) => c.slug !== "iit-delhi"), "IIT Delhi removed from comparison result");
    }
  } catch (error) {
    console.error("❌ Comparison test error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log(`\n========================================`);
  console.log(`📊 COMPARISON TESTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runCompareTests();
