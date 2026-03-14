package dev.silentcraft.sigil.fake;

import java.util.Optional;
import java.util.UUID;

import dev.silentcraft.sigil.domain.entity.Document;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;

public class FakeDocumentRepository implements DocumentRepository {
    public static final String FAKE_DOCUMENT_ID = "00000000-0000-0000-0000-000000000001";
    public static final String FAKE_REVOKED_DOCUMENT_ID = "00000000-0000-0000-0000-000000000002";
    public static final UUID FAKE_DOCUMENT_UUID = UUID.fromString(FAKE_DOCUMENT_ID);
    public static final UUID FAKE_REVOKED_DOCUMENT_UUID = UUID.fromString(FAKE_REVOKED_DOCUMENT_ID);

    @Override
    public <S extends Document> S save(S entity) {
        return null;
    }

    @Override
    public <S extends Document> Iterable<S> saveAll(Iterable<S> entities) {
        return null;
    }

    @Override
    public Optional<Document> findById(UUID uuid) {
        return Optional.empty();
    }

    @Override
    public boolean existsById(UUID uuid) {
        return false;
    }

    @Override
    public Iterable<Document> findAll() {
        return null;
    }

    @Override
    public Iterable<Document> findAllById(Iterable<UUID> uuids) {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public void deleteById(UUID uuid) {

    }

    @Override
    public void delete(Document entity) {

    }

    @Override
    public void deleteAllById(Iterable<? extends UUID> uuids) {

    }

    @Override
    public void deleteAll(Iterable<? extends Document> entities) {

    }

    @Override
    public void deleteAll() {

    }
}
