import { validateDocument } from '../domain/document-validation';

describe('validateDocument', () => {
  it('accepts a valid CPF and returns digits only', () => {
    // 529.982.247-25 is a well-known valid test CPF.
    const result = validateDocument('529.982.247-25');
    expect(result).toEqual({ ok: true, digits: '52998224725' });
  });

  it('rejects a CPF with a wrong check digit', () => {
    const result = validateDocument('529.982.247-24');
    expect(result.ok).toBe(false);
  });

  it('rejects a CPF made of repeated digits', () => {
    const result = validateDocument('111.111.111-11');
    expect(result.ok).toBe(false);
  });

  it('accepts an RG-length document (no national check digit)', () => {
    const result = validateDocument('12.345.678-9');
    expect(result).toEqual({ ok: true, digits: '123456789' });
  });

  it('rejects a document that is too short to be RG or CPF', () => {
    const result = validateDocument('123');
    expect(result.ok).toBe(false);
  });

  it('strips mask characters before validating', () => {
    const masked = validateDocument('529.982.247-25');
    const bare = validateDocument('52998224725');
    expect(masked).toEqual(bare);
  });
});
