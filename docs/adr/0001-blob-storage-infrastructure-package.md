# 0001 — BlobStorage - Infrastructure & Domain decoupling

## Status

Accepted

## Context

The problem was that without a dedicated infrastructure package, storage implementations would have ended up in the
domain layer, violating OCP and coupling business logic to technical details.

## Decision

The interface lives in domain/repository (BlobStorage), the implementation lives in storage/ — so storage depends on
domain, never the reverse.

## Consequences

- Future needs regarding storage should be added to the /storage package and implement the BlobStorage interface,
  extending the capabilities of the system without modifying the logic in place.

- New developers must remember to implement the BlobStorage interface from the infrastructure
  storage package and the abstraction makes the call chain harder to navigate.