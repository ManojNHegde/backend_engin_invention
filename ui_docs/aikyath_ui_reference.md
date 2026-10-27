# Aikyath Desktop UI Pattern Standard

## 1. Purpose

Aikyath applications should feel like one product family.

Different applications may have different business workflows and screens, but the
overall UI language should remain consistent.

This document defines the general UI pattern to follow when building any Aikyath
desktop application.

It is a UI/design reference, not a business or domain specification.

---

# 2. Core Principle

## Same Aikyath language, different application

Each application may define:

- its own business workflows
- its own navigation structure
- its own domain-specific fields
- its own tables and reports
- its own actions

But it should use the same overall:

- visual language
- spacing system
- typography
- sizing conventions
- interaction patterns
- responsive behavior
- form patterns
- table patterns
- dialog patterns
- sheet/panel patterns
- button hierarchy
- search behavior
- feedback patterns

The user should feel that Accounting, Mail, and other Aikyath applications
belong to the same ecosystem.

---

# 3. UI Should Be Pattern-Driven

Do not design every screen independently.

Before creating a new UI element, ask:

> "Does Aikyath already have a pattern for this?"

Prefer an existing Aikyath pattern over creating a new visual treatment.

Examples:

- Existing button pattern → use the same visual hierarchy.
- Existing text-field pattern → use the same field structure.
- Existing table pattern → use the same header, row and interaction behavior.
- Existing dialog pattern → use the same sizing and spacing language.
- Existing search pattern → use the same search interaction.
- Existing page-header pattern → use the same title/action arrangement.

The objective is consistency, not visual creativity on every screen.

---

# 4. Design Tokens First

UI should be driven by shared design tokens rather than arbitrary values.

Important token categories include:

- Colors
- Typography
- Font sizes
- Font weights
- Spacing
- Corner radius
- Component heights
- Layout dimensions
- Sidebar dimensions
- Title-bar dimensions
- Dialog dimensions
- Responsive breakpoints
- Status tones
- Chart colors
- Interaction states

Avoid introducing arbitrary values directly inside individual screens when an
existing token or pattern already represents the same concept.

---

# 5. Layout Pattern

Aikyath desktop screens should generally follow a structured application frame.

Typical structure:

    Application Shell
        ├── Navigation
        ├── Page / Workspace
        │     ├── Page Header
        │     ├── Filters / Search / Actions
        │     └── Main Content
        └── Contextual overlays / sheets / dialogs

The exact navigation and content structure can differ by application.

The overall visual hierarchy should remain familiar.

---

# 6. Page Hierarchy

A screen should make the following hierarchy obvious:

1. Where am I?
2. What is this page about?
3. What can I do here?
4. What information is important?
5. What is the primary action?
6. What are secondary or destructive actions?

Prefer a consistent pattern such as:

    Page Header
        Title
        Supporting information
        Primary / secondary actions

    Content
        Search / filters
        Main data
        Supporting information

Avoid screens where every button, field and section has equal visual importance.

---

# 7. Spacing Pattern

Use consistent spacing between:

- Page sections
- Form fields
- Labels and controls
- Table sections
- Cards
- Dialog content
- Buttons
- Navigation items
- Headers and content

Spacing should communicate hierarchy.

For example:

    Page
      ↓
    Section
      ↓
    Field group
      ↓
    Field

Avoid arbitrary spacing added individually to every widget.

---

# 8. Typography Pattern

Typography should communicate hierarchy rather than decoration.

Use consistent styles for:

- Page titles
- Section titles
- Field labels
- Supporting text
- Table headers
- Table values
- Status text
- Navigation text
- Dialog titles
- Error/warning messages

Aikyath applications should not introduce unrelated font sizes or weights for
similar semantic purposes.

---

# 9. Form Pattern

Forms should follow a common structure.

Example:

    Section Title

    Field Label
    Input

    Field Label
    Input

    Supporting / validation text

    Actions

Common behavior should remain consistent for:

- Focus
- Disabled state
- Error state
- Placeholder
- Keyboard interaction
- Submission
- Validation
- Required fields

Domain-specific forms may contain different fields, but their visual and
interaction language should remain the same.

---

# 10. Button Pattern

Buttons should communicate action hierarchy.

Use consistent distinction between:

- Primary action
- Secondary action
- Ghost / low-emphasis action
- Destructive action
- Icon-only action

Do not invent a new button appearance simply because a new screen needs a
different action.

The meaning of a button should be understandable from its visual treatment.

---

# 11. Table Pattern

Tables are especially important for Aikyath desktop applications.

Tables should have consistent patterns for:

- Column headers
- Row height
- Cell spacing
- Alignment
- Selection
- Hover state
- Empty state
- Loading state
- Pagination
- Sorting
- Responsive behavior

Accounting may have financial tables while Mail may have message tables, but
they should still feel like Aikyath tables.

---

# 12. Search and Filter Pattern

Search should behave consistently across applications.

Where applicable:

- Search field appearance should remain familiar.
- Focus behavior should be consistent.
- Loading should be communicated.
- Empty results should have a consistent treatment.
- Errors should not silently disappear.
- Keyboard interaction should be predictable.
- Mobile/compact layouts should have an appropriate adapted presentation.

Do not create a completely different search experience for each application.

---

# 13. Dialog Pattern

Dialogs should follow a common Aikyath structure:

    Dialog
      ├── Title
      ├── Supporting information
      ├── Content
      └── Actions

Use consistent:

- Width behavior
- Padding
- Title hierarchy
- Button placement
- Destructive-action treatment
- Close behavior
- Responsive behavior

Business-specific content can change; the dialog language should not.

---

# 14. Sheet / Panel Pattern

Sheets and contextual panels should follow a common interaction model.

They should have predictable:

- Opening behavior
- Closing behavior
- Dismissal behavior
- Keyboard handling
- Scrim behavior
- Responsive behavior
- Ownership/lifecycle

A desktop panel and a compact/phone panel may use different presentation
mechanisms, but the interaction should still feel like the same Aikyath system.

---

# 15. Cards and Containers

Cards should be used when they help communicate grouping or hierarchy.

Avoid unnecessary card nesting.

Containers should communicate:

- grouping
- separation
- importance
- context

Do not use borders, shadows or backgrounds merely for decoration.

---

# 16. States Must Be Consistent

Every reusable UI pattern should consider:

- Normal
- Hover
- Focus
- Pressed
- Disabled
- Loading
- Empty
- Error
- Warning
- Success
- Destructive

The visual language for these states should be shared across applications.

For example:

    Disabled button
        ↓
    same disabled behavior everywhere

    Error field
        ↓
    same error language everywhere

    Warning
        ↓
    same warning treatment everywhere

---

# 17. Responsive Pattern

Responsive behavior is part of the UI pattern.

Do not simply shrink the desktop UI.

When the available width changes:

- navigation may collapse
- actions may move
- panels may change presentation
- search may become a dedicated screen
- tables may adapt
- dialogs may change sizing
- content may become full-width

The important principle is:

> Preserve the user's workflow while adapting the presentation.

The existing Shell work demonstrates that desktop and phone presentations can
differ while retaining the same underlying interaction semantics. :contentReference[oaicite:1]{index=1}

---

# 18. Desktop First, Responsive by Pattern

For Aikyath desktop applications:

- Design the desktop workflow first.
- Define how the same workflow behaves at smaller widths.
- Do not create a completely separate product experience.
- Reuse the same design language and interaction concepts.

Responsive behavior should be deliberate rather than accidental.

---

# 19. Navigation Pattern

Navigation should consistently communicate:

- Current location
- Available sections
- Important actions
- Context
- Selected state

Where appropriate, navigation may contain:

- Sections
- Groups
- Badges
- Collapsible areas
- History/recent actions

The exact navigation structure belongs to the application.

The visual language belongs to Aikyath.

---

# 20. Feedback Pattern

User feedback should use consistent patterns for:

- Success
- Warning
- Error
- Informational messages
- Loading
- Empty states

Prefer reusable feedback patterns instead of application-specific notification
styles.

---

# 21. Interaction Principle

Aikyath UI should feel predictable.

Similar actions should behave similarly across applications.

Examples:

    Save
        → same primary-action language

    Delete
        → same destructive-action language

    Search
        → same search interaction

    Open details
        → same contextual interaction pattern

    Edit
        → same form/action language

Predictability is more important than novelty.

---

# 22. Shell vs Application Responsibility

The Aikyath Shell/design system should provide the general UI language.

The application should provide domain behavior.

### Shell / common UI concerns

- Theme
- Tokens
- Typography
- Spacing
- Buttons
- Fields
- Tables
- Dialogs
- Sheets
- Search
- Navigation patterns
- Responsive patterns
- Common interaction states

### Application concerns

- Accounting workflows
- Mail workflows
- Domain-specific fields
- Domain-specific reports
- Domain-specific validation
- Domain-specific navigation
- Business rules

Do not move application business logic into the shared UI pattern layer.

---

# 23. Do Not Copy Application-Specific Behavior

When using another Aikyath application's UI as a reference:

COPY THE PATTERN:

- spacing
- hierarchy
- layout language
- visual treatment
- interaction philosophy
- responsive philosophy
- component behavior where it is generic

DO NOT COPY:

- business logic
- routes
- domain models
- authentication flow
- application-specific navigation
- application-specific workflows
- application-specific assumptions

The Shell Sync report itself distinguishes between identical ports, adapted ports
and application-specific behavior. That distinction should be preserved when
using it as a reference. :contentReference[oaicite:2]{index=2}

---

# 24. New Screen Rule

Before implementing a new Aikyath screen:

1. Identify the business workflow.
2. Identify existing Aikyath UI patterns that apply.
3. Reuse the established visual language.
4. Identify anything genuinely new.
5. Define the new pattern only if an existing pattern does not fit.
6. Keep the new pattern consistent with the existing design system.
7. Do not introduce a one-off visual solution without a reason.

---

# 25. New Component Rule

Before creating a new component, ask:

> Can an existing Aikyath pattern solve this?

If yes:
    Reuse it.

If no:
    Define a new pattern.

If the new pattern is likely to be used by multiple applications:
    Consider making it part of the shared UI system.

If it is purely domain-specific:
    Keep it inside the application.

---

# 26. Accounting Application Rule

Accounting should follow the same Aikyath UI language.

For example:

    Voucher Type Creation
        → Aikyath page pattern
        → Aikyath form pattern
        → Aikyath button pattern
        → Aikyath dialog pattern
        → Aikyath table pattern

    Voucher Entry
        → Aikyath page pattern
        → Aikyath field pattern
        → Aikyath table/line-entry pattern
        → Aikyath action pattern
        → Aikyath validation/feedback pattern

The accounting domain determines WHAT the user sees.

The Aikyath UI system determines HOW it looks and behaves.

---

# 27. Consistency Rule

When two Aikyath applications solve similar UI problems, they should look and
behave similarly unless there is a documented reason not to.

Examples:

    Accounting Search ≈ Mail Search
    Accounting Dialog ≈ Mail Dialog
    Accounting Button ≈ Mail Button
    Accounting Table ≈ Mail Table
    Accounting Form Field ≈ Mail Form Field

The data and workflow may be completely different.

The UI language should remain recognizable.

---

# 28. Design Decision Rule

If an application needs something that differs from the existing UI pattern,
classify the difference:

### A. Business-specific
Keep it in the application.

### B. Reusable UI requirement
Consider extending the shared Aikyath UI pattern.

### C. Responsive requirement
Adapt the presentation while preserving the same interaction.

### D. Unclear
Do not silently invent a pattern.
Document the question and decide before implementation.

---

# 29. AI / Claude Implementation Rule

When asking an AI agent to build an Aikyath UI, provide this document as the
UI-pattern reference.

The agent should:

1. Inspect the existing Aikyath UI/design system.
2. Identify applicable existing patterns.
3. Follow the established tokens and visual hierarchy.
4. Reuse patterns instead of inventing new ones.
5. Keep application business logic separate.
6. Adapt patterns for the application's workflow.
7. Avoid copying unrelated application-specific behavior.
8. Flag conflicts or missing patterns instead of silently making design decisions.

---

# 30. Final Principle

## Aikyath should have one recognizable UI language.

Applications are allowed to be different.

The UI should not feel unrelated.

Business logic changes.

Screens change.

Workflows change.

But the underlying Aikyath design language should remain consistent.