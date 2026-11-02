---
name: devbook-api-endpoint
description: Add or change a REST API endpoint the Devbook way - OpenAPI first, validation, access checks, problem-details errors, pagination, idempotency and tests. Use when asked to add, change or remove an API endpoint, route or webhook.
license: CC-BY-4.0
---

# API endpoint

1. Read `.devbook/instructions/api-data.md` and the project's API conventions doc (API-06).
2. Update the OpenAPI document first: path, method, parameters, request and response schemas, error codes and examples (API-01). If a change breaks clients (API-04), stop and ask.
3. Implement:
   - Authorise on the server per object and property (SEC-01). Validate the request with a schema generated from, or matching, the OpenAPI document (SEC-02), and reject unknown fields (API-05).
   - Use the method and status-code rules (API-12 to API-14), and RFC 9457 problem details for every error (API-02).
   - Lists paginate (API-03, API-22). Creates that clients may retry accept `Idempotency-Key` (API-23). Updates use `ETag` and `If-Match` where lost updates matter (API-24).
   - Rate limits and size caps apply (SEC-11).
4. Test the contract: success, each validation error, unauthenticated, forbidden, not found, and the edge cases of pagination or idempotency it uses (TEST-01). Run the contract tests against the OpenAPI document.
5. Update the API docs and changelog. Report the endpoint, the tests and any open questions.
