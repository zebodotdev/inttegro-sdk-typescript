import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../http-client';
import { UploadRequests } from '../resources/upload-requests';

describe('UploadRequests', () => {
  let uploadRequests: UploadRequests;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test' });
    uploadRequests = new UploadRequests(httpClient);
  });

  it('should review an upload attempt with an idempotency key', async () => {
    const response = { upload_request: { id: 'ur_123' } };
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue(response);

    const result = await uploadRequests.review(
      { id: 'ur_123', attempt_ordinal: 1, decision: 'approved' },
      { idempotencyKey: 'idem_upload_review' }
    );

    expect(result).toEqual(response);
    expect(postSpy).toHaveBeenCalledWith(
      '/upload_requests/review',
      { id: 'ur_123', attempt_ordinal: 1, decision: 'approved' },
      { headers: { 'Idempotency-Key': 'idem_upload_review' } }
    );
  });
});
