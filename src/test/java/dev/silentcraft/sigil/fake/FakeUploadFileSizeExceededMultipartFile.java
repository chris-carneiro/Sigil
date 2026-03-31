package dev.silentcraft.sigil.fake;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

public class FakeUploadFileSizeExceededMultipartFile extends MockMultipartFile {
    public FakeUploadFileSizeExceededMultipartFile(String name, byte... content) {
        super(name, content);
    }

    @Override
    public byte[] getBytes() {
        throw new MaxUploadSizeExceededException(1L);
    }
}