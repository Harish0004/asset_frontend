import React from 'react';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className = '',
  showPageSize = false,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  const safePage = clamp(page, 0, totalPages - 1);

  const go = (next) => {
    const clamped = clamp(next, 0, totalPages - 1);
    if (clamped !== safePage) onPageChange(clamped);
  };

  const windowSize = 5;
  const start = Math.max(0, safePage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages - 1, start + windowSize - 1);
  const adjustedStart = Math.max(0, end - windowSize + 1);

  const pages = [];
  for (let p = adjustedStart; p <= end; p += 1) pages.push(p);

  return (
    <div className={`d-flex align-items-center justify-content-between gap-3 flex-wrap ${className}`}>
      <div className="text-muted" style={{ fontSize: '0.85rem' }}>
        Page <span className="fw-semibold text-dark">{safePage + 1}</span> of{' '}
        <span className="fw-semibold text-dark">{totalPages}</span>
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap">
        {showPageSize && (
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              Rows
            </span>
            <select
              className="form-select form-select-sm"
              style={{ width: 90 }}
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="button" className="btn btn-sm btn-light border" onClick={() => go(0)} disabled={safePage === 0}>
          First
        </button>
        <button
          type="button"
          className="btn btn-sm btn-light border"
          onClick={() => go(safePage - 1)}
          disabled={safePage === 0}
        >
          Prev
        </button>

        <div className="d-flex align-items-center gap-1">
          {adjustedStart > 0 && (
            <>
              <button type="button" className="btn btn-sm btn-light border" onClick={() => go(0)}>
                1
              </button>
              {adjustedStart > 1 && <span className="text-muted px-1">…</span>}
            </>
          )}

          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`btn btn-sm border ${p === safePage ? 'btn-primary' : 'btn-light'}`}
              style={p === safePage ? { backgroundColor: '#4F46E5', borderColor: '#4F46E5' } : undefined}
              onClick={() => go(p)}
            >
              {p + 1}
            </button>
          ))}

          {end < totalPages - 1 && (
            <>
              {end < totalPages - 2 && <span className="text-muted px-1">…</span>}
              <button type="button" className="btn btn-sm btn-light border" onClick={() => go(totalPages - 1)}>
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn btn-sm btn-light border"
          onClick={() => go(safePage + 1)}
          disabled={safePage >= totalPages - 1}
        >
          Next
        </button>
        <button
          type="button"
          className="btn btn-sm btn-light border"
          onClick={() => go(totalPages - 1)}
          disabled={safePage >= totalPages - 1}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;

