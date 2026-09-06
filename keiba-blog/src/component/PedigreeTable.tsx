import type { HorsePedigree, PedigreeNode } from "../data/hitokuchiHorses";

const GENERATIONS = 5;
const LEAF_ROWS = 2 ** GENERATIONS;

function ancestor(
  pedigree: HorsePedigree,
  row: number,
  gen: number,
): PedigreeNode | undefined {
  let node: PedigreeNode | undefined =
    row < LEAF_ROWS / 2 ? pedigree.sire : pedigree.dam;
  let index = row % (LEAF_ROWS / 2);
  for (let depth = 2; depth <= gen; depth += 1) {
    if (!node) return undefined;
    const half = LEAF_ROWS / 2 ** depth;
    node = Math.floor(index / half) % 2 === 0 ? node.sire : node.dam;
    index %= half;
  }
  return node;
}

function cellClass(row: number): string {
  return row < LEAF_ROWS / 2 ? "bg-blue-50" : "bg-red-50";
}

/**
 * 父・母から5代目までの血統表。父系は青、母系は赤の背景。
 */
export default function PedigreeTable({ pedigree }: { pedigree: HorsePedigree }) {
  const rows = Array.from({ length: LEAF_ROWS }, (_, row) => row);

  return (
    <section aria-label="5代血統表">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">5代血統表</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-700">
              <th className="border border-gray-200 px-1.5 py-1 font-medium">父・母</th>
              <th className="border border-gray-200 px-1.5 py-1 font-medium">2代</th>
              <th className="border border-gray-200 px-1.5 py-1 font-medium">3代</th>
              <th className="border border-gray-200 px-1.5 py-1 font-medium">4代</th>
              <th className="border border-gray-200 px-1.5 py-1 font-medium">5代</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                {Array.from({ length: GENERATIONS }, (_, i) => i + 1).map((gen) => {
                  const rowSpan = LEAF_ROWS / 2 ** gen;
                  if (row % rowSpan !== 0) return null;
                  const node = ancestor(pedigree, row, gen);
                  return (
                    <td
                      key={gen}
                      rowSpan={rowSpan}
                      className={`border border-gray-200 px-1.5 py-1 align-middle ${cellClass(row)}`}
                    >
                      {node ? (
                        <>
                          <span className="font-medium text-gray-900">{node.name}</span>
                          {node.color ? (
                            <span className="mt-0.5 block text-[10px] text-gray-500">
                              {node.color}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
