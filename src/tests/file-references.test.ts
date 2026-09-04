import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FileReferences } from '../resources/file-references';
import { HttpClient } from '../http-client';

describe('FileReferences', () => {
  let fileReferences: FileReferences;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    fileReferences = new FileReferences(httpClient);
  });

  it('should reconcile file references', async () => {
    const mockResponse = { reconciled: true };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(mockResponse);

    const request = {
      resourceType: 'product',
      resourceId: 'prod_123',
      references: [{ fileId: 'file_123', field: 'media.gallery[0]' }],
    };

    const result = await fileReferences.reconcile(request);

    expect(result).toEqual(mockResponse);
    expect(postSpy).toHaveBeenCalledWith('/file_references/reconcile', request);
  });

  it('should validate resource identifiers', async () => {
    await expect(fileReferences.reconcile({} as any)).rejects.toThrow('Validation failed');
  });
});
