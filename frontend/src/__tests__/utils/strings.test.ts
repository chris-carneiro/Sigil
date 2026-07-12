import { describe, expect, it } from 'vitest';
import { truncateMiddle } from '../../utils/strings';

describe('truncateMiddle', () => {
    it('should return the same string if shorter than max length', () => {
        expect(truncateMiddle('short.txt')).toBe('short.txt');
    });

    it('should truncate strings at or above max length', () => {
        const exactName = '12345678901234567890';
        const result = truncateMiddle(exactName);
        expect(result).toContain('…');
    });

    it('should truncate long filename with ellipsis in middle', () => {
        const longName = 'very-long-filename-that-exceeds-twenty-characters.txt';
        const result = truncateMiddle(longName);
        expect(result).toContain('…');
    });

    it('should truncate filename longer than max length', () => {
        const name = '123456789012345678901';
        const result = truncateMiddle(name);
        expect(result).toContain('…');
    });
});
