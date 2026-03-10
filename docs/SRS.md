# Software Requirement Specification (SRS)

## Product Name
PolicyWise AI

## Version
1.0

## Product Type
AI-powered Web Application

## Target Market
India

## Insurance Domain
Car Insurance

---

# 1. Introduction

## 1.1 Purpose

The purpose of this document is to describe the functional and non-functional requirements of the PolicyWise AI system.

This document provides a detailed specification of the system behavior, features, and constraints for developers, project managers, and stakeholders.

---

## 1.2 Scope

PolicyWise AI is a web-based platform designed to help users understand, compare, and evaluate car insurance policies using artificial intelligence.

The system provides:

• AI-powered insurance explanations  
• Policy comparisons  
• Personalized policy recommendations  
• Claim scenario guidance  

The system focuses initially on **car insurance policies in India**.

---

## 1.3 Definitions

| Term | Description |
|-----|-------------|
| AI Assistant | Conversational AI that answers insurance questions |
| Policy | Insurance contract between company and user |
| IDV | Insured Declared Value |
| RAG | Retrieval Augmented Generation |
| Add-ons | Extra coverage options in insurance |

---

# 2. Overall Description

## 2.1 Product Perspective

PolicyWise AI is a standalone web application that integrates:

• Frontend web interface  
• Backend API server  
• AI language model services  
• Vector database for knowledge retrieval  
• Relational database for policy data

The system interacts with external AI APIs to generate intelligent responses.

---

## 2.2 Product Functions

Main system capabilities:

• Answer insurance-related questions  
• Explain insurance terminology  
• Recommend insurance policies  
• Compare policies from multiple providers  
• Provide claim scenario guidance

---

## 2.3 User Classes

### General Users

Car owners searching for insurance information.

Permissions:

• Ask questions  
• Compare policies  
• View recommendations

---

### System Administrator (Future)

Manages system data.

Permissions:

• update insurance data  
• manage policy information  
• monitor system usage

---

## 2.4 Operating Environment

Supported platforms:

• Desktop web browsers  
• Mobile web browsers

Supported browsers:

• Chrome  
• Edge  
• Firefox  
• Safari

---

## 2.5 Design Constraints

Constraints include:

• dependency on external AI APIs  
• accuracy of insurance data sources  
• regulatory compliance in insurance domain

---

## 2.6 Assumptions and Dependencies

Assumptions:

• insurance policy data is available from public sources  
• AI models provide accurate explanations  
• internet connectivity is available

Dependencies:

• AI API providers  
• cloud hosting infrastructure

---

# 3. System Features

---

# 3.1 AI Insurance Assistant

## Description

Allows users to ask questions about car insurance policies.

## Input

User question in natural language.

Example:

"What is zero depreciation cover?"

## Processing

The system:

1. processes the query  
2. retrieves relevant insurance information  
3. generates AI response  

## Output

Clear explanation in simple language.

---

# 3.2 Insurance Term Explanation

## Description

Provides definitions for insurance terminology.

## Input

User searches insurance term.

Example:

"IDV"

## Output

Definition with explanation and example.

---

# 3.3 Policy Recommendation System

## Description

Recommends insurance policies based on user inputs.

## Input

• car model  
• location  
• budget  
• coverage preference  

## Processing

System filters available policies and ranks them.

## Output

Top recommended insurance policies.

---

# 3.4 Policy Comparison Tool

## Description

Allows users to compare multiple policies.

## Comparison Parameters

• premium cost  
• coverage amount  
• add-ons  
• claim settlement ratio  

## Output

Comparison table showing policy differences.

---

# 3.5 Claim Scenario Guidance

## Description

Users can ask claim-related questions.

Example:

"If my car is damaged during a flood, can I claim insurance?"

## Output

Explanation of claim eligibility conditions.

---

# 4. External Interface Requirements

---

## 4.1 User Interface

The UI will include:

• AI chat interface  
• policy recommendation form  
• policy comparison dashboard  
• insurance search functionality

The UI must be:

• simple  
• responsive  
• easy to understand

---

## 4.2 API Interface

Backend APIs include:

POST /api/ask  
Handles AI questions

POST /api/recommend  
Returns recommended policies

GET /api/policies  
Returns available policies

POST /api/compare  
Compares policies

---

## 4.3 Hardware Interface

No special hardware requirements.

The system runs on standard web browsers.

---

## 4.4 Software Interface

The system integrates with:

• AI model APIs  
• vector database systems  
• relational databases

---

# 5. Functional Requirements

FR-1  
System must allow users to ask insurance-related questions.

FR-2  
System must provide simplified explanations of insurance terminology.

FR-3  
System must recommend insurance policies based on user input.

FR-4  
System must allow users to compare insurance policies.

FR-5  
System must retrieve information from insurance knowledge base.

FR-6  
System must generate AI responses using language models.

---

# 6. Non-Functional Requirements

---

## Performance

AI response time should be under 4 seconds.

API response time should be under 500 milliseconds.

---

## Reliability

System uptime must be at least 99%.

---

## Scalability

The system should support at least 1000 concurrent users.

---

## Security

System must implement:

• secure HTTPS communication  
• input validation  
• protection against malicious queries

---

## Usability

The system interface must be intuitive and easy for non-technical users.

---

# 7. System Data Requirements

System stores:

• insurance companies  
• policies  
• policy attributes  
• policy add-ons  
• coverage details

---

# 8. Future System Enhancements

Future versions may include:

• policy PDF analysis  
• AI claim risk prediction  
• personal insurance advisor  
• multi-insurance support

---Proj

# 9. Acceptance Criteria

The system will be considered successful if:

• users can ask insurance questions and receive clear answers  
• policy recommendations are generated correctly  
• policy comparisons work accurately  
• system performs reliably under expected usage

---

# End of SRS