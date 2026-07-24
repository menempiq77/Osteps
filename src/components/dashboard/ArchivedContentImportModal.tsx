"use client";

import { Alert, Button, Empty, Modal, Select, Spin } from "antd";

export type ArchivedImportItem = {
  id: string;
  name: string;
};

export type ArchivedImportSource = {
  subjectId: number;
  subjectName: string;
  items: ArchivedImportItem[];
};

type Props = {
  open: boolean;
  loading: boolean;
  importing: boolean;
  noun: "assessment" | "quiz" | "tracker";
  activeSubjectName?: string;
  sources: ArchivedImportSource[];
  selectedSourceSubjectId: number | null;
  selectedItemIds: string[];
  onSourceChange: (subjectId: number) => void;
  onItemsChange: (itemIds: string[]) => void;
  onCancel: () => void;
  onImport: () => void;
};

export default function ArchivedContentImportModal({
  open,
  loading,
  importing,
  noun,
  activeSubjectName,
  sources,
  selectedSourceSubjectId,
  selectedItemIds,
  onSourceChange,
  onItemsChange,
  onCancel,
  onImport,
}: Props) {
  const selectedSource =
    sources.find((source) => source.subjectId === selectedSourceSubjectId) ??
    null;
  const plural = noun === "quiz" ? "quizzes" : `${noun}s`;

  return (
    <Modal
      title={`Import ${plural} from an archived subject`}
      open={open}
      onCancel={onCancel}
      onOk={onImport}
      okText={`Import ${
        selectedItemIds.length > 0 ? selectedItemIds.length : ""
      } ${selectedItemIds.length === 1 ? noun : plural}`.replace("  ", " ")}
      okButtonProps={{
        disabled:
          loading ||
          !selectedSourceSubjectId ||
          selectedItemIds.length === 0,
        loading: importing,
        className: "!bg-primary !border-primary",
      }}
      cancelButtonProps={{ disabled: importing }}
      maskClosable={!importing}
      closable={!importing}
      centered
      width={640}
    >
      <div className="space-y-4">
        <Alert
          type="info"
          showIcon
          message={`Copy ${noun} content, not historical results`}
          description={`The selected ${plural} and their content will be copied into ${
            activeSubjectName ?? "this active subject"
          }. Imported copies start unassigned. The archived originals and all student history remain unchanged.`}
        />

        {loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <Spin />
          </div>
        ) : sources.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={`No ${plural} were found in archived subjects.`}
          />
        ) : (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Archived subject
              </label>
              <Select
                className="w-full"
                value={selectedSourceSubjectId}
                onChange={onSourceChange}
                options={sources.map((source) => ({
                  value: source.subjectId,
                  label: `${source.subjectName} (${source.items.length} ${
                    source.items.length === 1 ? noun : plural
                  })`,
                }))}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                {plural[0].toUpperCase() + plural.slice(1)} to import
              </label>
              <Select
                mode="multiple"
                allowClear
                className="w-full"
                value={selectedItemIds}
                placeholder={`Choose one or more ${plural}`}
                onChange={onItemsChange}
                maxTagCount="responsive"
                options={(selectedSource?.items ?? []).map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
              {selectedSource &&
                selectedItemIds.length < selectedSource.items.length && (
                  <Button
                    type="link"
                    className="!px-0"
                    onClick={() =>
                      onItemsChange(selectedSource.items.map((item) => item.id))
                    }
                  >
                    Select all {selectedSource.items.length}
                  </Button>
                )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
