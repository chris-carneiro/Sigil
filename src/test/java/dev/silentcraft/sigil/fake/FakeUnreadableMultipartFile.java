package dev.silentcraft.sigil.fake;

import java.io.IOException;

import org.springframework.mock.web.MockMultipartFile;

public class FakeUnreadableMultipartFile extends MockMultipartFile {
    public FakeUnreadableMultipartFile(String name, byte... content) {
        super(name, content);
    }

    @Override
    public byte[] getBytes() throws IOException {
        throw new IOException("disk error");
    }
}