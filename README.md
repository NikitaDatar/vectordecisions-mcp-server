# Vector Decisions MCP Server

MCP-native governance and action-assurance primitives for autonomous AI.

## Tools

- `gatri_trust_score` — legacy composite trust scoring.
- `assure_action` — evidence-backed, context-aware assurance for one agent action.
- `decide_action` — converts GATRI assurance + policy + permissions + context into `ALLOW`, `RESTRICT`, `REQUIRE_HUMAN`, or `DENY`.
- `risk_assessment` — deployment risk assessment.
- `compliance_check` — EU AI Act-oriented policy check.
- `kill_switch` — emergency stop directive.

## Core model

```text
agent × action × context × evidence
                 ↓
              GATRI
                 ↓
        Vector Decisions
                 ↓
      ALLOW / RESTRICT /
      REQUIRE_HUMAN / DENY
```

The important primitive is **action assurance**, not a generic claim that an agent is safe. The same agent can be acceptable for one action and unacceptable for another.

## Local development

```bash
npm install
npm run build
npm start
```

The server uses stdio transport and is intended to be consumed by MCP-compatible clients.

## Status

Version 1.1.0. This is a protocol-oriented V0: deterministic local evaluation first; evidence ingestion, persistent assurance records, policy registries, signed attestations and remote APIs are subsequent layers.
