# Graph Report - .  (2026-05-04)

## Corpus Check
- Corpus is ~8,635 words - fits in a single context window. You may not need a graph.

## Summary
- 51 nodes · 47 edges · 3 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 1,000 input · 500 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Course & Enrollment Flow|Course & Enrollment Flow]]
- [[_COMMUNITY_Faculty & User Management|Faculty & User Management]]
- [[_COMMUNITY_UI Components|UI Components]]

## God Nodes (most connected - your core abstractions)
1. `Firestore: users` - 7 edges
2. `Firestore: enrollments` - 5 edges
3. `Firestore: courses` - 5 edges
4. `showToast()` - 3 edges
5. `logout()` - 2 edges
6. `ensureContainer()` - 2 edges
7. `Firestore: courseFaculty` - 2 edges
8. `Firestore: grades` - 2 edges
9. `Firestore: studentParents` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (13 total, 0 thin omitted)

### Community 1 - "Course & Enrollment Flow"
Cohesion: 0.28
Nodes (3): Firestore: courses, Firestore: enrollments, Firestore: grades

### Community 2 - "Faculty & User Management"
Cohesion: 0.29
Nodes (3): Firestore: courseFaculty, Firestore: studentParents, Firestore: users

### Community 3 - "UI Components"
Cohesion: 0.33
Nodes (3): ensureContainer(), showToast(), logout()

## Knowledge Gaps
- **1 isolated node(s):** `Firestore: studentParents`
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Firestore: users` connect `Faculty & User Management` to `Course & Enrollment Flow`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `logout()` connect `UI Components` to `Authentication`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `Firestore: enrollments` connect `Course & Enrollment Flow` to `Faculty & User Management`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `Firestore: studentParents` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._