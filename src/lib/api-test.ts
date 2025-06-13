/**
 * API Testing Utilities
 * Run this file with: npx tsx src/lib/api-test.ts
 */

const BASE_URL = 'http://localhost:3000/api';

interface TestCase {
  name: string;
  method: string;
  url: string;
  expectedStatus: number;
}

const testCases: TestCase[] = [
  {
    name: 'KOL List - Basic',
    method: 'GET',
    url: '/kol',
    expectedStatus: 200,
  },
  {
    name: 'KOL List - With Pagination',
    method: 'GET',
    url: '/kol?page=1&pageSize=10',
    expectedStatus: 200,
  },
  {
    name: 'KOL List - With Search',
    method: 'GET',
    url: '/kol?q=test&page=1&pageSize=5',
    expectedStatus: 200,
  },
  {
    name: 'KOL List - With Filters',
    method: 'GET',
    url: '/kol?platform=YouTube&region=US&page=1&pageSize=10',
    expectedStatus: 200,
  },
  {
    name: 'KOL Details',
    method: 'GET',
    url: '/kol/test-account',
    expectedStatus: 200, // or 404 if not found
  },
  {
    name: 'Insight Search - Basic',
    method: 'GET',
    url: '/insight/search',
    expectedStatus: 200,
  },
  {
    name: 'Insight Search - With Keyword',
    method: 'GET',
    url: '/insight/search?keyword=marketing&page=1&pageSize=10',
    expectedStatus: 200,
  },
  {
    name: 'Insight Search - With Filters',
    method: 'GET',
    url: '/insight/search?region=US&language=en&minVolume=1000&maxVolume=10000',
    expectedStatus: 200,
  },
  {
    name: 'Video Creators - Basic',
    method: 'GET',
    url: '/insight/video/creators',
    expectedStatus: 200,
  },
  {
    name: 'Video Creators - With Search',
    method: 'GET',
    url: '/insight/video/creators?q=fashion&page=1&pageSize=10',
    expectedStatus: 200,
  },
  {
    name: 'Video Creators - With Filters',
    method: 'GET',
    url: '/insight/video/creators?minFollowers=10000&maxFollowers=1000000&creatorType=fashion',
    expectedStatus: 200,
  },
  {
    name: 'Consumer Voice - Basic',
    method: 'GET',
    url: '/insight/consumer-voice',
    expectedStatus: 200,
  },
  {
    name: 'Consumer Voice - With Region',
    method: 'GET',
    url: '/insight/consumer-voice?region=US',
    expectedStatus: 200,
  },
  {
    name: 'Consumer Voice - With All Filters',
    method: 'GET',
    url: '/insight/consumer-voice?region=US&language=en&category=technology',
    expectedStatus: 200,
  },
];

async function runTests() {
  console.log('🧪 Running API Tests...\n');

  let passed = 0;
  let failed = 0;

  for (const test of testCases) {
    try {
      const response = await fetch(`${BASE_URL}${test.url}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.status === test.expectedStatus) {
        console.log(`✅ ${test.name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${data.success}`);
        if (data.pagination) {
          console.log(`   Results: ${data.data?.length || 0} of ${data.pagination.total}`);
        }
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Expected: ${test.expectedStatus}, Got: ${response.status}`);
        console.log(`   Error: ${data.error || 'Unknown error'}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
    }
    console.log('');
  }

  console.log('\n📊 Test Summary:');
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${testCases.length}`);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };