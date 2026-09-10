import { validatePredictorParams, SUPPORTED_EXAMS } from "../lib/validations/predictor";
import { predictColleges } from "../lib/services/predictorService";
import { prisma } from "../lib/prisma";

async function runPredictorTests() {
  console.log("🚀 Running College Predictor Tests (Validation & Algorithm)...\n");

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
    // ------------------------------------------------------------
    // 1. INPUT VALIDATION TESTS
    // ------------------------------------------------------------
    console.log("--- 1. Validation Tests ---");

    // 1.1 Missing Exam
    {
      const res = validatePredictorParams("", 1500);
      assert(!res.isValid, "Missing exam is rejected");
      assert(Boolean(res.errors?.some((e) => e.field === "exam")), "Error mentions exam field");
    }

    // 1.2 Unsupported Exam
    {
      const res = validatePredictorParams("GRE", 1500);
      assert(!res.isValid, "Unsupported exam 'GRE' is rejected");
      assert(Boolean(res.errors?.[0]?.message.includes("Unsupported exam")), "Helpful message with supported exams");
    }

    // 1.3 Missing Rank
    {
      const res = validatePredictorParams("JEE Main", null);
      assert(!res.isValid, "Missing rank is rejected");
      assert(Boolean(res.errors?.some((e) => e.field === "rank")), "Error mentions rank field");
    }

    // 1.4 Negative Rank
    {
      const res = validatePredictorParams("JEE Main", -50);
      assert(!res.isValid, "Negative rank (-50) is rejected");
      assert(Boolean(res.errors?.[0]?.message.includes("positive")), "Error mentions positive number requirement");
    }

    // 1.5 Zero Rank
    {
      const res = validatePredictorParams("JEE Main", 0);
      assert(!res.isValid, "Rank 0 is rejected");
    }

    // 1.6 Floating Point Rank
    {
      const res = validatePredictorParams("JEE Main", 123.45);
      assert(!res.isValid, "Floating point rank (123.45) is rejected");
      assert(Boolean(res.errors?.[0]?.message.includes("whole integer")), "Error mentions whole integer");
    }

    // 1.7 Non-numeric Rank string
    {
      const res = validatePredictorParams("JEE Main", "abc");
      assert(!res.isValid, "Non-numeric string rank ('abc') is rejected");
    }

    // 1.8 Exorbitant Rank exceeding maximum reasonable boundary
    {
      const res = validatePredictorParams("JEE Main", 50000000);
      assert(!res.isValid, "Rank 50,000,000 is rejected as out of range");
    }

    // 1.9 Valid Input & Case Normalization
    {
      const res = validatePredictorParams("jee main", "2500");
      assert(res.isValid, "Valid inputs are accepted");
      assert(res.data?.exam === "JEE Main", "Exam name normalized to canonical 'JEE Main'");
      assert(res.data?.rank === 2500, "String rank converted to integer 2500");
      assert(res.data?.category === "General", "Category defaults to 'General'");
    }

    // 1.10 All Supported Exams are recognized
    {
      for (const exam of SUPPORTED_EXAMS) {
        const res = validatePredictorParams(exam.toLowerCase(), 1000);
        assert(res.isValid && res.data?.exam === exam, `Recognized supported exam: ${exam}`);
      }
    }

    // ------------------------------------------------------------
    // 2. PREDICTION ALGORITHM & DATABASE MATCHING TESTS
    // ------------------------------------------------------------
    console.log("\n--- 2. Deterministic Prediction Logic & DB Matching ---");

    // 2.1 Top Ranker / Safe Match (JEE Advanced Rank 50)
    // IIT Bombay CSE 2024 closing rank is 68. Rank 50 is ratio 50/68 = 0.735 <= 0.85 -> SAFE
    {
      const result = await predictColleges({
        exam: "JEE Advanced",
        rank: 50,
        category: "General",
      });

      assert(result.recommendations.length > 0, "Recommendations found for JEE Advanced Rank 50");
      assert(result.query.rank === 50, "Query rank echoed correctly");
      assert(result.summary.safeCount > 0, "Has SAFE recommendations");

      const topRec = result.recommendations[0];
      assert(topRec.probability === "SAFE", "Top recommendation is categorized as SAFE");
      assert(topRec.probabilityPercent >= 90, `Probability percentage is high (${topRec.probabilityPercent}%)`);
      assert(topRec.rankDelta > 0, `Rank delta is positive surplus (+${topRec.rankDelta})`);
      assert(
        topRec.explanation.includes("comfortably within") && topRec.explanation.includes("safety margin"),
        "Explanation clearly details the safety margin rationale"
      );
      assert(topRec.college.name.length > 0, "Contains valid college name");
      assert(topRec.course.name.length > 0, "Contains valid course name");
      assert(topRec.cutoff.closingRank >= 50, "Cutoff closing rank is higher than candidate rank");
    }

    // 2.2 Borderline / Target Match (JEE Advanced Rank 70)
    // IIT Bombay CSE closing rank is 68. Rank 70 is ratio 70/68 = 1.029 -> TARGET (0.85 < ratio <= 1.05)
    {
      const result = await predictColleges({
        exam: "JEE Advanced",
        rank: 70,
        category: "General",
      });

      const iitbCse = result.recommendations.find(
        (r) => r.college.slug === "iit-bombay" && r.course.name.includes("Computer Science")
      );

      assert(Boolean(iitbCse), "IIT Bombay CSE matched for rank 70");
      if (iitbCse) {
        assert(iitbCse.probability === "TARGET", "Categorized as TARGET for rank near closing cutoff");
        assert(
          iitbCse.probabilityPercent >= 55 && iitbCse.probabilityPercent <= 84,
          `Probability percent in expected target range (${iitbCse.probabilityPercent}%)`
        );
        assert(
          iitbCse.explanation.includes("competitive and close"),
          "Explanation highlights competitive/close candidate status"
        );
      }
    }

    // 2.3 Long-Shot / Reach Match (JEE Advanced Rank 82)
    // IIT Bombay CSE closing rank is 68. Ratio 82/68 = 1.205 -> REACH (1.05 < ratio <= 1.25)
    {
      const result = await predictColleges({
        exam: "JEE Advanced",
        rank: 82,
        category: "General",
      });

      const iitbCse = result.recommendations.find(
        (r) => r.college.slug === "iit-bombay" && r.course.name.includes("Computer Science")
      );

      assert(Boolean(iitbCse), "IIT Bombay CSE matched for reach rank 82");
      if (iitbCse) {
        assert(iitbCse.probability === "REACH", "Categorized as REACH for rank slightly above cutoff");
        assert(
          iitbCse.probabilityPercent >= 20 && iitbCse.probabilityPercent <= 45,
          `Probability percent in reach bracket (${iitbCse.probabilityPercent}%)`
        );
        assert(
          iitbCse.explanation.includes("spot counseling") || iitbCse.explanation.includes("extended"),
          "Explanation describes spot/extended rounds"
        );
      }
    }

    // 2.4 Multi-Tier Recommendations (JEE Main Rank 1500)
    // Seeds have NIT Trichy (CSE closing 1420), DTU (CSE closing 4100, IT closing 6200), IIIT Hyderabad (CSE closing 1650)
    {
      const result = await predictColleges({
        exam: "JEE Main",
        rank: 1500,
        category: "General",
      });

      assert(result.recommendations.length >= 3, `Returned ${result.recommendations.length} recommendations for JEE Main 1500`);

      // Verify ordering: all SAFEs before TARGETs, all TARGETs before REACHes
      let seenTarget = false;
      let seenReach = false;
      let orderValid = true;

      for (const rec of result.recommendations) {
        if (rec.probability === "TARGET") seenTarget = true;
        if (rec.probability === "REACH") seenReach = true;

        if (rec.probability === "SAFE" && (seenTarget || seenReach)) orderValid = false;
        if (rec.probability === "TARGET" && seenReach) orderValid = false;
      }

      assert(orderValid, "Recommendations strictly ordered: SAFE -> TARGET -> REACH");
      assert(result.summary.totalRecommendations === result.recommendations.length, "Summary count matches array length");
    }

    // 2.5 Empty Result / Unlikely Matches (No matches for rank 2,000,000 in JEE Advanced)
    console.log("\n--- 3. Empty & Edge Case Handlers ---");
    {
      const result = await predictColleges({
        exam: "JEE Advanced",
        rank: 2000000,
        category: "General",
      });

      assert(result.recommendations.length === 0, "Returns 0 recommendations for extremely high rank (no matches)");
      assert(result.summary.totalRecommendations === 0, "Summary total count is 0");
      assert(result.summary.safeCount === 0, "Safe count is 0");
    }

    // 2.6 Max Fee Filtering
    console.log("\n--- 4. Max Fee Filtering ---");
    {
      // Predict with fee filter
      const unfiltered = await predictColleges({
        exam: "BITSAT",
        rank: 290,
        category: "General",
      });

      const filtered = await predictColleges({
        exam: "BITSAT",
        rank: 290,
        category: "General",
        maxFee: 100000, // Very low fee ceiling
      });

      assert(unfiltered.recommendations.length > 0, "Unfiltered BITSAT returns options");
      assert(filtered.recommendations.length === 0, "Filtered with low fee cap excludes high-fee private colleges");
    }

    // ------------------------------------------------------------
    // Summary
    // ------------------------------------------------------------
    console.log("\n==========================================");
    console.log(`Predictor Test Results: ${passed} Passed, ${failed} Failed`);
    console.log("==========================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Fatal error running tests:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPredictorTests();
