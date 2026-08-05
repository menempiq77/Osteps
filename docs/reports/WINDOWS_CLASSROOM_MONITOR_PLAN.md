# Windows Classroom Monitor Plan

## 1. Status
This file saves the plan only.
No implementation work is included in this document.

## 2. Goal
Build a Classroom Cloud style teacher monitor inside OSTEPS so teachers can open a class, see students as cards, view live screen thumbnails for managed Windows devices, click a student card to enlarge the view, send messages, and later apply stronger controls.

## 3. Core Decision
This feature will be Windows-first.

The monitor will have two capability levels:
- Browser-only monitoring for all schools and all devices.
- Managed Windows monitoring for schools that install an OSTEPS Windows agent on student laptops.

Silent screen viewing is only possible for enrolled Windows devices with the OSTEPS agent installed.
It cannot be done silently from the website alone.

## 4. High-Level Design
The solution has four parts:
- OSTEPS teacher dashboard.
- OSTEPS backend APIs and realtime session broker.
- OSTEPS Windows agent on student laptops.
- School rollout and device enrollment flow.

### 4.1 Teacher Dashboard
Teachers use OSTEPS as the main control surface.

Planned teacher experience:
- Open a class.
- Switch to a new `Monitor` mode on the class page.
- See each student as a card, similar to Classroom Cloud.
- For enrolled Windows devices, see a small live screen thumbnail inside the card.
- Click a student card to enlarge and watch that screen.
- Send a message to one student or to the class.
- Later, use managed controls such as lock rules.

Primary UI anchor in the current project:
- `src/components/dashboard/StudentList.tsx`

### 4.2 Browser-Only Baseline
Before silent monitoring is ready, OSTEPS should support a browser-only classroom monitor for everyone.

This baseline can show:
- Online or offline.
- Idle or active.
- In OSTEPS or away from the tab.
- Exam fullscreen or exam incident state where relevant.
- Disconnected state.

This baseline cannot show silent live thumbnails.

### 4.3 Windows Agent
The OSTEPS Windows agent is a small background app or service installed on school-managed student laptops.

Main responsibilities:
- Start with Windows sign-in.
- Authenticate the device to OSTEPS.
- Link the device to the correct school, class, and student.
- Capture low-resolution screen thumbnails.
- Support click-to-watch sessions for teachers.
- Receive teacher commands such as message and later managed lock policies.
- Report device presence and health.

### 4.4 Backend Realtime Layer
The current project does not yet contain websocket, WebRTC, or signaling infrastructure.

The backend layer will need to handle:
- Device registration.
- Teacher authorization.
- Session brokering.
- Thumbnail stream transport.
- Watch session control.
- Audit logging.
- Device command delivery.

## 5. How It Will Work

### 5.1 Teacher Workflow
1. Teacher opens a class in OSTEPS.
2. Teacher selects `Monitor` mode.
3. OSTEPS loads student cards.
4. Each card shows one of two modes:
- Browser-only status mode.
- Managed Windows live thumbnail mode.
5. Teacher clicks a card to open a larger live view.
6. Teacher can send a message from the card or the enlarged view.
7. Later, teacher can use managed controls for enrolled Windows devices.

### 5.2 Student And Device Workflow
1. School installs the OSTEPS Windows agent on student laptops.
2. The agent starts when Windows starts.
3. The agent signs in or is provisioned for the correct school environment.
4. The agent maintains a secure connection to OSTEPS.
5. The agent sends device status and low-resolution thumbnails.
6. When a teacher opens a watch session, the agent sends the larger monitored stream.

### 5.3 Mixed Device Behavior
Because many schools use mixed devices, OSTEPS must degrade cleanly.

Expected behavior:
- Enrolled Windows laptops show live thumbnails.
- Non-enrolled Windows devices show status-only mode.
- Other device types show status-only mode unless a future device-specific client is built.

## 6. Planned Phases

### Phase 1: Browser-Only Monitor
Purpose:
- Ship a useful classroom monitor UI first.

Includes:
- New `Monitor` mode on the class page.
- Student cards with status indicators.
- Online, offline, idle, active, disconnected, and OSTEPS presence signals.
- Teacher message action.
- Reuse of current lesson and exam status signals where available.

Does not include:
- Silent live screen thumbnails.
- Whole-device control.

### Phase 2: Windows Managed Pilot
Purpose:
- Add Classroom Cloud style thumbnails and click-to-watch for enrolled Windows devices.

Includes:
- Windows agent pilot.
- Device enrollment flow.
- Small live thumbnails inside student cards.
- Click-to-watch enlarged view.
- Teacher-to-student message action from the same monitor UI.

Does not initially include:
- Full lock and unlock rules for every device state.
- Broad website restriction controls.

### Phase 3: Managed Controls
Purpose:
- Add stronger teacher controls after the Windows pilot is stable.

Possible additions:
- Managed lock or unlock rules.
- Restricted website policy integration.
- More classroom control actions.

## 7. Windows Rollout Options
Possible deployment approaches:
- Manual installer for pilot schools.
- Group Policy rollout.
- Intune rollout.

Recommended start:
- Manual installer for a small pilot.
- Move to Group Policy or Intune after the pilot is stable.

## 8. Security And Privacy Requirements
This feature must include:
- Device enrollment approval at school level.
- Teacher authorization checks by class and role.
- Audit logs for watch sessions, messages, and managed actions.
- Clear school policy for monitored devices.
- Visible monitored-session indicator even on managed devices.

## 9. Current Project Anchors
Useful existing files for future implementation:
- `src/components/dashboard/StudentList.tsx` for the class page and student cards.
- `src/components/dashboard/ClassStoryPanel.tsx` for class-scoped polling behavior.
- `src/services/notificationsApi.ts` for teacher-to-student notifications and messaging patterns.
- `src/components/assessment/PdfAssessmentAnnotator.tsx` for fullscreen, exam incident, and OSTEPS-only lock patterns.
- `package.json` as the current proof that realtime monitoring infrastructure is not yet installed.

## 10. Out Of Scope For Now
Not planned in the first implementation:
- Silent monitoring on unmanaged BYOD devices.
- Website-only silent full-screen viewing.
- Full OS control without an installed Windows agent.

## 11. Success Criteria
The plan is successful when:
- Teachers can open a class and switch to a monitor view.
- Student cards render clearly and scale like Classroom Cloud.
- Enrolled Windows devices show live thumbnails.
- Teachers can click a card to enlarge and watch.
- Non-enrolled devices still appear with useful status information.
- All actions are logged and limited by school and class permissions.
