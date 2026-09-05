import { type HTMLAttributes, type ReactNode, type ThHTMLAttributes, type TdHTMLAttributes } from 'react';

export interface TableColumn<TRow> {
  /** Column key. */
  key: string;
  /** Header text. */
  header: ReactNode;
  /** Cell renderer. */
  render: (row: TRow, index: number) => ReactNode;
  /** Optional column header props (align, scope, etc.). */
  thProps?: ThHTMLAttributes<HTMLTableCellElement>;
  /** Optional cell props. */
  tdProps?: TdHTMLAttributes<HTMLTableCellElement>;
}

export interface TableProps<TRow> extends Omit<HTMLAttributes<HTMLTableElement>, 'children'> {
  columns: TableColumn<TRow>[];
  rows: TRow[];
  /** Optional row key extractor. Default uses index. */
  rowKey?: (row: TRow, index: number) => string | number;
  /** Apply zebra striping. */
  zebra?: boolean;
  /** Render a placeholder when rows is empty. */
  empty?: ReactNode;
}

/**
 * Table — dense, hairline-bordered data table. Use for ranked lists,
 * ledger views, and any tabular data the user is reading.
 *
 * For charts and small inline data, use Row. For sortable / paginated
 * tables, layer on top — Table is presentation only.
 *
 * @example
 *   <Table
 *     zebra
 *     columns={[
 *       { key: 't', header: 'Ticker', render: (r) => r.t },
 *       { key: 'p', header: 'Price', render: (r) => r.p.toFixed(2), thProps: { style: { textAlign: 'right' } }, tdProps: { style: { textAlign: 'right' } } },
 *       { key: 'd', header: 'Δ', render: (r) => r.d, thProps: { style: { textAlign: 'right' } }, tdProps: { style: { textAlign: 'right' } } },
 *     ]}
 *     rows={data}
 *   />
 */
export function Table<TRow>({ columns, rows, rowKey, zebra = false, empty, className, ...rest }: TableProps<TRow>) {
  const cls = ['ax-table', zebra && 'ax-table--zebra', className].filter(Boolean).join(' ');
  if (rows.length === 0 && empty) return <div className="ax-mute" style={{ padding: 'var(--gap-22)' }}>{empty}</div>;
  return (
    <table className={cls} {...rest}>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} {...c.thProps}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={rowKey ? rowKey(r, i) : i}>
            {columns.map((c) => (
              <td key={c.key} {...c.tdProps}>
                {c.render(r, i)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
