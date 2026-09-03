/** Per-request controls that do not change the operation payload. */
export interface RequestMeta {
  /** Idempotency key used to safely retry mutation requests. */
  idempotency_key?: string;
}
