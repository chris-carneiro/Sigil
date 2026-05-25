import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DownloadPage from '../../../components/download/DownloadPage';

describe('DownloadPage reducer', () => {
    it('should have default case that returns state', () => {
        // Mock window.location for testing
        const originalLocation = window.location;
        delete (window as unknown as { location: unknown }).location;
        window.location = {
            ...originalLocation,
            pathname: '/documents/download/test-id',
            hash: '#test-key',
        } as Location;

        render(
            <MemoryRouter>
                <DownloadPage />
            </MemoryRouter>,
        );
        expect(screen.getByText(/You've received a document privately sent/i)).toBeInTheDocument();

        // Restore
        window.location = originalLocation;
    });
});
