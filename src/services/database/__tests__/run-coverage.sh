#!/bin/bash

# Run unit tests with coverage for database services

echo "Running KOL2024Service tests with coverage..."
npm test -- --coverage --collectCoverageFrom='src/services/database/KOL2024Service.ts' src/services/database/__tests__/KOL2024Service.complete.test.ts

echo -e "\n\nRunning InsightSearchService tests with coverage..."
npm test -- --coverage --collectCoverageFrom='src/services/database/InsightSearchService.ts' src/services/database/__tests__/InsightSearchService.test.ts

echo -e "\n\nRunning all database service tests with combined coverage..."
npm test -- --coverage --collectCoverageFrom='src/services/database/*.ts' --collectCoverageFrom='!src/services/database/__mocks__/*' --collectCoverageFrom='!src/services/database/__tests__/*' src/services/database/__tests__/*.test.ts