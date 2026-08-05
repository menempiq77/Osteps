"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Checkbox, Empty, Modal, Select, Spin, Tag, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useSimilarSubjects } from "@/hooks/useSimilarSubjects";

export type ImportableItem = {
  id: string | number;
  name: string;
  description?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  /** Singular noun used in the copy, e.g. "tracker". */
  itemLabel: string;
  /** Plural noun used in the copy, e.g. "trackers". */
  itemLabelPlural: string;
  loadItems: (sourceSubjectId: number) => Promise<ImportableItem[]>;
  importItem: (item: ImportableItem, sourceSubjectId: number) => Promise<void>;
  onImported?: () => void | Promise<void>;
};

/**
 * Copies content into the active subject from another subject with a matching
 * name (see `subjectSimilarity`) — typically last year's archived twin.
 */
export function ImportFromSimilarSubjectModal({
  open,
  onClose,
  itemLabel,
  itemLabelPlural,
  loadItems,
  importItem,
  onImported,
}: Props) {
  const { similarSubjects, familyLabel, activeSubject, loading } = useSimilarSubjects(open);
  const [sourceSubjectId, setSourceSubjectId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Archived twins hold the content worth importing, so preselect one.
  useEffect(() => {
    const id = setTimeout(() => {
      if (!open) {
        setSourceSubjectId(null);
        // Keep the identity when already empty, so this never re-renders in a loop.
        setSelectedIds((prev) => (prev.length === 0 ? prev : []));
        return;
      }
      if (sourceSubjectId || similarSubjects.length === 0) return;
      const preferred = similarSubjects.find((subject) => subject.archived) ?? similarSubjects[0];
      setSourceSubjectId(Number(preferred.id));
    }, 0);
    return () => clearTimeout(id);
  }, [open, similarSubjects, sourceSubjectId]);

  const {
    data: items = [],
    isFetching: itemsLoading,
    isError: itemsFailed,
  } = useQuery({
    queryKey: ["import-similar-subject-items", itemLabelPlural, sourceSubjectId],
    queryFn: () => loadItems(Number(sourceSubjectId)),
    enabled: open && !!sourceSubjectId,
  });

  useEffect(() => {
    const id = setTimeout(() => setSelectedIds([]), 0);
    return () => clearTimeout(id);
  }, [sourceSubjectId]);

  const allIds = useMemo(() => items.map((item) => String(item.id)), [items]);
  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length;

  const handleImport = async () => {
    if (!sourceSubjectId || selectedIds.length === 0) return;
    const chosen = items.filter((item) => selectedIds.includes(String(item.id)));
    setImporting(true);
    let imported = 0;
    const failed: string[] = [];
    for (const item of chosen) {
      try {
        await importItem(item, sourceSubjectId);
        imported += 1;
      } catch (error) {
        console.error(`[Import] Failed to import ${itemLabel} "${item.name}"`, error);
        failed.push(item.name);
      }
    }
    setImporting(false);

    if (imported > 0) {
      messageApi.success(
        `Imported ${imported} ${imported === 1 ? itemLabel : itemLabelPlural} into ${activeSubject?.name ?? "this subject"}`
      );
      await onImported?.();
    }
    if (failed.length > 0) {
      messageApi.error(`Failed to import: ${failed.join(", ")}`);
    }
    if (failed.length === 0) {
      onClose();
    }
  };

  return (
    <Modal
      title={`Import ${itemLabelPlural} from a similar subject`}
      open={open}
      onCancel={importing ? undefined : onClose}
      footer={null}
      centered
      width={560}
    >
      {contextHolder}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : similarSubjects.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-sm text-gray-500">
              No other subject matches “{familyLabel}”. Import is only offered between subjects
              with the same name or a known alias of it.
            </span>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <Alert
            type="info"
            showIcon
            message={`Copies ${itemLabelPlural} into ${activeSubject?.name ?? "this subject"}. The source subject is left untouched.`}
          />

          <div>
            <p className="mb-1 text-sm font-semibold text-gray-700">Source subject</p>
            <Select
              className="w-full"
              value={sourceSubjectId ?? undefined}
              onChange={(value) => setSourceSubjectId(Number(value))}
              options={similarSubjects.map((subject) => ({
                value: Number(subject.id),
                label: subject.archived ? `${subject.name} (archived)` : subject.name,
              }))}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                {itemLabelPlural.charAt(0).toUpperCase() + itemLabelPlural.slice(1)} to import
              </p>
              {allIds.length > 0 && (
                <Checkbox
                  checked={allSelected}
                  indeterminate={selectedIds.length > 0 && !allSelected}
                  onChange={(event) => setSelectedIds(event.target.checked ? allIds : [])}
                >
                  Select all
                </Checkbox>
              )}
            </div>

            {itemsLoading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : itemsFailed ? (
              <Alert type="error" showIcon message={`Failed to load ${itemLabelPlural}.`} />
            ) : items.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">
                This subject has no {itemLabelPlural} to import.
              </p>
            ) : (
              <div className="max-h-64 overflow-auto rounded-lg border border-gray-200">
                <Checkbox.Group
                  className="!flex !flex-col"
                  value={selectedIds}
                  onChange={(values) => setSelectedIds(values as string[])}
                >
                  {items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-50"
                    >
                      <Checkbox value={String(item.id)}>
                        <span className="text-sm text-gray-800">{item.name}</span>
                      </Checkbox>
                      {item.description ? <Tag color="default">{item.description}</Tag> : null}
                    </label>
                  ))}
                </Checkbox.Group>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} disabled={importing}>
              Cancel
            </Button>
            <Button
              type="primary"
              className="!bg-primary !border-primary"
              loading={importing}
              disabled={selectedIds.length === 0}
              onClick={handleImport}
            >
              Import {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ImportFromSimilarSubjectModal;
