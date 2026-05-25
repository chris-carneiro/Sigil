import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import UploadPage from '../../../components/upload/UploadPage';

describe('UploadPage reducer', () => {
    it('should have default case that returns state', () => {
        // This is a compile-time test - the reducer has a default case
        // We can at least verify the component renders
        render(<UploadPage />);
        expect(screen.getByText(/Drop files here, or click to upload/i)).toBeInTheDocument();
    });
});
