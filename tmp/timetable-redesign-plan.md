# Timetable — Redesign Plan

## What's wrong with the current one (why it feels confusing)
1. **It's tied to calendar dates, not a repeating week.** You navigate "14 Jun – 20 Jun", and every lesson is saved against one specific date. Schools think in a *repeating weekly* timetable, not date-by-date. This is the #1 source of confusion.
2. **Sunday lessons can't even be saved.** The grid shows Sun–Thu, but the server only accepts Mon–Fri (and has a "Thrusday" typo). So a Gulf-style Sun–Thu week silently fails.
3. **Too many overlapping tools:** Copy Week, Copy To Classes, Import, Periods, Generate (a separate auto-solver page), A/B alternating weeks, a "Manager" sidebar with 4 modes, plus a separate Calendar page. Overwhelming.
4. **Unclear scope** — it's opened "inside Islamic", so it's not obvious whether you're editing the whole school or one subject.

## The new concept (simple + powerful)
A single **Timetable** area built around a **repeating weekly grid** (Periods × Days). Set it once, it repeats every week. Works for a normal school or a fully online school.

### 1. Setup (once)
- **School days:** tick the days your school runs — supports Sun–Thu, Mon–Fri, Mon–Sat… anything.
- **Periods & times:** P1 08:00–09:00, breaks/lunch, etc.

### 2. Build (the main screen)
A clean weekly grid. A **"Viewing:" switch** at the top:
- **By Class** (default) — pick a class, fill its week.
- **By Teacher** — see/fill a teacher's whole week.
- **By Room** — room usage.
- **Whole-school overview** — read-only big picture.

To add a lesson: **click an empty cell → small form (Subject, Teacher, Room, optional Online link) → Save.** Click a lesson to edit/delete.
- **Conflict warnings:** red if a teacher or class is double-booked, amber for a room clash.
- **One-click helpers that are actually useful:** "Copy this day to other days" and "Copy this class's week to another class".
- **Online schools:** each lesson can hold a meeting link (Zoom/Meet/Teams). Students get a **Join** button on their timetable.

### 3. View / Share (everyone)
- **Admin/HOD:** full edit + all views.
- **Teacher:** their own weekly timetable (and can browse classes).
- **Student:** their class timetable, with Join links for online lessons.
- **Print / Export to PDF**, with "today" highlighted.

## What I'll remove (the "useless" parts)
Date-by-date week navigation, A/B alternating weeks, the separate auto-Generate page, spreadsheet Import, and the multi-mode Manager sidebar. (If you ever want auto-generate back, it's easy to add later.)

## Behind the scenes
- Reuse the existing lessons storage (so nothing is lost) but use it the **repeating-weekly** way (day + time, no fixed date).
- Small safe server fix so **all 7 days** are accepted (fixes the Sunday bug + the "Thrusday" typo).
- Make it **school-wide** (not locked to one subject).

## Result
One easy screen: set your days/periods once, then click cells to drop in lessons. Clear views for classes, teachers, rooms, and the whole school; students and teachers just see their own — online or in person.
