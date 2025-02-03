# OR Scheduling App
 
# **Product Requirements Document (PRD)**
**Project**: OR Nurse Assignment Application (Hybrid Approach)  

---

## **1. Overview**

### **1.1 Purpose and Background
This document defines the requirements for a **web application** that assigns nurses to operating rooms (ORs) for preoperative protocols. It aims to streamline how a single user (manager or charge nurse) inputs next-day OR schedules and nurse availability, automatically generating an optimal assignment under a range of constraints. The project also includes **AI enhancements** for learning from user overrides, predicting nurse absenteeism, providing a conversational UI, and optionally incorporating nurse preference surveys.

### **1.2 Scope**
1. **Manual Data Input**  
   - Due to HIPAA, the manager must **manually enter** all OR details (floor, label, service) and nurse data (name, role, shift).  
   - No auto-fetching from external systems is allowed.

2. **Core Scheduling Constraints**  
   - **2 protocols max** per nurse, with **only 1** protocol of 45–60 min.  
   - **At least 1 RN** per 3 nurses.  
   - Each 3-nurse group: **2 early** starts + **1 late** start (covering breaks).  
   - Surgeries must be **evenly distributed** among assigned nurses.  
   - **Shift distribution**:
     - **5:45–6:00 a.m.** (18 nurses, more RNs than LPNs)  
     - **10:00–11:00 a.m.** (7 nurses, more RNs than LPNs)  
     - Single-shift nurses: 12:00 p.m. (RN), 1:00 p.m. (Charge RN, fixed), 3:00 p.m. (LPN)  
   - **Switching Rules**:
     - Early starts can only switch among themselves, late starts among themselves.
     - The **1:00 p.m. Charge RN** is fixed (no switching).
     - The **12:00 p.m. RN** and **3:00 p.m. LPN** can switch but are less likely (soft constraint).

3. **Floor/OR Management**  
   - **12 ORs** on Floor 2, **15 ORs** on Floor 3.  
   - OR numeric labels (e.g., “25,” “28,” “40”) can **change** any given day; the user must be able to rename them.

4. **Float Nurses**  
   - Any nurse not assigned to specific protocols becomes a “float” nurse for coverage.

5. **Daily Variety**  
   - Attempt to avoid assigning a nurse to the same specialty on consecutive days (a soft constraint for nurse satisfaction).

6. **Real‐time Updates**  
   - The user can reassign or modify the schedule at any time; the solver can be re-run if surgery or nurse data changes.

7. **AI/Constraint Logic**  
   - A Python microservice (OR-Tools, PuLP, etc.) calculates optimal or near-optimal assignments after data entry.

8. **Audit & Reporting**  
   - Final schedule approvals (and any overrides) are logged with timestamps and user ID.  
   - PDF export of the final schedule.

### **1.3 Goals & Objectives**
1. **Reduce Manual Effort**: Provide automated scheduling while respecting HIPAA constraints.  
2. **Ensure Constraints**: Guarantee correct coverage, distribution of protocols, and shift groupings.  
3. **Adaptability**: Re-run schedules in under **5 minutes** if changes occur.  
4. **Low Maintenance**: Use free-tier deployment with minimal overhead.  
5. **AI Enhancements**:
   - **Learning from Overrides** (manager preferences)  
   - **Predictive Staffing** (absenteeism forecasting)  
   - **Conversational UI** (NLP-based schedule queries and edits)  
   - **Nurse Preference Surveys** (optional, low priority)

---

## **2. Key Features & Requirements**

### **2.1 Manual Schedule Input (HIPAA‐Compliant)**
- The manager must **manually input**:
  - Each OR’s floor (2 or 3) and the numeric label (e.g., 25, 28), plus service if relevant.
  - Surgeries: start time, specialty, protocol length (30 or 45–60 min).
  - Nurse data: name, role (RN/LPN), shift start/end, and whether they are the 1 p.m. Charge RN or other special role.
- **No external data** is auto-fetched or integrated.

### **2.2 Intelligent Assignment Generation**
- **Constraint Solver** (Python microservice) produces a recommended schedule after user data entry.
- Honors all constraints (max 2 protocols, 1 RN per group of 3, 2 early + 1 late, daily variety, etc.).

### **2.3 Real‐Time Modifications / Reassignments**
- The user can override the solver’s recommended schedule.
- If surgeries or nurse shifts change, the solver can be re-run on updated data.

### **2.4 Approvals & Audit Trail**
- Every final schedule approval is **logged** with timestamp, user ID, and details.
- System retains each “approved” version for reference, enabling managers to review historical schedules.

### **2.5 Export to PDF**
- Upon approval, the system can generate a **PDF** summarizing:
  - OR assignments, nurse names, protocol times, and any float nurses or special roles.

### **2.6 Learning from Overrides (AI Enhancement)**
- The system captures **recommended vs. final** assignments whenever the user overrides the solver.
- Over time, a **preference model** is trained to reduce repeated overrides.

### **2.7 Predictive Staffing (Absenteeism) (AI Enhancement)**
- The system can store **nurse attendance logs** and train a model to predict call-out probabilities on a given day.
- High-risk nurses may be assigned fewer protocols or flagged to keep more float coverage.

### **2.8 Conversational UI (AI Enhancement)**
- An **NLP-based interface** allows the manager to type or speak requests such as:
  - “Move Nurse Alice to Ortho,” or “Show me how many RNs are scheduled on Floor 3.”
- The system parses these commands into partial constraints or queries, updating the schedule or returning info.

### **2.9 Nurse Preference Surveys (AI Enhancement, Low Priority)**
- Optionally, gather direct nurse input on specialties/shifts they like or dislike.
- These preferences feed into the solver as **soft constraints**, improving nurse satisfaction if no conflict with higher-priority constraints.

---

## **3. Users & Use Cases**

### **3.1 User Description**
- **Single Manager/Charge Nurse** who logs in daily to input data, generate assignments, override as needed, and finalize the schedule.

### **3.2 Typical Use Case Flow**
1. **User** logs in.
2. **User** manually enters:
   - OR numbering scheme (for floors 2 and 3).
   - Surgeries (times, specialties, lengths).
   - Nurse details (name, role, shift).
3. **System** (Spring Boot) stores data in PostgreSQL.
4. **User** clicks “Generate Assignments.”
5. **Solver** (Python microservice) references constraints **+** AI features (override preference model, absentee risk, etc.) to produce a recommended schedule.
6. **User** reviews and can override or use **Conversational UI** to tweak.
7. **User** approves final schedule → system logs in Audit and allows PDF export.
8. If changes occur, steps 5–7 can be repeated.

---

## **4. Functional Requirements**

Below is a **single, comprehensive** list of Functional Requirements, merging **core scheduling** and **AI** features:

| **ID**   | **Requirement**                                                                                                                                                                                                                                            | **Priority**    |
|:--------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|
| **FR-1** | The system shall allow **manual input** of all OR details (floor, label, service) – no auto-fetch (HIPAA compliance).                                                                                                                                      | High           |
| **FR-2** | The system shall allow **manual input** of nurse details (name, role: RN/LPN, shift start/end) – no auto-fetch.                                                                                                                                            | High           |
| **FR-3** | The system shall permit classification of surgeries by **protocol length** (30 min or 45–60 min). Each nurse can handle **only 1 long protocol**.                                                                                                          | High           |
| **FR-4** | The system shall enforce **2 protocols max** per nurse.                                                                                                                                                                                                    | High           |
| **FR-5** | The system shall enforce **1 RN** in every group of 3 nurses.                                                                                                                                                                                              | High           |
| **FR-6** | The system shall enforce each 3-nurse group to have **2 early starts + 1 late start**.                                                                                                                                                                     | High           |
| **FR-7** | The system shall maintain shift distributions of: <ul><li>18 early (5:45–6:00 a.m.), with RNs > LPNs.</li><li>7 late (10:00–11:00 a.m.), RNs > LPNs.</li><li>12 p.m. RN (soft switching), 1 p.m. Charge RN (fixed), 3 p.m. LPN (soft switching).</li></ul>  | High           |
| **FR-8** | The system shall allow switching **only** among nurses in the same start block (early or late), except the **1:00 p.m. Charge RN** who cannot switch. The **12:00 p.m. RN** and **3:00 p.m. LPN** can switch but are less likely (soft constraint).                                               | High           |
| **FR-9** | The system shall keep surgeries **evenly distributed** among nurses/OR pairs.                                                                                                                                                                             | Medium         |
| **FR-10**| The system shall allow **dynamic OR numbering** (12 on floor 2, 15 on floor 3) for each day’s schedule.                                                                                                                                                   | High           |
| **FR-11**| Any nurse **unassigned** to a specific surgery is designated a **float nurse**.                                                                                                                                                                           | Medium         |
| **FR-12**| The system shall attempt **daily variety** by not assigning a nurse to the same specialty on consecutive days (soft constraint).                                                                                                                          | Medium         |
| **FR-13**| The system shall expose a **REST endpoint** (or function) to “Generate Assignments” via the Python microservice.                                                                                                                                           | High           |
| **FR-14**| The user shall be able to **override** or modify any recommended assignment.                                                                                                                                                                              | High           |
| **FR-15**| The system shall maintain an **audit log** of final approvals and overrides (timestamp, user ID, details).                                                                                                                                                | High           |
| **FR-16**| The system shall **generate a PDF** of the approved schedule.                                                                                                                                                                                              | Medium         |
| **FR-17**| The system shall **re-run assignments** upon changes (cancellation, new data) with minimal friction.                                                                                                                                                      | Medium         |
| **FR-18**| The system shall **store recommended vs. final** assignments for potential **learning from overrides**.                                                                                                                                                   | Medium/High    |
| **FR-19**| The system shall incorporate an **override preference model** that penalizes likely overrides in future scheduling runs (based on historical override data).                                                                                              | Medium         |
| **FR-20**| The system shall store **nurse attendance** logs to **predict absenteeism**.                                                                                                                                                                              | Medium/High    |
| **FR-21**| The solver shall factor in **call-out probability** (from the absentee model) to reduce scheduling risk or prompt extra float coverage.                                                                                                                   | Medium/High    |
| **FR-22**| Provide a **Conversational UI** that interprets natural language commands (e.g., “Move Nurse X to Y”), applying them to the schedule.                                                                                                                      | Medium         |
| **FR-23**| (Optional, low priority) The system shall collect **nurse preference surveys** (liked specialties/shifts) and incorporate these as soft constraints if feasible.                                                                                        | Low            |

---

## **5. Non-Functional Requirements**

### **5.1 Performance**
- The **assignment generation** (constraint solving + AI logic) can take up to **5 minutes**.
- Only **one** user uses the system at a time, so concurrency is low.

### **5.2 Reliability & Maintenance**
- Deploy on free-tier services (e.g., Render, Railway) with Docker containers.
- Minimal overhead, stable for daily usage.
- Data (attendance, overrides) must be stored reliably to support AI features.

### **5.3 Security**
1. **HTTPS**: All endpoints must be encrypted.
2. **User Authentication**: Secure password hashing (BCrypt or similar).
3. **Audit Trails**: All final approvals and overrides are logged for accountability.
4. **HIPAA Compliance**: No patient data is stored, and any staff data is user-entered only.

### **5.4 Usability**
- **React UI** with clear forms for manual data entry of ORs, surgeries, nurses.
- **Conversational UI** (NLP) as an alternative interface for scheduling commands or queries.
- Straightforward override controls and PDF export.

### **5.5 Portability**
- Dockerized deployment (Spring Boot, Python microservice).
- PostgreSQL for data persistence.

---

## **6. System Architecture**

### **6.1 Overview**

- **React Frontend**  
  - Single Page Application for data entry (ORs, nurses), schedule display, override UI, and optionally an NLP chat component.

- **Spring Boot Backend**  
  - REST endpoints for the React frontend.
  - **Stores** data in **PostgreSQL** (OR definitions, nurse data, surgeries, overrides, attendance).
  - Manages **security** (login, HTTPS) and generates PDF exports.
  - Orchestrates calls to the Python microservice for scheduling.

- **Python Microservice** (Constraint Solver + AI Models)  
  - Exposed via REST (FastAPI/Flask).
  - **Constraint solving** with OR-Tools/PuLP, factoring in shift constraints, daily variety, etc.
  - **AI** Models:
    1. **Override preference**: Learns from historical overrides.
    2. **Absentee prediction**: Classifies each nurse’s call-out risk.
    3. Optionally references nurse survey preferences (low priority).

- **Database (PostgreSQL)**
  - Tables for surgeries, nurses, OR definitions, assignments, override logs, attendance logs, etc.

### **6.2 Data Model (Simplified)**

- **ORDefinition**(  
  *id*, floorNumber, label, serviceName, …  
)

- **Nurse**(  
  *id*, name, role(RN/LPN), shiftStart, shiftEnd, specialRole (e.g., “Charge RN”), …  
)

- **Surgery**(  
  *id*, orId(FK), startTime, specialty, protocolLength (30 or 45–60), …  
)

- **Assignment**(  
  *id*, nurseId(FK), surgeryId(FK), assignmentDate, finalOrRecommended, version, …  
)

- **AuditLog**/ **OverrideLog**(  
  *id*, assignmentId(FK), timestamp, userId, oldValue, newValue, reason, …  
)

- **AttendanceLog**(  
  *id*, nurseId(FK), date, absent(yes/no), reason, …  
)

- **NursePreference** (*optional for survey feature*)  
  *id*, nurseId(FK), specialty, preferenceScore (like/dislike), …

---

## **7. Deployment & Environment**

### **7.1 Hosting**
- **Render** or **Railway** free-tier for:
  - Spring Boot
  - Python microservice
  - PostgreSQL instance

### **7.2 Configuration**
- DB credentials and any shared secrets stored in environment variables.
- TLS/HTTPS termination by hosting platform.

---

## **8. Security & Compliance**
1. **User Authentication**: Manager logs in.
2. **HTTPS**: All traffic encrypted.
3. **Audit Logging**: Detailed logs of overrides/final approvals.
4. **No External Data**: All staff info is user-entered.
5. **Minimal PHI**: Focus only on staff scheduling, no patient info.

---

## **9. AI Enhancements Detail**

### **9.1 Learning from Overrides
- **Override Logging**: Capture each override (nurse from X to Y) with optional reason.
- **Preference Model**: Over time, a classification/regression model (e.g., scikit-learn) identifies patterns.
- **Solver Integration**: Adds a “penalty” for assignments the model expects the user might override.

### **9.2 Predictive Staffing (Absenteeism)
- **Attendance Logging**: Track daily who calls out.
- **Absentee Model**: Predict probability of nurse X calling out on date Y (features like day of week, prior attendance, etc.).
- **Solver**: If a nurse has high absentee risk, solver might assign them fewer protocols or keep more float nurses.

### **9.3 Conversational UI
- **NLP Parsing**: Let the user type “Move Nurse Bob to OR 25 if possible.”
- **Actions**: Update the schedule or re-run solver with partial constraints.
- **Queries**: “Show me how many RNs are unassigned at 6 a.m.?”

### **9.4 Nurse Preference Surveys (Low Priority)
- **Survey**: Nurses rate specialties or shifts they like/dislike.
- **Solver**: Considers these preference scores as a soft constraint, improving nurse satisfaction if no conflict with higher-priority constraints.

---

## **10. Timeline & Milestones**

1. **Phase 1**  
   - Core CRUD for Surgeries, Nurses, OR definitions.
   - Basic constraint solver integration.
   - Deploy DB in free tier.

2. **Phase 2**  
   - **AI Data Collection**: Start logging overrides in detail. Add attendance log table.
   - **Override Learning**: Basic preference model and cost function in solver.
   - **Absenteeism**: Build classification model for call-outs.
   - Integrate both into solver cost function.

3. **Phase 3**  
   - **Conversational UI**: Add an NLP module or third-party API to parse scheduling commands.
   - **PDF Export** + advanced audit logging.
   - Secure with login, SSL, override tracking.

4. **Phase 4** (Optional/Low Priority)  
   - **Nurse Preference Surveys** (like/dislike specialties).
   - Expand solver logic for advanced preference weighting.

---

## **11. Acceptance Criteria**

Below is a **complete** set of acceptance criteria, merging both **core** and **AI** features:

1. **AC-1 (Manual Data Input)**: The user must manually input **all OR info** (floor, label, service) and **all nurse data** (name, role, shift).
2. **AC-2 (Constraint Solving)**: Clicking “Generate Assignments” yields a valid schedule that meets constraints (1 RN/3 nurses, 2 early+1 late, etc.).
3. **AC-3 (Protocol Limits)**: Each nurse has at most 2 protocols, only 1 can be 45–60 min.
4. **AC-4 (Switching)**: Early starts switch only among themselves, late starts only among themselves; 1 p.m. RN is fixed, 12 p.m. RN & 3 p.m. LPN soft.
5. **AC-5 (Float Nurses)**: Any nurse not assigned is flagged as float.
6. **AC-6 (Daily Variety)**: System attempts to avoid repeating nurse specialty on consecutive days (soft).
7. **AC-7 (PDF Export)**: The final schedule can be exported to PDF.
8. **AC-8 (Audit Log)**: All overrides and final approvals appear in an audit log with user/time.
9. **AC-9 (Reassignments)**: The user can re-run the solver or manually adjust assignments in under 5 minutes for changes.
10. **AC-10 (Override Learning)**: The system logs recommended vs. final assignments and uses a preference model to reduce repeated overrides.
11. **AC-11 (Absentee Forecast)**: A classification model identifies high-risk nurses, prompting the solver or user to adjust coverage.
12. **AC-12 (Conversational UI)**: The system can interpret natural language commands (e.g., “Move Nurse X to Ortho”).
13. **AC-13 (Optional Preference Surveys)**: If implemented, nurse preference data is stored and used as soft constraints in the solver.
14. **AC-14 (Security)**: The application is secured via HTTPS and login, with no external data fetch.
15. **AC-15 (Deployment)**: Deployed on a free-tier environment, with Docker containers for Spring Boot, Python microservice, and a free-tier PostgreSQL.

---

## **12. Open Questions**
1. **Override Model Granularity**: Does the system penalize any nurse–specialty assignment that was overridden in the past, or do we refine by day of week/time block?
2. **Absenteeism Data**: Do we have enough nurse attendance history to make predictions? How do we handle new hires with no data?
3. **Conversational UI Complexity**: Should it be a minimal rule-based approach or integrate a more sophisticated NLP/GPT API?
4. **Nurse Preference Surveys**: Is this a periodic form, or a one-time setup? How do we handle changes if nurses modify their preferences?
5. **Multiple Manager Roles**: Will additional roles or permissions be needed if more staff want to access the system?

---

# **Appendix**

### **A. Technology Stack Summary
- **Frontend**: React (SPA), optional NLP/Chat module.
- **Backend**: Spring Boot (Java 17+), Spring Security, PostgreSQL.
- **Constraint Solver + AI**: Python (FastAPI or Flask) + OR-Tools/PuLP, scikit-learn or XGBoost for ML.
- **Hosting**: Render / Railway free tier.
- **Version Control**: GitHub with CI/CD for multi-container deployment.
- **PDF Generation**: iText/OpenPDF (Java) or react-pdf/jspdf.

### **B. Development Tools
- **IDEs**: IntelliJ, VS Code, PyCharm.
- **Build**: Maven/Gradle for Java, pip/conda for Python.
- **Containerization**: Docker (1 container for Spring Boot, 1 for Python solver).

### **C. References
- **OR-Tools**: <https://developers.google.com/optimization>  
- **PuLP**: <https://coin-or.github.io/pulp/>  
- **Render**: <https://render.com>  
- **Railway**: <https://railway.app>
