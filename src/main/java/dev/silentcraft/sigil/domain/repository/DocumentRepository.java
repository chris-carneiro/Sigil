package dev.silentcraft.sigil.domain.repository;


import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import dev.silentcraft.sigil.domain.entity.Document;

@Repository
public interface DocumentRepository extends CrudRepository<Document, UUID> {
}
