import { getColleges } from "../lib/services/collegeService";
import { validateAndParseCollegeQueryParams } from "../lib/validations/college";
import { prisma } from "../lib/prisma";
import { CollegeOwnership } from "../lib/generated/prisma/client";

async function runIntegrationTests() {
  console.log("🚀 Starting College Listing + Search Integration Tests...\n");

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
    // 1. Default Request Test
    console.log("--- 1. Default Request ---");
    {
      const params = validateAndParseCollegeQueryParams(new URLSearchParams());
      assert(params.isValid, "Default query parameters valid");
      const result = await getColleges(params.data!);

      assert(result.items.length === 8, `Returned all 8 seeded colleges (got ${result.items.length})`);
      assert(result.pagination.page === 1, "Page is 1");
      assert(result.pagination.totalCount === 8, "Total count is 8");
      assert(result.pagination.totalPages === 1, "Total pages is 1");
      assert(result.pagination.hasNextPage === false, "hasNextPage is false");
      assert(result.pagination.hasPrevPage === false, "hasPrevPage is false");

      // Verify card data structure
      const first = result.items[0];
      assert(Boolean(first.id && first.name && first.slug), "Card contains id, name, slug");
      assert(Boolean(first.location?.city && first.location?.state), "Card contains location city and state");
      assert(typeof first.fees?.minAnnualFee === "number", "Card contains minAnnualFee");
      assert(typeof first.rating === "number", "Card contains rating");
      assert(Boolean(first.latestPlacement?.highestPackageLPA), "Card contains latest placement stats");
      assert(first.coursesSummary?.totalCount > 0, "Card contains courses summary");
    }

    // 2. Keyword Search Test
    console.log("\n--- 2. Keyword Search ---");
    {
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ search: "Bombay" }));
      const result = await getColleges(params.data!);
      assert(result.items.length === 1, "Search for 'Bombay' returns 1 college");
      assert(
        result.items[0]?.name.includes("Bombay"),
        "Matched college name contains 'Bombay'"
      );
    }

    // Case-insensitive search test
    {
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ search: "tEcHnOlOgIcAl" }));
      const result = await getColleges(params.data!);
      assert(result.items.length >= 1, "Case-insensitive search for 'tEcHnOlOgIcAl' matched DTU");
      assert(
        result.items.some((c) => c.slug === "dtu-delhi"),
        "Found DTU in case-insensitive search"
      );
    }

    // 3. Location Filters (State & City)
    console.log("\n--- 3. Location Filters ---");
    {
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ state: "Delhi" }));
      const result = await getColleges(params.data!);
      assert(result.items.length === 2, `State filter 'Delhi' returns 2 colleges (got ${result.items.length})`);
      assert(
        result.items.every((c) => c.location.state === "Delhi"),
        "All returned colleges belong to Delhi"
      );
    }

    {
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ city: "Mumbai" }));
      const result = await getColleges(params.data!);
      assert(result.items.length === 1, "City filter 'Mumbai' returns 1 college");
      assert(result.items[0]?.location.city === "Mumbai", "City is Mumbai");
    }

    // 4. Fee Range Filters
    console.log("\n--- 4. Fee Range Filters ---");
    {
      // Colleges with fees up to 200,000 INR
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ maxFee: "200000" }));
      const result = await getColleges(params.data!);
      assert(result.items.length > 0, "Found colleges with fees under 200,000 INR");
      assert(
        result.items.every((c) => c.fees.minAnnualFee <= 200000),
        "All returned colleges have minAnnualFee <= 200000"
      );
    }

    {
      // Colleges with fees between 300,000 and 600,000 INR
      const params = validateAndParseCollegeQueryParams(
        new URLSearchParams({ minFee: "300000", maxFee: "600000" })
      );
      const result = await getColleges(params.data!);
      assert(result.items.length >= 2, `Found high-fee colleges (BITS, IIIT-H, etc., got ${result.items.length})`);
    }

    // 5. Rating Filter
    console.log("\n--- 5. Rating Filter ---");
    {
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ minRating: "4.7" }));
      const result = await getColleges(params.data!);
      assert(result.items.length >= 2, "Found colleges with rating >= 4.7");
      assert(
        result.items.every((c) => c.rating >= 4.7),
        "Every college meets minRating of 4.7"
      );
    }

    // 6. Ownership and Degree Level Filters
    console.log("\n--- 6. Ownership & Degree Level Filters ---");
    {
      const params = validateAndParseCollegeQueryParams(
        new URLSearchParams({ ownership: "PUBLIC" })
      );
      const result = await getColleges(params.data!);
      assert(
        result.items.every((c) => c.ownership === CollegeOwnership.PUBLIC),
        "All filtered colleges are PUBLIC institutions"
      );
    }

    {
      const params = validateAndParseCollegeQueryParams(
        new URLSearchParams({ degree: "B_TECH" })
      );
      const result = await getColleges(params.data!);
      assert(result.items.length > 0, "Degree filter 'B_TECH' returned colleges");
    }

    // 7. Sorting Tests
    console.log("\n--- 7. Sorting Variations ---");
    {
      // Sort by rating desc
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ sortBy: "rating" }));
      const result = await getColleges(params.data!);
      for (let i = 0; i < result.items.length - 1; i++) {
        assert(
          result.items[i].rating >= result.items[i + 1].rating,
          `Rating sort descending: index ${i} (${result.items[i].rating}) >= index ${i + 1} (${result.items[i + 1].rating})`
        );
      }
    }

    {
      // Sort by fee asc
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ sortBy: "fee_asc" }));
      const result = await getColleges(params.data!);
      for (let i = 0; i < result.items.length - 1; i++) {
        assert(
          result.items[i].fees.minAnnualFee <= result.items[i + 1].fees.minAnnualFee,
          `Fee sort ascending: index ${i} (${result.items[i].fees.minAnnualFee}) <= index ${i + 1} (${result.items[i + 1].fees.minAnnualFee})`
        );
      }
    }

    {
      // Sort by name asc
      const params = validateAndParseCollegeQueryParams(new URLSearchParams({ sortBy: "name" }));
      const result = await getColleges(params.data!);
      for (let i = 0; i < result.items.length - 1; i++) {
        assert(
          result.items[i].name.localeCompare(result.items[i + 1].name) <= 0,
          `Alphabetical sort: "${result.items[i].name}" comes before "${result.items[i + 1].name}"`
        );
      }
    }

    // 8. Pagination Tests
    console.log("\n--- 8. Pagination Tests ---");
    {
      // Page 1 of size 3
      const p1 = validateAndParseCollegeQueryParams(new URLSearchParams({ page: "1", pageSize: "3" }));
      const res1 = await getColleges(p1.data!);
      assert(res1.items.length === 3, "Page 1 returned 3 items");
      assert(res1.pagination.page === 1, "Current page is 1");
      assert(res1.pagination.pageSize === 3, "PageSize is 3");
      assert(res1.pagination.totalCount === 8, "Total count is 8");
      assert(res1.pagination.totalPages === 3, "Total pages is 3");
      assert(res1.pagination.hasNextPage === true, "Page 1 hasNextPage is true");
      assert(res1.pagination.hasPrevPage === false, "Page 1 hasPrevPage is false");

      // Page 2 of size 3
      const p2 = validateAndParseCollegeQueryParams(new URLSearchParams({ page: "2", pageSize: "3" }));
      const res2 = await getColleges(p2.data!);
      assert(res2.items.length === 3, "Page 2 returned 3 items");
      assert(res2.pagination.page === 2, "Current page is 2");
      assert(res2.pagination.hasNextPage === true, "Page 2 hasNextPage is true");
      assert(res2.pagination.hasPrevPage === true, "Page 2 hasPrevPage is true");

      // Ensure items on page 1 and page 2 are distinct
      const ids1 = new Set(res1.items.map((c) => c.id));
      const ids2 = new Set(res2.items.map((c) => c.id));
      const overlap = [...ids1].some((id) => ids2.has(id));
      assert(!overlap, "Items between Page 1 and Page 2 do not overlap");

      // Page 3 of size 3 (last page with remaining 2 items)
      const p3 = validateAndParseCollegeQueryParams(new URLSearchParams({ page: "3", pageSize: "3" }));
      const res3 = await getColleges(p3.data!);
      assert(res3.items.length === 2, "Page 3 returned remaining 2 items");
      assert(res3.pagination.hasNextPage === false, "Page 3 hasNextPage is false");
      assert(res3.pagination.hasPrevPage === true, "Page 3 hasPrevPage is true");
    }

    // 9. No Results Test
    console.log("\n--- 9. No Results Test ---");
    {
      const params = validateAndParseCollegeQueryParams(
        new URLSearchParams({ search: "NonExistentUniversity999XYZ" })
      );
      const result = await getColleges(params.data!);
      assert(result.items.length === 0, "No results returned for unmatched search");
      assert(result.pagination.totalCount === 0, "totalCount is 0");
      assert(result.pagination.totalPages === 1, "totalPages is 1 for empty results");
      assert(result.pagination.hasNextPage === false, "hasNextPage is false");
      assert(result.pagination.hasPrevPage === false, "hasPrevPage is false");
    }

    // 10. Invalid Query Parameters
    console.log("\n--- 10. Invalid Parameters Prevention ---");
    {
      const invalidCombinations = [
        { sp: new URLSearchParams({ minFee: "900000", maxFee: "100000" }), desc: "minFee > maxFee" },
        { sp: new URLSearchParams({ minRating: "9.9" }), desc: "Rating > 5.0" },
        { sp: new URLSearchParams({ page: "-2" }), desc: "Negative page" },
        { sp: new URLSearchParams({ pageSize: "150" }), desc: "pageSize exceeds limit" },
        { sp: new URLSearchParams({ ownership: "INVALID" }), desc: "Invalid ownership enum" },
      ];

      for (const { sp, desc } of invalidCombinations) {
        const val = validateAndParseCollegeQueryParams(sp);
        assert(!val.isValid, `Invalid parameter prevented: ${desc}`);
        assert(val.errors !== undefined && val.errors.length > 0, `Error message provided for ${desc}`);
      }
    }
  } catch (error) {
    console.error("❌ Unexpected test execution error:", error);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log(`\n========================================`);
  console.log(`📊 FINAL RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrationTests();
