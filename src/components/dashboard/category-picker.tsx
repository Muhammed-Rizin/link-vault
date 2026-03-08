"use client"

import * as React from "react"
import CreatableSelect from "react-select/creatable"
import type { SingleValue, StylesConfig } from "react-select"

type CategoryPickerProps = {
  existingCategories: string[]
  categoryMode: "existing" | "new"
  selectedCategory: string
  newCategoryName: string
  onCategoryModeChange: (mode: "existing" | "new") => void
  onSelectedCategoryChange: (category: string) => void
  onNewCategoryNameChange: (category: string) => void
}

type CategoryOption = {
  label: string
  value: string
}

const selectStyles: StylesConfig<CategoryOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 40,
    borderRadius: 10,
    borderColor: state.isFocused ? "var(--ring)" : "var(--input)",
    backgroundColor: "color-mix(in oklab, var(--background) 85%, transparent)",
    boxShadow: state.isFocused ? "0 0 0 2px color-mix(in oklab, var(--ring) 40%, transparent)" : "none",
    "&:hover": { borderColor: "var(--ring)" },
  }),
  input: (base) => ({
    ...base,
    color: "var(--foreground)",
  }),
  menu: (base) => ({
    ...base,
    border: "1px solid var(--border)",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "var(--popover)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--accent)" : "var(--popover)",
    color: "var(--popover-foreground)",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--foreground)",
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--muted-foreground)",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 70,
  }),
}

function normalize(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

export function CategoryPicker({
  existingCategories,
  categoryMode,
  selectedCategory,
  newCategoryName,
  onCategoryModeChange,
  onSelectedCategoryChange,
  onNewCategoryNameChange,
}: CategoryPickerProps) {
  const [menuPortalTarget, setMenuPortalTarget] = React.useState<HTMLElement | null>(null)
  const [inputValue, setInputValue] = React.useState("")
  const currentValue = categoryMode === "new" ? newCategoryName : selectedCategory

  React.useEffect(() => {
    setMenuPortalTarget(document.body)
  }, [])

  React.useEffect(() => {
    setInputValue("")
  }, [currentValue])

  const options = React.useMemo<CategoryOption[]>(
    () => existingCategories.map((category) => ({ value: category, label: category })),
    [existingCategories]
  )

  const selectedOption = React.useMemo<CategoryOption | null>(() => {
    const normalized = normalize(currentValue)
    if (!normalized) return null
    return { value: normalized, label: normalized }
  }, [currentValue])

  const handleSelectChange = (option: SingleValue<CategoryOption>) => {
    if (!option) return
    setInputValue("")
    const matched = existingCategories.find((category) => category === option.value)
    if (matched) {
      onCategoryModeChange("existing")
      onSelectedCategoryChange(matched)
      onNewCategoryNameChange("")
      return
    }
    onCategoryModeChange("new")
    onNewCategoryNameChange(option.value)
    onSelectedCategoryChange("")
  }

  const handleCreateOption = (inputValue: string) => {
    const nextValue = normalize(inputValue)
    if (!nextValue) return
    setInputValue("")
    const matched = existingCategories.find((category) => normalize(category) === normalize(nextValue))
    if (matched) {
      onCategoryModeChange("existing")
      onSelectedCategoryChange(matched)
      onNewCategoryNameChange("")
      return
    }
    onCategoryModeChange("new")
    onNewCategoryNameChange(nextValue)
    onSelectedCategoryChange("")
  }

  const handleInputChange = (nextInput: string) => {
    setInputValue(nextInput)
    const normalizedInput = normalize(nextInput)
    if (!normalizedInput) return
    const matched = existingCategories.find((category) => normalize(category) === normalizedInput)
    if (matched) {
      onCategoryModeChange("existing")
      onSelectedCategoryChange(matched)
      onNewCategoryNameChange("")
      return
    }
    onCategoryModeChange("new")
    onNewCategoryNameChange(normalizedInput)
    onSelectedCategoryChange("")
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Category</label>
      <CreatableSelect
        value={selectedOption}
        onChange={handleSelectChange}
        onCreateOption={handleCreateOption}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        options={options}
        styles={selectStyles}
        menuPortalTarget={menuPortalTarget ?? undefined}
        classNamePrefix="category-select"
        placeholder="Select or type to create category..."
        formatCreateLabel={(input) => `Create "${input}"`}
        noOptionsMessage={({ inputValue: search }) =>
          search ? `No category found. Create "${search}"` : "Type to search categories"
        }
        isClearable={false}
        isSearchable
      />
      <p className="text-xs text-muted-foreground">Search existing categories or create a new one.</p>
    </div>
  )
}
