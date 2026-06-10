# Diagram Patterns

Use these conventions when a user asks for a named technical diagram.

## Architecture

- Group nodes by tier: client, edge, service, data, external.
- Use swimlanes or grouped containers when boundaries matter.
- Put bus or event-stream nodes near the center of publisher/subscriber rows.
- Use cylinders for databases, rounded rectangles for services, dashed outlines for external systems.

## ERD

- Model tables as containers with rows for columns.
- Mark primary keys and foreign keys in labels.
- Use dashed relationship edges when cardinality is not fully known.
- Prefer top-to-bottom layout for schemas with multiple relation clusters.

## UML Class

- Use a class box split into name, fields and methods.
- Use hollow triangle arrows for inheritance, dashed hollow triangle for interface implementation.
- Keep interfaces or abstract bases above concrete classes.

## Sequence

- Lay participants left-to-right and time top-to-bottom.
- Keep request, response and async message styles visually distinct.
- Add activation boxes only when they clarify nested work.

## ML / Deep Learning

- Show tensor shape on a second line when it matters.
- Group encoder, decoder, embedding, attention and output stages.
- Route skip connections around the primary flow.

## Flowchart

- Use ovals for start/end, rectangles for process, diamonds for decisions.
- Label decision branches.
- Merge branches back to a central path when possible.
