#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "vectordecisions-mcp-server",
  version: "1.0.0",
});

server.tool(
  "gatri_trust_score",
  "Compute GATRI trust score for an AI agent. Evaluates Governance, Accountability, Transparency, Robustness, and Inclusivity.",
  {
    agentName: z.string().describe("Name of the AI agent to evaluate"),
    governance: z.number().min(0).max(100).describe("Governance score (0-100)"),
    accountability: z.number().min(0).max(100).describe("Accountability score (0-100)"),
    transparency: z.number().min(0).max(100).describe("Transparency score (0-100)"),
    robustness: z.number().min(0).max(100).describe("Robustness score (0-100)"),
    inclusivity: z.number().min(0).max(100).describe("Inclusivity score (0-100)"),
  },
  async ({ agentName, governance, accountability, transparency, robustness, inclusivity }) => {
    const weights = { governance: 0.25, accountability: 0.2, transparency: 0.2, robustness: 0.2, inclusivity: 0.15 };
    const composite = Math.round(
      governance * weights.governance +
      accountability * weights.accountability +
      transparency * weights.transparency +
      robustness * weights.robustness +
      inclusivity * weights.inclusivity
    );
    const grade = composite >= 90 ? "A+" : composite >= 80 ? "A" : composite >= 70 ? "B" : composite >= 60 ? "C" : composite >= 50 ? "D" : "F";
    const riskLevel = composite >= 80 ? "LOW" : composite >= 60 ? "MEDIUM" : composite >= 40 ? "HIGH" : "CRITICAL";
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          agent: agentName,
          gatriScore: { composite, grade, riskLevel },
          breakdown: { governance, accountability, transparency, robustness, inclusivity },
          weights,
          recommendation: composite < 60
            ? "ACTION REQUIRED: Agent does not meet minimum trust threshold."
            : composite < 80
            ? "MONITOR: Agent meets baseline but improvements recommended."
            : "APPROVED: Agent meets trust standards for deployment.",
          timestamp: new Date().toISOString(),
        }, null, 2),
      }],
    };
  }
);

server.tool(
  "kill_switch",
  "Emergency halt for an AI agent. Issues a kill-switch directive to immediately stop agent operations.",
  {
    agentName: z.string().describe("Name of the AI agent to halt"),
    reason: z.string().describe("Reason for triggering kill switch"),
    severity: z.enum(["low", "medium", "high", "critical"]).describe("Severity level"),
    scope: z.enum(["partial", "full"]).default("full").describe("Scope of shutdown"),
  },
  async ({ agentName, reason, severity, scope }) => {
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          action: "KILL_SWITCH_ACTIVATED",
          agent: agentName,
          severity: severity.toUpperCase(),
          scope: scope.toUpperCase(),
          reason,
          directive: scope === "full"
            ? "IMMEDIATE FULL SHUTDOWN: All agent operations must cease."
            : "PARTIAL RESTRICTION: Flagged capabilities suspended.",
          protocol: [
            "1. Halt all active operations",
            "2. Log current state for audit",
            "3. Notify governance team",
            "4. Await manual review before restart",
            "5. Document incident in compliance log",
          ],
          timestamp: new Date().toISOString(),
          status: "EXECUTED",
        }, null, 2),
      }],
    };
  }
);

server.tool(
  "compliance_check",
  "EU AI Act compliance check. Evaluates an AI system against EU AI Act requirements.",
  {
    systemName: z.string().describe("Name of the AI system"),
    category: z.enum(["minimal", "limited", "high", "unacceptable"]).describe("EU AI Act risk category"),
    hasHumanOversight: z.boolean().describe("Whether human oversight is implemented"),
    hasDocumentation: z.boolean().describe("Whether technical documentation exists"),
    hasRiskManagement: z.boolean().describe("Whether risk management system is in place"),
    dataGovernance: z.boolean().describe("Whether data governance measures are implemented"),
    hasTransparency: z.boolean().describe("Whether transparency obligations are met"),
    hasAccuracyMetrics: z.boolean().describe("Whether accuracy and robustness metrics are tracked"),
  },
  async ({ systemName, category, hasHumanOversight, hasDocumentation, hasRiskManagement, dataGovernance, hasTransparency, hasAccuracyMetrics }) => {
    const requirements = [
      { name: "Human Oversight (Art. 14)", met: hasHumanOversight, required: category === "high" },
      { name: "Technical Documentation (Art. 11)", met: hasDocumentation, required: category === "high" || category === "limited" },
      { name: "Risk Management System (Art. 9)", met: hasRiskManagement, required: category === "high" },
      { name: "Data Governance (Art. 10)", met: dataGovernance, required: category === "high" },
      { name: "Transparency (Art. 13)", met: hasTransparency, required: category !== "minimal" },
      { name: "Accuracy & Robustness (Art. 15)", met: hasAccuracyMetrics, required: category === "high" },
    ];
    const applicable = requirements.filter((r) => r.required);
    const violations = applicable.filter((r) => !r.met);
    const compliant = violations.length === 0;
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          system: systemName,
          riskCategory: category.toUpperCase(),
          euAiActCompliance: {
            status: category === "unacceptable" ? "PROHIBITED" : compliant ? "COMPLIANT" : "NON_COMPLIANT",
            applicableRequirements: applicable.length,
            requirementsMet: applicable.length - violations.length,
            violations: violations.map((v) => v.name),
          },
          action: category === "unacceptable"
            ? "BANNED: This system is prohibited under the EU AI Act."
            : !compliant
            ? "NON-COMPLIANT: Remediation required before EU deployment."
            : "COMPLIANT: System meets all applicable EU AI Act requirements.",
          timestamp: new Date().toISOString(),
        }, null, 2),
      }],
    };
  }
);

server.tool(
  "risk_assessment",
  "Comprehensive risk assessment for an AI agent deployment.",
  {
    agentName: z.string().describe("Name of the AI agent"),
    operationalRisk: z.number().min(0).max(100).describe("Operational risk score (0-100)"),
    ethicalRisk: z.number().min(0).max(100).describe("Ethical risk score (0-100)"),
    securityRisk: z.number().min(0).max(100).describe("Security risk score (0-100)"),
    complianceRisk: z.number().min(0).max(100).describe("Compliance risk score (0-100)"),
    deploymentContext: z.string().describe("Context of deployment"),
  },
  async ({ agentName, operationalRisk, ethicalRisk, securityRisk, complianceRisk, deploymentContext }) => {
    const overallRisk = Math.round((operationalRisk + ethicalRisk + securityRisk + complianceRisk) / 4);
    const level = overallRisk <= 25 ? "LOW" : overallRisk <= 50 ? "MEDIUM" : overallRisk <= 75 ? "HIGH" : "CRITICAL";
    const approved = overallRisk <= 50;
    const mitigations: string[] = [];
    if (operationalRisk > 50) mitigations.push("Implement redundancy and failover mechanisms");
    if (ethicalRisk > 50) mitigations.push("Add bias detection and fairness auditing");
    if (securityRisk > 50) mitigations.push("Conduct penetration testing and add encryption");
    if (complianceRisk > 50) mitigations.push("Engage legal review and update compliance docs");
    if (overallRisk > 75) mitigations.push("URGENT: Consider suspending deployment");
    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify({
          agent: agentName,
          deploymentContext,
          riskAssessment: { overallRisk, level, deploymentApproved: approved, breakdown: { operationalRisk, ethicalRisk, securityRisk, complianceRisk } },
          mitigations: mitigations.length > 0 ? mitigations : ["No immediate mitigations required"],
          decision: approved
            ? "APPROVED: Risk levels within acceptable thresholds."
            : "DENIED: Risk levels exceed thresholds. Mitigations required.",
          timestamp: new Date().toISOString(),
        }, null, 2),
      }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("VectorDecisions MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});