import { validateAndParseCollegeQueryParams } from "../lib/validations/college";

function runValidationTests() {
  console.log("🧪 Running College API Validation & Parser Tests...\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: unknown) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`, detail || "");
      failed++;
    }
  }

  // 1. Default request
  {
    const sp = new URLSearchParams();
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === true, "Default request is valid");
    assert(res.data?.page === 1, "Default page is 1");
    assert(res.data?.pageSize === 10, "Default pageSize is 10");
    assert(res.data?.sortBy === "rating", "Default sortBy is rating");
    assert(res.data?.search === undefined, "Default search is undefined");
  }

  // 2. Keyword Search
  {
    const sp = new URLSearchParams({ search: "Bombay" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === true, "Search parameter 'Bombay' is valid");
    assert(res.data?.search === "Bombay", "Parsed search matches input");

    // Also support 'q' alias
    const sp2 = new URLSearchParams({ q: "Delhi" });
    const res2 = validateAndParseCollegeQueryParams(sp2);
    assert(res2.data?.search === "Delhi", "Search parameter alias 'q' is supported");
  }

  // 3. Location Filters (State, City)
  {
    const sp = new URLSearchParams({ state: "Maharashtra", city: "Mumbai" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === true, "Location filters are valid");
    assert(res.data?.state === "Maharashtra", "State filter parsed");
    assert(res.data?.city === "Mumbai", "City filter parsed");
  }

  // 4. Fee Range Filters
  {
    const sp = new URLSearchParams({ minFee: "100000", maxFee: "300000" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === true, "Fee range 100k-300k is valid");
    assert(res.data?.minFee === 100000, "minFee parsed correctly");
    assert(res.data?.maxFee === 300000, "maxFee parsed correctly");
  }

  // 5. Rating Filter
  {
    const sp = new URLSearchParams({ minRating: "4.5" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === true, "Rating filter 4.5 is valid");
    assert(res.data?.minRating === 4.5, "minRating parsed correctly");
  }

  // 6. Sorting Combinations
  {
    for (const sortOpt of ["fee_asc", "fee_desc", "nirf", "name", "newest", "rating"]) {
      const sp = new URLSearchParams({ sortBy: sortOpt });
      const res = validateAndParseCollegeQueryParams(sp);
      assert(res.isValid === true && res.data?.sortBy === sortOpt, `SortBy '${sortOpt}' is valid`);
    }
  }

  // 7. Pagination Combinations
  {
    const sp = new URLSearchParams({ page: "3", pageSize: "25" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === true, "Page 3 and pageSize 25 are valid");
    assert(res.data?.page === 3, "Page 3 parsed");
    assert(res.data?.pageSize === 25, "pageSize 25 parsed");
  }

  // 8. Invalid Parameters: minFee > maxFee
  {
    const sp = new URLSearchParams({ minFee: "500000", maxFee: "200000" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === false, "minFee > maxFee is flagged as invalid");
    assert(
      Boolean(res.errors?.some((e) => e.field === "feeRange")),
      "Error includes 'feeRange' field"
    );
  }

  // 9. Invalid Parameters: Negative Fee
  {
    const sp = new URLSearchParams({ minFee: "-500" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === false, "Negative minFee is rejected");
    assert(
      Boolean(res.errors?.some((e) => e.field === "minFee")),
      "Error includes 'minFee' field"
    );
  }

  // 10. Invalid Parameters: Rating > 5 or < 0
  {
    const sp1 = new URLSearchParams({ minRating: "6.5" });
    const res1 = validateAndParseCollegeQueryParams(sp1);
    assert(res1.isValid === false, "Rating 6.5 (> 5) is rejected");

    const sp2 = new URLSearchParams({ minRating: "-1" });
    const res2 = validateAndParseCollegeQueryParams(sp2);
    assert(res2.isValid === false, "Rating -1 (< 0) is rejected");
  }

  // 11. Invalid Parameters: Invalid Enum Ownership
  {
    const sp = new URLSearchParams({ ownership: "UNKNOWN_TYPE" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === false, "Invalid ownership enum value is rejected");
    assert(
      Boolean(res.errors?.some((e) => e.field === "ownership")),
      "Error includes 'ownership' field"
    );
  }

  // 12. Invalid Parameters: Invalid Pagination (0 or negative page, pageSize > 50)
  {
    const sp1 = new URLSearchParams({ page: "0" });
    const res1 = validateAndParseCollegeQueryParams(sp1);
    assert(res1.isValid === false, "Page 0 is rejected");

    const sp2 = new URLSearchParams({ pageSize: "100" });
    const res2 = validateAndParseCollegeQueryParams(sp2);
    assert(res2.isValid === false, "PageSize 100 (> 50) is rejected");
  }

  // 13. Invalid Parameters: Unknown sortBy
  {
    const sp = new URLSearchParams({ sortBy: "popularity" });
    const res = validateAndParseCollegeQueryParams(sp);
    assert(res.isValid === false, "Unknown sortBy is rejected");
    assert(
      Boolean(res.errors?.some((e) => e.field === "sortBy")),
      "Error includes 'sortBy' field"
    );
  }

  console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runValidationTests();
